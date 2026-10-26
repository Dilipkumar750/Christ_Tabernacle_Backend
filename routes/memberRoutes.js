import express from 'express';
import {
  getAllMembersAdmin,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  toggleMemberStatus,
} from '../controllers/memberController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to register a new member (also used by admin)
router.post('/', createMember);

// Protected routes (Admin only)
router.get('/', protectAdmin, getAllMembersAdmin);
router.get('/all', protectAdmin, getAllMembersAdmin);
router.get('/:id', protectAdmin, getMemberById);
router.put('/:id', protectAdmin, updateMember);
router.delete('/:id', protectAdmin, deleteMember);
router.patch('/:id/toggle-status', protectAdmin, toggleMemberStatus);

export default router;
