const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/universityController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, roleMiddleware('university'), getProfile);
router.put('/profile', authMiddleware, roleMiddleware('university'), updateProfile);

module.exports = router;
