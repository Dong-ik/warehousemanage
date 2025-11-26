const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 모든 창고 조회
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [warehouses] = await connection.query('SELECT * FROM warehouse');
    connection.release();
    res.json(warehouses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 창고 조회
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [warehouse] = await connection.query('SELECT * FROM warehouse WHERE warehouse_num = ?', [req.params.id]);
    connection.release();

    if (warehouse.length === 0) {
      return res.status(404).json({ error: '창고를 찾을 수 없습니다' });
    }
    res.json(warehouse[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 창고 추가
router.post('/', async (req, res) => {
  const { warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO warehouse (warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager) VALUES (?, ?, ?, ?)',
      [warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager]
    );
    connection.release();

    res.status(201).json({ warehouse_num: result.insertId, warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 창고 수정
router.put('/:id', async (req, res) => {
  const { warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE warehouse SET warehouse_name = ?, warehouse_index = ?, warehouse_inside_filename = ?, warehouse_manager = ? WHERE warehouse_num = ?',
      [warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager, req.params.id]
    );
    connection.release();

    res.json({ warehouse_num: req.params.id, warehouse_name, warehouse_index, warehouse_inside_filename, warehouse_manager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 창고 삭제
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM warehouse WHERE warehouse_num = ?', [req.params.id]);
    connection.release();

    res.json({ message: '창고가 삭제되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
