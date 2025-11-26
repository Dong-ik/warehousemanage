const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 모든 상세내역 조회 (상품 정보 포함)
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [details] = await connection.query(`
      SELECT d.*, i.item_name, i.item_prop, b.breakdown_day
      FROM itembreakdowndetail d
      LEFT JOIN item i ON d.item_id = i.item_id
      LEFT JOIN itembreakdown b ON d.breakdown_id = b.breakdown_id
    `);
    connection.release();
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 상세내역 조회
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [detail] = await connection.query(`
      SELECT d.*, i.item_name, i.item_prop, b.breakdown_day
      FROM itembreakdowndetail d
      LEFT JOIN item i ON d.item_id = i.item_id
      LEFT JOIN itembreakdown b ON d.breakdown_id = b.breakdown_id
      WHERE d.detail_id = ?
    `, [req.params.id]);
    connection.release();

    if (detail.length === 0) {
      return res.status(404).json({ error: '상세내역을 찾을 수 없습니다' });
    }
    res.json(detail[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 사용내역의 상세내역 조회
router.get('/breakdown/:breakdown_id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [details] = await connection.query(`
      SELECT d.*, i.item_name, i.item_prop, b.breakdown_day
      FROM itembreakdowndetail d
      LEFT JOIN item i ON d.item_id = i.item_id
      LEFT JOIN itembreakdown b ON d.breakdown_id = b.breakdown_id
      WHERE d.breakdown_id = ?
    `, [req.params.breakdown_id]);
    connection.release();
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 상세내역 추가
router.post('/', async (req, res) => {
  const { breakdown_id, item_id, io_type, use_item, add_item, breakdown_content } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO itembreakdowndetail (breakdown_id, item_id, io_type, use_item, add_item, breakdown_content) VALUES (?, ?, ?, ?, ?, ?)',
      [breakdown_id, item_id, io_type || 'OUT', use_item || 0, add_item || 0, breakdown_content]
    );
    connection.release();

    res.status(201).json({
      detail_id: result.insertId,
      breakdown_id,
      item_id,
      io_type: io_type || 'OUT',
      use_item: use_item || 0,
      add_item: add_item || 0,
      breakdown_content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 상세내역 수정
router.put('/:id', async (req, res) => {
  const { breakdown_id, item_id, io_type, use_item, add_item, breakdown_content } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE itembreakdowndetail SET breakdown_id = ?, item_id = ?, io_type = ?, use_item = ?, add_item = ?, breakdown_content = ? WHERE detail_id = ?',
      [breakdown_id, item_id, io_type, use_item, add_item, breakdown_content, req.params.id]
    );
    connection.release();

    res.json({ detail_id: req.params.id, breakdown_id, item_id, io_type, use_item, add_item, breakdown_content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 상세내역 삭제
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM itembreakdowndetail WHERE detail_id = ?', [req.params.id]);
    connection.release();

    res.json({ message: '상세내역이 삭제되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
