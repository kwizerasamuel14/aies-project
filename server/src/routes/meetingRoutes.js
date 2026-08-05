const express = require('express');
const router = express.Router();
const { createMeeting, getMyMeetings, deleteMeeting } = require('../controllers/meetingController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor'), createMeeting);
router.get('/my', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor'), getMyMeetings);
router.delete('/:id', authMiddleware, roleMiddleware('academic_supervisor', 'company_supervisor'), deleteMeeting);

module.exports = router;
