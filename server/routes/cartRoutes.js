import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addCartItem);
router.put('/:itemId', authMiddleware, updateCartItem);
router.delete('/:itemId', authMiddleware, removeCartItem);

export default router;
