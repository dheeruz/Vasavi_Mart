import express from 'express';
import { getOrders, placeOrder, updateOrderStatus, deleteOrder, orderNotification, updateStatusNotification } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getOrders);
router.post('/', verifyToken, placeOrder);
router.put('/:orderId/status', verifyToken, updateOrderStatus);
router.delete('/:orderId', verifyToken, deleteOrder);

// Legacy routes for compatibility (unprotected for notifications unless needed)
router.post('/place-notify', orderNotification);
router.post('/update-status-notify', updateStatusNotification);

export default router;
