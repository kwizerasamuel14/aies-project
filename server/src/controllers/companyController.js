const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name, u.email, u.phone FROM companies c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.user_id = $1`,
      [req.user.user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Company profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, industry, location, email } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO companies (user_id, name, industry, location, email) VALUES ($1,$2,$3,$4,$5)',
        [req.user.user_id, name, industry, location, email]
      );
    } else {
      await pool.query(
        'UPDATE companies SET name=$1, industry=$2, location=$3, email=$4 WHERE user_id=$5',
        [name, industry, location, email, req.user.user_id]
      );
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
