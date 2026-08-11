const pool = require('../config/db');
const { createNotification } = require('./notificationController');

const submitReport = async (req, res) => {
  const { internship_id, week_number, activities, challenges, skills_learned } = req.body;
  if (!week_number || !activities) return res.status(400).json({ message: 'Week number and activities are required' });
  const internId = internship_id && internship_id !== '' ? parseInt(internship_id) : null;
  try {
    const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [req.user.user_id]);
    if (student.rows.length === 0) return res.status(404).json({ message: 'Complete your student profile first' });

    const result = await pool.query(
      `INSERT INTO reports (student_id, internship_id, week_number, activities, challenges, skills_learned)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [student.rows[0].student_id, internId, week_number, activities, challenges, skills_learned]
    );
    await createNotification(req.user.user_id, `Your Week ${week_number} report has been submitted successfully`, pool);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [req.user.user_id]);
    if (student.rows.length === 0) return res.json([]);

    const result = await pool.query(
      `SELECT r.*, i.title AS internship_title FROM reports r
       LEFT JOIN internships i ON r.internship_id = i.internship_id
       WHERE r.student_id = $1 ORDER BY r.week_number DESC`,
      [student.rows[0].student_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const role = req.user.role;
    let query = `SELECT r.*, u.name AS student_name, i.title AS internship_title
       FROM reports r
       JOIN students s ON r.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       LEFT JOIN internships i ON r.internship_id = i.internship_id`;
    const params = [];

    if (role === 'university' || role === 'academic_supervisor') {
      const school = await pool.query('SELECT university_id FROM universities WHERE user_id = $1', [req.user.user_id]);
      if (school.rows.length > 0) {
        params.push(school.rows[0].university_id);
        query += ` WHERE s.university_id = $${params.length}`;
      } else {
        query += ' WHERE 1=1';
      }
    } else {
      query += ' WHERE 1=1';
    }

    query += ' ORDER BY r.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const reviewReport = async (req, res) => {
  const { status, feedback } = req.body;
  const validStatuses = ['approved', 'rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    await pool.query(
      'UPDATE reports SET status = $1, feedback = $2 WHERE report_id = $3',
      [status, feedback, req.params.id]
    );
    const report = await pool.query(
      `SELECT s.user_id, r.week_number FROM reports r
       JOIN students s ON r.student_id = s.student_id
       WHERE r.report_id = $1`, [req.params.id]
    );
    if (report.rows.length > 0)
      await createNotification(report.rows[0].user_id, `Your Week ${report.rows[0].week_number} report has been ${status}`, pool);
    res.json({ message: `Report ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitReport, getMyReports, getAllReports, reviewReport };
