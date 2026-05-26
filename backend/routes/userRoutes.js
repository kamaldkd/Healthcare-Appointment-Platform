const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDashboardStats } = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// GET /api/users/profile       — logged-in user
router.get('/profile', auth, getProfile);

// PUT /api/users/profile       — logged-in user updates profile
router.put('/profile', auth, updateProfile);

// GET /api/users/admin/stats   — admin dashboard stats
router.get('/admin/stats', auth, adminAuth, getDashboardStats);

module.exports = router;
