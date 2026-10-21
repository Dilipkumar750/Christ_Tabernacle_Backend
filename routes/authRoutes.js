import express from 'express';
import { login, getMe, getDashboardStats, changePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.get('/stats', protectAdmin, getDashboardStats);
router.put('/change-password', protectAdmin, changePassword);

export default router;
