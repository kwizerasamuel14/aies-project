const express = require('express');
const router = express.Router();
const { applyInternship, getMyApplications, getApplicants, getAcceptedApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('student'), applyInternship);
router.get('/my', authMiddleware, roleMiddleware('student'), getMyApplications);
router.get('/review', authMiddleware, roleMiddleware('company'), getApplicants);
router.get('/accepted', authMiddleware, roleMiddleware('company', 'academic_supervisor', 'company_supervisor'), getAcceptedApplications);
router.put('/:id/status', authMiddleware, roleMiddleware('company', 'academic_supervisor', 'company_supervisor'), updateApplicationStatus);

module.exports = router;
