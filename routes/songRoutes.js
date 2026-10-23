import express from 'express';
import {
  getPublicSongs,
  getSongById,
  getAllSongsAdmin,
  createSong,
  updateSong,
  deleteSong,
  toggleSong,
} from '../controllers/songController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicSongs);
router.get('/:id', getSongById);

// Protected Admin routes
router.get('/all', protectAdmin, getAllSongsAdmin);
router.post('/', protectAdmin, createSong);
router.put('/:id', protectAdmin, updateSong);
router.delete('/:id', protectAdmin, deleteSong);
router.patch('/:id/toggle', protectAdmin, toggleSong);

export default router;
