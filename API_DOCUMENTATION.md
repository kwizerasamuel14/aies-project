# AIES API Documentation

## Quick Start - Import Postman Collection

### Option 1: Import from GitHub (Easiest)
1. Download `AIES_API_Postman_Collection.json` from this repository
2. Open **Postman** → Click **Import** (top-left)
3. Select the JSON file → Click **Import**
4. Done! All endpoints are now available in Postman

### Option 2: Copy the Raw URL
In Postman → Import → Paste URL:
```
https://raw.githubusercontent.com/kwizerasamuel14/aies-project/main/AIES_API_Postman_Collection.json
```

---

## Setup Environment Variables

1. In Postman, click the **eye icon** (top-right) → **Environments**
2. Click **Edit** on "AIES_API_Postman_Collection"
3. Set these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `API_URL` | Your Render backend URL | `https://aies-backend.onrender.com` |
| `TOKEN` | Your JWT token after login | Get from login response |

---

## Authentication Flow

### 1. Register a New User
1. Go to **Authentication → Register**
2. Update the email and password
3. Send request
4. Note the `user_id` and `role`

### 2. Login
1. Go to **Authentication → Login**
2. Use the same email/password
3. Send request
4. Copy the `token` from response
5. Paste it in the Environment variables under `TOKEN`

### 3. All Future Requests
- All requests automatically include `Authorization: Bearer {{TOKEN}}`
- Token is valid for 7 days

---

## API Endpoints by Role

### Student Endpoints
- Browse internships
- Apply to internships
- View my applications
- Submit weekly reports
- View my evaluations

### Company Endpoints
- Post internships (with categories: Internship, Job, Event, Announcement, Other)
- Edit internships
- Review applicants (accept/reject)
- View current interns (accepted applicants)
- Submit evaluations for interns

### Supervisor Endpoints (Academic & Company)
- View assigned students
- Create meetings with students
- Submit evaluations
- Approve/reject reports
- Mark applications as completed

### Admin Endpoints
- Approve/reject/request changes on company posts (with comments)
- View system statistics
- Manage users (suspend/activate/delete)
- Manage companies and universities
- View all applications, reports, evaluations

### University Endpoints
- View all students
- View placements
- View supervisors
- Submit statistics

---

## Key Features

### ✅ Post Status & Categories
- **Categories**: Academic Internship, Job, Event, Announcement, Other
- **Status Flow**: Pending → Approved/Rejected/Changes Requested
- **Admin Comments**: Feedback shown to companies
- **Resubmission**: Companies can edit and resubmit after changes requested

### ✅ Application Management
- Students apply to internships
- Companies review applicants
- Accept/Reject workflow
- Supervisors mark as completed

### ✅ Report & Evaluation System
- Students submit weekly reports
- Supervisors approve/reject with feedback
- Supervisors submit evaluations (1-5 scale)
- Students view their evaluations

### ✅ Notification System
- Auto-triggered on key events
- Mark as read individually
- Mark all as read

### ✅ Meeting Management
- Supervisors schedule meetings with students
- View all meetings
- Delete meetings

---

## Example Workflows

### Company Workflow
1. Register as company
2. Complete company profile
3. Post internship with category
4. **Status**: Pending (awaiting admin approval)
5. Admin reviews and approves
6. Students can now apply
7. Review applicants
8. Accept students → they appear in "Current Interns"
9. Evaluate interns

### Student Workflow
1. Register as student
2. Complete student profile (skills, department, etc.)
3. Browse approved internships
4. Apply to internships
5. View my applications (pending/accepted/rejected)
6. If accepted, submit weekly reports
7. View evaluations from supervisors

### Admin Workflow
1. Go to Company Posts Approval
2. Review pending posts
3. Add comment if needed
4. Approve/Reject/Request Changes
5. Monitor statistics
6. Manage users and companies

---

## Testing Tips

### 1. Test with Different Roles
- Create accounts for: student, company, supervisor, admin
- Login with each role
- Test role-specific endpoints

### 2. Post Status Test
1. Company posts internship → Status: Pending
2. Admin approves → Status: Approved
3. Post now visible to students
4. Students can apply

### 3. Application Test
1. Student applies → Application: Pending
2. Company accepts → Application: Accepted
3. Supervisor marks completed → Application: Completed

---

## Support

For issues or questions about the API:
- Check the error response message
- Verify your token is valid (login again if expired)
- Ensure you have the required role for that endpoint
- Check that required fields are provided in request body

---

## API Base URL
```
https://aies-backend.onrender.com
```

## Frontend URL
```
https://aies-frontend.netlify.app
```
