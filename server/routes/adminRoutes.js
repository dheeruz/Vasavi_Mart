import express from 'express';
import { getAdminStats, createUser, updateUser, deleteUser } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.post('/users', verifyToken, isAdmin, createUser);
router.put('/users/:userId', verifyToken, isAdmin, updateUser);
router.delete('/users/:userId', verifyToken, isAdmin, deleteUser);

export default router;
