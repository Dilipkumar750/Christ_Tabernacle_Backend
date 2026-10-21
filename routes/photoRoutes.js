import express from 'express';
import {
  getPublicPhotos,
  getAllPhotosAdmin,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from '../controllers/photoController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: fetch photos by category
router.get('/', getPublicPhotos);

// Protected routes (Admin only)
router.get('/all', protectAdmin, getAllPhotosAdmin);
router.post('/', protectAdmin, createPhoto);
router.put('/:id', protectAdmin, updatePhoto);
router.delete('/:id', protectAdmin, deletePhoto);

export default router;
