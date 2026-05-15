import express from 'express';
import { orderNotification, updateStatusNotification } from '../controllers/orderController.js';

const router = express.Router();

router.post('/place-notify', orderNotification);
router.post('/update-status-notify', updateStatusNotification);

export default router;
