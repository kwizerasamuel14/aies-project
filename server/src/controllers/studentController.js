const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name, u.email, u.phone FROM students s
       JOIN users u ON s.user_id = u.user_id
       WHERE s.user_id = $1`,
      [req.user.user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Student profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { department, faculty, skills, portfolio_url, university_id } = req.body;
  const uniId = university_id && university_id !== '' ? parseInt(university_id) : null;
  try {
    const existing = await pool.query('SELECT * FROM students WHERE user_id = $1', [req.user.user_id]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO students (user_id, department, faculty, skills, portfolio_url, university_id) VALUES ($1,$2,$3,$4,$5,$6)',
        [req.user.user_id, department, faculty, skills, portfolio_url, uniId]
      );
    } else {
      await pool.query(
        'UPDATE students SET department=$1, faculty=$2, skills=$3, portfolio_url=$4, university_id=$5 WHERE user_id=$6',
        [department, faculty, skills, portfolio_url, uniId, req.user.user_id]
      );
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
