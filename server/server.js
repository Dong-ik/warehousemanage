const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트 임포트
const warehouseRoutes = require('./routes/warehouse');
const itemRoutes = require('./routes/item');
const breakdownRoutes = require('./routes/breakdown');
const breakdownDetailRoutes = require('./routes/breakdownDetail');

// API 라우트 마운트
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/breakdown', breakdownRoutes);
app.use('/api/breakdown-detail', breakdownDetailRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '서버 오류' });
});

// 서버 시작
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});
