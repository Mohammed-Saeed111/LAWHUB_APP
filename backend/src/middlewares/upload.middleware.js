import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';

// Local disk storage for bar-card uploads (Screen 7). Swap for S3/Cloudinary in prod.
const UPLOAD_DIR = 'uploads/bar-cards';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `barcard_${req.user._id}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(ApiError.badRequest('Only JPG, PNG, or PDF files are allowed.'));
};

export const uploadBarCard = multer({
  storage, fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('barCard');
