const express = require('express');
const router = express.Router();
const { getStats, getUsers, updateUserStatus, deleteUser, getCompanies, getUniversities } = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, roleMiddleware('admin', 'university'), getStats);
router.get('/users', authMiddleware, roleMiddleware('admin', 'university'), getUsers);
router.put('/users/:id/status', authMiddleware, roleMiddleware('admin'), updateUserStatus);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.get('/companies', authMiddleware, roleMiddleware('admin'), getCompanies);
router.get('/universities', authMiddleware, roleMiddleware('admin'), getUniversities);

module.exports = router;
