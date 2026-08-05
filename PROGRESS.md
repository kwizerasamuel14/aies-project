# AIES - Academic Internship Evaluation System
# Project Progress Tracker

## Project Info
- **Stack:** React.js + Tailwind CSS (Frontend) | Node.js + Express (Backend) | PostgreSQL (Database)
- **Repo:** https://github.com/UpSkillHub
- **Working Directory:** C:\Users\ADMIN\Desktop\Internship\aies

---

## ✅ Completed — FULLY FINISHED

### Backend
- [x] Project folder structure (`aies/client`, `aies/server`)
- [x] Node.js + PostgreSQL + all dependencies installed
- [x] Database `aies_db` with all tables: users, students, companies, universities, internships, applications, reports, evaluations, notifications, meetings
- [x] Auth API: register, login, getMe (JWT + bcrypt)
- [x] Student profile API: GET/PUT /api/students/profile
- [x] Company profile API: GET/PUT /api/companies/profile
- [x] University profile API: GET/PUT /api/universities/profile
- [x] Internship API: POST, GET (search+filter), GET /mine, PUT /:id (edit), DELETE
- [x] Application API: apply, my applications, review applicants, accepted (for supervisors), accept/reject/complete
- [x] Reports API: submit, my reports, all reports, approve/reject + feedback
- [x] Evaluations API: submit, my evaluations, all evaluations, list students
- [x] Notifications API: get, mark read, mark all read (auto-triggered on key events)
- [x] Admin API: stats, users (suspend/delete), companies, universities
- [x] Meetings API: create, get my meetings, delete (DB-backed, not localStorage)

### Bug Fixes Applied
- [x] Notification "mark all read" route order fixed (was shadowed by /:id/read)
- [x] Supervisors can now mark applications as completed (role check fixed)
- [x] University role can access /api/admin/stats and /api/admin/users
- [x] University role can access /api/evaluations/students
- [x] New GET /api/applications/accepted endpoint for supervisors
- [x] applicationController handles supervisor role without requiring company record

### Frontend
- [x] Login, Register pages
- [x] Dashboard — auto-renders role-specific dashboard for all 6 roles
- [x] Shared Navbar with notification bell + unread badge (on ALL pages)
- [x] StudentProfile, CompanyProfile, UniversityProfile pages (with real Navbar)
- [x] Role-specific dashboards: Student, Company, University, Academic Supervisor, Company Supervisor, Admin
- [x] All dashboards show real data (no hardcoded zeros)
- [x] Internships page (browse, search, filter)
- [x] PostInternship, MyInternships pages (Company) — MyInternships shows applicant counts + Edit button
- [x] EditInternship page (Company — edit title, skills, deadline, status, etc.)
- [x] ApplyInternship, MyApplications pages (Student)
- [x] ReviewApplicants page (Company — accept/reject)
- [x] SubmitReport, MyReports pages (Student)
- [x] ReviewReports page (Supervisor/University/Admin)
- [x] SubmitEvaluation page (Supervisor — rating 1-5 with labels)
- [x] MyEvaluations page (Student)
- [x] Notifications page (mark read / mark all read)
- [x] AdminUsers page (suspend, activate, delete)
- [x] AdminCompanies page
- [x] AdminUniversities page
- [x] AdminStats page (system-wide statistics)
- [x] SupervisorStudents page (list all students with View Reports + Evaluate buttons)
- [x] SupervisorApprovals page (mark accepted internships as completed)
- [x] SupervisorMeetings page (schedule/delete meetings — DB-backed)
- [x] CurrentInterns page (accepted applicants with Evaluate button)
- [x] UniversityStudents page (table of all registered students)
- [x] UniversityPlacements page (students with active internships)
- [x] UniversitySupervisors page (table of all supervisors)
- [x] UniversityStats page (charts + avg scores)
- [x] AdminCategories page (add/delete internship categories)
- [x] AdminSettings page (site name, registration toggle, deadlines)
- [x] 404 NotFound page (catch-all for unknown routes)

---

## 📌 Decisions Made
- Database: PostgreSQL (port 5432)
- Auth: JWT tokens (7 days expiry), email + password login
- Styling: Tailwind CSS v3
- DB Password: ubuntu1000
- DB Name: aies_db
- DB User: postgres
- Meetings: Stored in DB (meetings table), not localStorage
- Categories/Settings: Stored in localStorage (admin-only, no DB needed)

---

## 🗂️ Project Structure
```
aies/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── dashboards/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── CompanyDashboard.jsx
│   │   │       ├── UniversityDashboard.jsx
│   │   │       ├── AcademicSupervisorDashboard.jsx
│   │   │       ├── CompanySupervisorDashboard.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── pages/  (33 pages total)
│   │   ├── App.js
│   │   └── index.css
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── schema.sql
│   │   │   └── migrate.js
│   │   ├── controllers/  (11 controllers)
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/  (11 route files)
│   ├── index.js
│   └── .env
└── PROGRESS.md
```

---

## ▶️ How to Run
**Terminal 1 - Backend:**
```
cd C:\Users\ADMIN\Desktop\Internship\aies\server
node index.js
```
**Terminal 2 - Frontend:**
```
cd C:\Users\ADMIN\Desktop\Internship\aies\client
npm start
```

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
