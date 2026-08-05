const express = require('express');
const router = express.Router();
const { submitReport, getMyReports, getAllReports, reviewReport } = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('student'), submitReport);
router.get('/my', authMiddleware, roleMiddleware('student'), getMyReports);
router.get('/all', authMiddleware, roleMiddleware('academic_supervisor', 'university', 'admin'), getAllReports);
router.put('/:id/review', authMiddleware, roleMiddleware('academic_supervisor', 'university', 'admin'), reviewReport);

module.exports = router;
