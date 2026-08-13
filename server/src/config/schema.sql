-- AIES Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'company', 'university', 'academic_supervisor', 'company_supervisor', 'admin')),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
  university_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  address TEXT,
  contact VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  company_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  industry VARCHAR(100),
  location VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  student_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  university_id INT REFERENCES universities(university_id),
  department VARCHAR(100),
  faculty VARCHAR(100),
  skills TEXT,
  cv_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internships Table
CREATE TABLE IF NOT EXISTS internships (
  internship_id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(company_id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  required_skills TEXT,
  duration VARCHAR(50),
  location VARCHAR(150),
  deadline DATE,
  positions INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'open',
  post_type VARCHAR(50) DEFAULT 'internship' CHECK (post_type IN ('internship', 'job', 'event', 'announcement', 'other')),
  approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  admin_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  application_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
  internship_id INT REFERENCES internships(internship_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  report_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
  internship_id INT REFERENCES internships(internship_id),
  week_number INT NOT NULL,
  activities TEXT,
  challenges TEXT,
  skills_learned TEXT,
  attachment_url VARCHAR(255),
  feedback TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations Table
CREATE TABLE IF NOT EXISTS evaluations (
  evaluation_id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
  supervisor_id INT REFERENCES users(user_id),
  internship_id INT REFERENCES internships(internship_id),
  technical_score INT CHECK (technical_score BETWEEN 1 AND 5),
  professional_score INT CHECK (professional_score BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
  meeting_id SERIAL PRIMARY KEY,
  supervisor_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
