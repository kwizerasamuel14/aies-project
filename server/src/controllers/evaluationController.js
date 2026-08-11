const pool = require('../config/db');

const submitEvaluation = async (req, res) => {
  const { student_id, internship_id, technical_score, professional_score, comments } = req.body;
  if (!student_id || !technical_score || !professional_score)
    return res.status(400).json({ message: 'Student, technical score and professional score are required' });
  const internId = internship_id && internship_id !== '' ? parseInt(internship_id) : null;
  try {
    const result = await pool.query(
      `INSERT INTO evaluations (student_id, supervisor_id, internship_id, technical_score, professional_score, comments)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [student_id, req.user.user_id, internId, technical_score, professional_score, comments]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyEvaluations = async (req, res) => {
  try {
    const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [req.user.user_id]);
    if (student.rows.length === 0) return res.json([]);

    const result = await pool.query(
      `SELECT e.*, u.name AS supervisor_name, i.title AS internship_title
       FROM evaluations e
       JOIN users u ON e.supervisor_id = u.user_id
       LEFT JOIN internships i ON e.internship_id = i.internship_id
       WHERE e.student_id = $1 ORDER BY e.created_at DESC`,
      [student.rows[0].student_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllEvaluations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.name AS student_name, sup.name AS supervisor_name, i.title AS internship_title
       FROM evaluations e
       JOIN students s ON e.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       JOIN users sup ON e.supervisor_id = sup.user_id
       LEFT JOIN internships i ON e.internship_id = i.internship_id
       ORDER BY e.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStudentsForEvaluation = async (req, res) => {
  try {
    const role = req.user.role;
    let query = `SELECT s.student_id, u.name, u.email, s.department, s.faculty, s.skills
       FROM students s JOIN users u ON s.user_id = u.user_id`;
    const params = [];

    if (role === 'university' || role === 'academic_supervisor') {
      const school = await pool.query('SELECT university_id FROM universities WHERE user_id = $1', [req.user.user_id]);
      if (school.rows.length > 0) {
        params.push(school.rows[0].university_id);
        query += ` WHERE s.university_id = $${params.length}`;
      }
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitEvaluation, getMyEvaluations, getAllEvaluations, getStudentsForEvaluation };
