const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/companyController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, roleMiddleware('company'), getProfile);
router.put('/profile', authMiddleware, roleMiddleware('company'), updateProfile);

module.exports = router;
