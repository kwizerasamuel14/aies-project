const express = require('express');
const router = express.Router();
const { createInternship, getInternships, getMyInternships, deleteInternship, updateInternship, getAllPostsForAdmin, approvePost, adminDeletePost } = require('../controllers/internshipController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// More specific routes first
router.get('/mine', authMiddleware, roleMiddleware('company'), getMyInternships);
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), getAllPostsForAdmin);
router.put('/admin/:id/approve', authMiddleware, roleMiddleware('admin'), approvePost);
router.delete('/admin/:id', authMiddleware, roleMiddleware('admin'), adminDeletePost);

// Generic routes last
router.get('/', authMiddleware, getInternships);
router.post('/', authMiddleware, roleMiddleware('company'), createInternship);
router.put('/:id', authMiddleware, roleMiddleware('company'), updateInternship);
router.delete('/:id', authMiddleware, roleMiddleware('company'), deleteInternship);

module.exports = router;
