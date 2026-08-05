const express = require('express');
const router = express.Router();
const { submitEvaluation, getMyEvaluations, getAllEvaluations, getStudentsForEvaluation } = require('../controllers/evaluationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor'), submitEvaluation);
router.get('/my', authMiddleware, roleMiddleware('student'), getMyEvaluations);
router.get('/all', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor', 'university', 'admin'), getAllEvaluations);
router.get('/students', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor', 'university'), getStudentsForEvaluation);

module.exports = router;
