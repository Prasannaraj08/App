import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getCurrentUser, loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
