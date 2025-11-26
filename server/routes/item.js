const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 모든 품목 조회 (창고 정보 포함)
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query(`
      SELECT i.*, w.warehouse_name
      FROM item i
      LEFT JOIN warehouse w ON i.wherehouse_num = w.warehouse_num
    `);
    connection.release();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 품목 조회
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [item] = await connection.query(`
      SELECT i.*, w.warehouse_name
      FROM item i
      LEFT JOIN warehouse w ON i.wherehouse_num = w.warehouse_num
      WHERE i.item_id = ?
    `, [req.params.id]);
    connection.release();

    if (item.length === 0) {
      return res.status(404).json({ error: '품목을 찾을 수 없습니다' });
    }
    res.json(item[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 창고의 품목 조회
router.get('/warehouse/:warehouse_num', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query(`
      SELECT i.*, w.warehouse_name
      FROM item i
      LEFT JOIN warehouse w ON i.wherehouse_num = w.warehouse_num
      WHERE i.wherehouse_num = ?
    `, [req.params.warehouse_num]);
    connection.release();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 품목 추가
router.post('/', async (req, res) => {
  const { item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO item (item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index) VALUES (?, ?, ?, ?, ?)',
      [item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index]
    );
    connection.release();

    res.status(201).json({ item_id: result.insertId, item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 품목 수정
router.put('/:id', async (req, res) => {
  const { item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE item SET item_name = ?, item_prop = ?, item_filename = ?, wherehouse_num = ?, wherehouse_inside_index = ? WHERE item_id = ?',
      [item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index, req.params.id]
    );
    connection.release();

    res.json({ item_id: req.params.id, item_name, item_prop, item_filename, wherehouse_num, wherehouse_inside_index });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 품목 삭제
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM item WHERE item_id = ?', [req.params.id]);
    connection.release();

    res.json({ message: '품목이 삭제되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
