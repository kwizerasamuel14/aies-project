// Migration: Add tracking for deleted posts
// This migration adds columns to track deleted posts due to expiration

const pool = require('./db');

const migrate = async () => {
  try {
    // Check if the columns already exist
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name='internships' AND column_name='is_deleted'`
    );

    if (result.rows.length === 0) {
      console.log('🔄 Running migration: Add deleted post tracking...');
      
      // Add columns to internships table
      await pool.query(`
        ALTER TABLE internships 
        ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS deletion_reason VARCHAR(50),
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
      `);
      
      console.log('✅ Migration completed: Deleted post tracking added');
    } else {
      console.log('⏭️  Skipping migration: Deleted post tracking already exists');
    }
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    throw err;
  }
};

module.exports = { migrate };
