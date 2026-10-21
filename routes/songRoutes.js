import express from 'express';
import {
  getPublicSongs,
  getAllSongsAdmin,
  createSong,
  updateSong,
  deleteSong,
} from '../controllers/songController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: fetch worship lyrics
router.get('/', getPublicSongs);

// Protected routes (Admin only)
router.get('/all', protectAdmin, getAllSongsAdmin);
router.post('/', protectAdmin, createSong);
router.put('/:id', protectAdmin, updateSong);
router.delete('/:id', protectAdmin, deleteSong);

export default router;
