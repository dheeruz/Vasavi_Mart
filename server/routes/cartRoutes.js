import express from 'express';
import { getCart, syncCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/sync', verifyToken, syncCart);

export default router;
