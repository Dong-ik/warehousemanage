const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const router = express.Router();

// 이미지 저장 경로 설정
const uploadsDir = path.join(__dirname, '..', '..', 'images');

// 디렉토리 확인 및 생성
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// 파일 필터 (이미지 파일만)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// 이미지 업로드
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }

  const imageUrl = `/images/${req.file.filename}`;
  res.json({
    success: true,
    filename: req.file.filename,
    imageUrl: imageUrl,
  });
});

// 이미지 삭제
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsDir, filename);

  // 경로 조작 공격 방지
  if (!filepath.startsWith(uploadsDir)) {
    return res.status(400).json({ error: '잘못된 파일 경로입니다.' });
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '이미지가 삭제되었습니다.' });
  });
});

module.exports = router;
