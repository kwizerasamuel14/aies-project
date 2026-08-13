const pool = require('./db');

// Migration script to add post_type, approval_status, admin_comment columns to internships table
const runMigration = async () => {
  try {
    console.log('Starting migration: Adding post_type, approval_status, admin_comment columns...');

    // Check if columns exist
    const columnCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'internships' AND column_name IN ('post_type', 'approval_status', 'admin_comment')
    `);

    if (columnCheck.rows.length === 3) {
      console.log('✅ All columns already exist. Migration skipped.');
      process.exit(0);
    }

    // Add post_type column if it doesn't exist
    if (!columnCheck.rows.some(col => col.column_name === 'post_type')) {
      await pool.query(`
        ALTER TABLE internships 
        ADD COLUMN post_type VARCHAR(50) DEFAULT 'internship' 
        CHECK (post_type IN ('internship', 'job', 'event', 'announcement', 'other'))
      `);
      console.log('✅ Added post_type column');
    }

    // Add approval_status column if it doesn't exist
    if (!columnCheck.rows.some(col => col.column_name === 'approval_status')) {
      await pool.query(`
        ALTER TABLE internships 
        ADD COLUMN approval_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (approval_status IN ('pending', 'approved', 'rejected', 'changes_requested'))
      `);
      console.log('✅ Added approval_status column');
    }

    // Add admin_comment column if it doesn't exist
    if (!columnCheck.rows.some(col => col.column_name === 'admin_comment')) {
      await pool.query(`
        ALTER TABLE internships 
        ADD COLUMN admin_comment TEXT
      `);
      console.log('✅ Added admin_comment column');
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
};

runMigration();
