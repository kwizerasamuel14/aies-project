const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const universityRoutes = require('./src/routes/universityRoutes');
const internshipRoutes = require('./src/routes/internshipRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const evaluationRoutes = require('./src/routes/evaluationRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const meetingRoutes = require('./src/routes/meetingRoutes');

// Auto-run migrations on startup
const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');

    // Check if columns exist
    const columnCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'internships' AND column_name IN ('post_type', 'approval_status', 'admin_comment', 'is_deleted', 'deletion_reason', 'deleted_at')
    `);

    // Add post_type if missing
    if (!columnCheck.rows.some(col => col.column_name === 'post_type')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN post_type VARCHAR(50) DEFAULT 'internship'
        CHECK (post_type IN ('internship', 'job', 'event', 'announcement', 'other'))
      `);
      console.log('✅ Added post_type column');
    }

    // Add approval_status if missing
    if (!columnCheck.rows.some(col => col.column_name === 'approval_status')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN approval_status VARCHAR(50) DEFAULT 'pending'
        CHECK (approval_status IN ('pending', 'approved', 'rejected', 'changes_requested'))
      `);
      console.log('✅ Added approval_status column');
    }

    // Add admin_comment if missing
    if (!columnCheck.rows.some(col => col.column_name === 'admin_comment')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN admin_comment TEXT
      `);
      console.log('✅ Added admin_comment column');
    }

    // Add is_deleted if missing
    if (!columnCheck.rows.some(col => col.column_name === 'is_deleted')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Added is_deleted column');
    }

    // Add deletion_reason if missing
    if (!columnCheck.rows.some(col => col.column_name === 'deletion_reason')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN deletion_reason VARCHAR(50)
      `);
      console.log('✅ Added deletion_reason column');
    }

    // Add deleted_at if missing
    if (!columnCheck.rows.some(col => col.column_name === 'deleted_at')) {
      await pool.query(`
        ALTER TABLE internships
        ADD COLUMN deleted_at TIMESTAMP
      `);
      console.log('✅ Added deleted_at column');
    }

    console.log('✅ All migrations completed successfully!');
  } catch (err) {
    console.error('⚠️ Migration warning:', err.message);
    // Don't crash - columns might already exist
  }
};

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AIES API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meetings', meetingRoutes);

const PORT = process.env.PORT || 5000;

// Run migrations then start server
(async () => {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log('PostgreSQL connected successfully');
  });
})();
