#!/bin/bash
cd server
npm install
node src/config/migration_add_post_columns.js
