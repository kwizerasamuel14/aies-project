const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT un.*, u.name, u.email, u.phone FROM universities un
       JOIN users u ON un.user_id = u.user_id
       WHERE un.user_id = $1`,
      [req.user.user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'University profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM universities WHERE user_id = $1', [req.user.user_id]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO universities (user_id, name, address, contact) VALUES ($1,$2,$3,$4)',
        [req.user.user_id, name, address, contact]
      );
    } else {
      await pool.query(
        'UPDATE universities SET name=$1, address=$2, contact=$3 WHERE user_id=$4',
        [name, address, contact, req.user.user_id]
      );
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getList = async (req, res) => {
  try {
    const result = await pool.query('SELECT university_id, name FROM universities ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getList };
