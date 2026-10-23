import express from 'express';
import { uploadImage, uploadPowerPoint } from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload, uploadPPT } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload image (field name 'image')
router.post('/', protectAdmin, upload.single('image'), uploadImage);

// Upload PowerPoint presentation (field name 'ppt')
router.post('/ppt', protectAdmin, uploadPPT.single('ppt'), uploadPowerPoint);

export default router;
