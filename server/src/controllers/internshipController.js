const pool = require('../config/db');

const createInternship = async (req, res) => {
  const { title, description, required_skills, duration, location, deadline, positions, post_type } = req.body;
  if (!title || !deadline) return res.status(400).json({ message: 'Title and deadline are required' });
  try {
    const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (company.rows.length === 0) return res.status(404).json({ message: 'Complete your company profile first' });

    const result = await pool.query(
      `INSERT INTO internships (company_id, title, description, required_skills, duration, location, deadline, positions, post_type, approval_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending') RETURNING *`,
      [company.rows[0].company_id, title, description, required_skills, duration, location, deadline, positions || 1, post_type || 'internship']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getInternships = async (req, res) => {
  const { search, location } = req.query;
  try {
    let query = `SELECT i.*, c.name AS company_name, c.industry, c.location AS company_location
                 FROM internships i JOIN companies c ON i.company_id = c.company_id
                 WHERE i.status = 'open' AND i.approval_status = 'approved'`;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (i.title ILIKE $${params.length} OR i.required_skills ILIKE $${params.length})`;
    }
    if (location) {
      params.push(`%${location}%`);
      query += ` AND i.location ILIKE $${params.length}`;
    }
    query += ' ORDER BY i.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPostsForAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name AS company_name FROM internships i
       JOIN companies c ON i.company_id = c.company_id
       ORDER BY i.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const approvePost = async (req, res) => {
  try {
    const { approval_status, admin_comment } = req.body;
    const internshipId = req.params.id;
    
    console.log('📥 Received approval request:', {
      internshipId,
      approval_status,
      admin_comment,
      userId: req.user?.user_id
    });

    if (!internshipId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    if (!approval_status) {
      return res.status(400).json({ message: 'Approval status is required' });
    }

    const valid = ['approved', 'rejected', 'changes_requested'];
    if (!valid.includes(approval_status)) {
      return res.status(400).json({ message: `Invalid approval status. Must be one of: ${valid.join(', ')}` });
    }

    console.log(`🔄 Updating internship ${internshipId} to ${approval_status}...`);
    
    const result = await pool.query(
      'UPDATE internships SET approval_status = $1, admin_comment = $2 WHERE internship_id = $3 RETURNING *',
      [approval_status, admin_comment || null, internshipId]
    );

    console.log(`✅ Update successful. Rows affected:`, result.rowCount);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ 
      message: `Post ${approval_status.replace('_', ' ')} successfully`, 
      post: result.rows[0] 
    });
  } catch (err) {
    console.error('❌ Error in approvePost:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const getMyInternships = async (req, res) => {
  try {
    const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (company.rows.length === 0) return res.json([]);

    const result = await pool.query(
      'SELECT * FROM internships WHERE company_id = $1 ORDER BY created_at DESC',
      [company.rows[0].company_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteInternship = async (req, res) => {
  try {
    const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (company.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    await pool.query(
      'DELETE FROM internships WHERE internship_id = $1 AND company_id = $2',
      [req.params.id, company.rows[0].company_id]
    );
    res.json({ message: 'Internship deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateInternship = async (req, res) => {
  const { title, description, required_skills, duration, location, deadline, positions, status, post_type } = req.body;
  try {
    const company = await pool.query('SELECT company_id FROM companies WHERE user_id = $1', [req.user.user_id]);
    if (company.rows.length === 0) return res.status(404).json({ message: 'Company not found' });

    const result = await pool.query(
      `UPDATE internships SET title=$1, description=$2, required_skills=$3, duration=$4, location=$5, deadline=$6, positions=$7, status=$8, post_type=$9, approval_status='pending', admin_comment=NULL
       WHERE internship_id=$10 AND company_id=$11 RETURNING *`,
      [title, description, required_skills, duration, location, deadline, positions, status || 'open', post_type || 'internship', req.params.id, company.rows[0].company_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Internship not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createInternship, getInternships, getMyInternships, deleteInternship, updateInternship, getAllPostsForAdmin, approvePost };
