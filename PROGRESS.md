# AIES - Academic Internship Evaluation System
# Project Progress Tracker

## Project Info
- **Stack:** React.js + Tailwind CSS (Frontend) | Node.js + Express (Backend) | PostgreSQL (Database)
- **Repository:** https://github.com/kwizerasamuel14/aies-project.git (Up Skills Hub)
- **Deployments:** Render (Backend API + PostgreSQL) | Netlify (Frontend SPA)
- **Working Directory:** `C:\Users\ADMIN\Desktop\Internship\aies`

---

## 👥 Core System Roles (Consolidated to 4 Roles)
1. **Student (`student`)**: Search & apply to internships, submit weekly logbooks/reports, view performance evaluations.
2. **School (`university`)**: Unified School and Academic Supervisor hub (manage enrolled students, review weekly reports with feedback, submit evaluations, schedule meetings, approve completion, view school stats & placements).
3. **Company (`company`)**: Unified Company and Company Supervisor hub (post & edit internships/jobs, review applicants, manage current interns, submit intern evaluations, approve completion).
4. **Admin (`admin`)**: Post approval moderation, expired post deletion & archiving, user management, statistics & settings.

---

## ✅ Completed & Implemented Features

### 1. Company Post Moderation & Approval (Supervisor Requirement #1)
- [x] Admin can view **Duration** and **Number of Applicants** on each post before making approval decisions.
- [x] Clear display of positions, deadline, and required skills.
- [x] Post status badges: `pending`, `approved`, `changes_requested`, `rejected`, and `⚠️ Expired`.
- [x] Admin feedback comment required when requesting changes or rejecting.
- [x] **Expired Post Deletion & Redirection:**
  - Auto-detection of expired posts past deadline.
  - Admin button to delete expired posts.
  - Soft-delete database tracking (`is_deleted`, `deletion_reason`, `deleted_at`).
  - Automatically redirects/switches to the **Expired Posts** tab upon deletion.
  - Archived posts display deletion timestamp, reason, company, applicants count, and duration.

### 2. Company Intern Evaluation Flow (Supervisor Requirement #2)
- [x] **Current Interns Display:** `GET /api/evaluations/students` returns active interns (students with accepted applications) for the logged-in company.
- [x] **Populated Dropdown:** `-- Select a student --` / `-- Select an active intern --` dropdown lists all current interns with name, internship title, and department.
- [x] Auto-linking `internship_id` and student data upon selection.
- [x] Quick-action **"⭐ Evaluate"** button from Current Interns page pre-selects the student in the evaluation form.
- [x] Helpful empty-state guidance banner if no applicants have been accepted yet.
- [x] Role permissions granted for `company` on evaluation submission and student retrieval endpoints.

### 3. Role Consolidation (Supervisor Requirement #3)
- [x] Consolidated role hierarchy strictly to the 4 core roles: **Student**, **School**, **Company**, and **Admin**.
- [x] **Registration Form (`Register.jsx`)**: Displays only the 4 selectable roles.
- [x] **School Dashboard (`UniversityDashboard.jsx`)**: Unified hub incorporating report review, student evaluations, meeting scheduling, and placement tracking.
- [x] **Company Dashboard (`CompanyDashboard.jsx`)**: Unified hub incorporating job posting, applicant review, intern management, and evaluations.
- [x] **Admin Dashboard & Users (`AdminDashboard.jsx`, `AdminUsers.jsx`)**: Role charts and tables cleanly display the 4 roles with "School" for universities.
- [x] **Backend API Routes**: Unified permissions across `meetingRoutes.js`, `evaluationRoutes.js`, `reportRoutes.js`, and `applicationRoutes.js`.

### 4. Deployment & Infrastructure
- [x] Netlify SPA routing support via `client/public/_redirects` (`/* /index.html 200`).
- [x] Render PostgreSQL SSL connection configuration in `src/config/db.js`.
- [x] Auto-migrations running on server startup for all tables and dynamic columns.
- [x] Full API documentation (`API_DOCUMENTATION.md`) and Postman collection (`AIES_API_Postman_Collection.json`).

---

## 🗂️ Project Structure
```
aies/
├── client/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── dashboards/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── CompanyDashboard.jsx
│   │   │       ├── UniversityDashboard.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── pages/  (Admin, University, Company, Student pages)
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── schema.sql
│   │   │   └── migrate.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   ├── index.js
│   └── package.json
└── PROGRESS.md
```

---

## ▶️ How to Run Locally
**Backend Server (Port 5000):**
```powershell
cd aies\server
node index.js
```
**Frontend Client (Port 3000):**
```powershell
cd aies\client
npm start
```
