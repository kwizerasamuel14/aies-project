const express = require('express');
const router = express.Router();
const { createInternship, getInternships, getMyInternships, deleteInternship, updateInternship } = require('../controllers/internshipController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getInternships);
router.post('/', authMiddleware, roleMiddleware('company'), createInternship);
router.get('/mine', authMiddleware, roleMiddleware('company'), getMyInternships);
router.put('/:id', authMiddleware, roleMiddleware('company'), updateInternship);
router.delete('/:id', authMiddleware, roleMiddleware('company'), deleteInternship);

module.exports = router;
