const pool = require('../config/db');

const createMeeting = async (req, res) => {
  const { student_id, meeting_date, meeting_time, notes } = req.body;
  if (!student_id || !meeting_date || !meeting_time)
    return res.status(400).json({ message: 'Student, date and time are required' });
  try {
    const result = await pool.query(
      `INSERT INTO meetings (supervisor_id, student_id, meeting_date, meeting_time, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.user_id, student_id, meeting_date, meeting_time, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyMeetings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name AS student_name
       FROM meetings m
       JOIN students s ON m.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE m.supervisor_id = $1
       ORDER BY m.meeting_date DESC, m.meeting_time DESC`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM meetings WHERE meeting_id = $1 AND supervisor_id = $2',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createMeeting, getMyMeetings, deleteMeeting };
