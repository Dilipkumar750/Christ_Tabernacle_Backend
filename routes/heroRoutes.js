import express from 'express';
import {
  getPublicHeroSlides,
  getAllHeroSlidesAdmin,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  toggleHeroSlideStatus,
} from '../controllers/heroController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: fetch active slides for public home hero
router.get('/', getPublicHeroSlides);

// Protected routes (Admin only)
router.get('/all', protectAdmin, getAllHeroSlidesAdmin);
router.post('/', protectAdmin, createHeroSlide);
router.put('/:id', protectAdmin, updateHeroSlide);
router.delete('/:id', protectAdmin, deleteHeroSlide);
router.patch('/:id/toggle', protectAdmin, toggleHeroSlideStatus);

export default router;
