import express from 'express';
import {
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleApproveTestimonial,
} from '../controllers/testimonialController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes: fetch approved testimonials, or submit a new testimony
router.get('/', getPublicTestimonials);
router.post('/', createTestimonial);

// Protected routes (Admin only)
router.get('/all', protectAdmin, getAllTestimonialsAdmin);
router.put('/:id', protectAdmin, updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);
router.patch('/:id/toggle-approve', protectAdmin, toggleApproveTestimonial);

export default router;
