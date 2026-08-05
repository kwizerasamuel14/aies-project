const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, roleMiddleware('student'), getProfile);
router.put('/profile', authMiddleware, roleMiddleware('student'), updateProfile);

module.exports = router;
