import express from 'express';
import { getWishlist, syncWishlist } from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getWishlist);
router.post('/sync', verifyToken, syncWishlist);

export default router;
