const pool = require('../config/db');

const getMyNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND user_id = $2',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.user.user_id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createNotification = async (user_id, message, pool) => {
  await pool.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [user_id, message]);
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, createNotification };
