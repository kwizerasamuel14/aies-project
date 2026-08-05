const pool = require('../config/db');

const getStats = async (req, res) => {
  try {
    const [users, companies, universities, internships, applications, reports] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM companies'),
      pool.query('SELECT COUNT(*) FROM universities'),
      pool.query('SELECT COUNT(*) FROM internships'),
      pool.query('SELECT COUNT(*) FROM applications'),
      pool.query('SELECT COUNT(*) FROM reports'),
    ]);
    res.json({
      total_users: users.rows[0].count,
      total_companies: companies.rows[0].count,
      total_universities: universities.rows[0].count,
      total_internships: internships.rows[0].count,
      total_applications: applications.rows[0].count,
      total_reports: reports.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, name, email, role, phone, status, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['active', 'inactive', 'suspended'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    await pool.query('UPDATE users SET status = $1 WHERE user_id = $2', [status, req.params.id]);
    res.json({ message: 'User status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE user_id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name AS owner_name, u.email AS owner_email, u.status
       FROM companies c JOIN users u ON c.user_id = u.user_id ORDER BY c.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUniversities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT un.*, u.name AS owner_name, u.email AS owner_email, u.status
       FROM universities un JOIN users u ON un.user_id = u.user_id ORDER BY un.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStats, getUsers, updateUserStatus, deleteUser, getCompanies, getUniversities };
