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

// Protected Admin routes
router.get('/all', protectAdmin, getAllSongsAdmin);
router.post('/', protectAdmin, createSong);
router.put('/:id', protectAdmin, updateSong);
router.delete('/:id', protectAdmin, deleteSong);
router.patch('/:id/toggle', protectAdmin, toggleSong);

// Public route for single song by ID (placed after /all to prevent route shadowing)
router.get('/:id', getSongById);

export default router;
