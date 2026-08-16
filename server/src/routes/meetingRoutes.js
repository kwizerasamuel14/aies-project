const express = require('express');
const router = express.Router();
const { createMeeting, getMyMeetings, deleteMeeting } = require('../controllers/meetingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('university', 'company', 'academic_supervisor', 'company_supervisor', 'admin'), createMeeting);
router.get('/my', authMiddleware, roleMiddleware('university', 'company', 'academic_supervisor', 'company_supervisor', 'admin'), getMyMeetings);
router.delete('/:id', authMiddleware, roleMiddleware('university', 'company', 'academic_supervisor', 'company_supervisor', 'admin'), deleteMeeting);

module.exports = router;
