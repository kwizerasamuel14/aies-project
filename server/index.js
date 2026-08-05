const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/config/db');

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
