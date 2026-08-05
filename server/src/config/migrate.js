const fs = require('fs');
const path = require('path');
const pool = require('./db');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool.query(schema)
  .then(() => {
    console.log('All tables created successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating tables:', err.message);
    process.exit(1);
  });
