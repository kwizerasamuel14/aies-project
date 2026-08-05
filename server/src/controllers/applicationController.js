const pool = require('../config/db');
const { createNotification } = require('./notificationController');

const applyInternship = async (req, res) => {
  const { internship_id } = req.body;
  try {
    const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [req.user.user_id]);
    if (student.rows.length === 0) return res.status(404).json({ message: 'Complete your student profile first' });

    const existing = await pool.query(
      'SELECT * FROM applications WHERE student_id = $1 AND internship_id = $2',
      [student.rows[0].student_id, internship_id]
    );
    if (existing.rows.length > 0) return res.status(400).json({ message: 'Already applied to this internship' });

    const result = await pool.query(
      'INSERT INTO applications (student_id, internship_id) VALUES ($1, $2) RETURNING *',
      [student.rows[0].student_id, internship_id]
    );
    const internship = await pool.query('SELECT title, company_id FROM internships WHERE internship_id = $1', [internship_id]);
    const companyUser = await pool.query('SELECT user_id FROM companies WHERE company_id = $1', [internship.rows[0].company_id]);
    await createNotification(companyUser.rows[0].user_id, `New application received for "${internship.rows[0].title}"`, pool);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [req.user.user_id]);
    if (student.rows.length === 0) return res.json([]);

    const result = await pool.query(
      `SELECT a.*, i.title, i.location, i.duration, i.deadline, c.name AS company_name
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN companies c ON i.company_id = c.company_id
       WHERE a.student_id = $1 ORDER BY a.applied_at DESC`,
      [student.rows[0].student_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getApplicants = async (req, res) => {
  try {
    const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (company.rows.length === 0) return res.json([]);

    const result = await pool.query(
      `SELECT a.*, i.title AS internship_title, u.name AS student_name, u.email AS student_email,
              s.department, s.faculty, s.skills
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN students s ON a.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE i.company_id = $1 ORDER BY a.applied_at DESC`,
      [company.rows[0].company_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAcceptedApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, i.title AS internship_title, u.name AS student_name, u.email AS student_email,
              s.department, s.faculty, s.skills
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN students s ON a.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE a.status = 'accepted' ORDER BY a.applied_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['accepted', 'rejected', 'completed'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const role = req.user.role;

    if (role === 'academic_supervisor' || role === 'company_supervisor') {
      // Supervisors can only mark as completed
      if (status !== 'completed') return res.status(403).json({ message: 'Supervisors can only mark as completed' });
      await pool.query('UPDATE applications SET status = $1 WHERE application_id = $2', [status, req.params.id]);
    } else {
      const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
      if (company.rows.length === 0) return res.status(404).json({ message: 'Company not found' });
      await pool.query(
        `UPDATE applications SET status = $1
         WHERE application_id = $2
         AND internship_id IN (SELECT internship_id FROM internships WHERE company_id = $3)`,
        [status, req.params.id, company.rows[0].company_id]
      );
    }

    const app = await pool.query(
      `SELECT s.user_id, i.title FROM applications a
       JOIN students s ON a.student_id = s.student_id
       JOIN internships i ON a.internship_id = i.internship_id
       WHERE a.application_id = $1`, [req.params.id]
    );
    if (app.rows.length > 0)
      await createNotification(app.rows[0].user_id, `Your application for "${app.rows[0].title}" has been ${status}`, pool);
    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { applyInternship, getMyApplications, getApplicants, getAcceptedApplications, updateApplicationStatus };
