import express from 'express';
import { authenticate, authorize, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'Public route' });
});

// Protected route for all authenticated users
router.get('/protected', authenticate, (req, res) => {
  res.json({ 
    message: 'Protected route',
    user: req.user 
  });
});

// Users only route
router.get('/users-only', authenticate, authorize('user'), (req, res) => {
  res.json({ message: 'Users only route' });
});

// Admin only route
router.get('/admin-only', authenticate, authorizeAdmin(['admin']), (req, res) => {
  res.json({ message: 'Admin only route' });
});

export default router; 