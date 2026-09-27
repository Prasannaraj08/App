import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';
import {
  addProductReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProductReviews,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', authMiddleware, addProductReview);
router.post('/', authMiddleware, adminOnly, createProduct);
router.put('/:id', authMiddleware, adminOnly, updateProduct);
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);

export default router;
