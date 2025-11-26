const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 모든 사용내역 조회
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [breakdowns] = await connection.query('SELECT * FROM itembreakdown ORDER BY breakdown_day DESC');
    connection.release();
    res.json(breakdowns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 특정 사용내역 조회
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [breakdown] = await connection.query('SELECT * FROM itembreakdown WHERE breakdown_id = ?', [req.params.id]);
    connection.release();

    if (breakdown.length === 0) {
      return res.status(404).json({ error: '사용내역을 찾을 수 없습니다' });
    }
    res.json(breakdown[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용내역 추가
router.post('/', async (req, res) => {
  const { breakdown_day } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO itembreakdown (breakdown_day) VALUES (?)',
      [breakdown_day]
    );
    connection.release();

    res.status(201).json({ breakdown_id: result.insertId, breakdown_day });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용내역 수정
router.put('/:id', async (req, res) => {
  const { breakdown_day } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE itembreakdown SET breakdown_day = ? WHERE breakdown_id = ?',
      [breakdown_day, req.params.id]
    );
    connection.release();

    res.json({ breakdown_id: req.params.id, breakdown_day });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용내역 삭제
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM itembreakdown WHERE breakdown_id = ?', [req.params.id]);
    connection.release();

    res.json({ message: '사용내역이 삭제되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
