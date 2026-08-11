import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import CompanyProfile from './pages/CompanyProfile';
import UniversityProfile from './pages/UniversityProfile';
import PostInternship from './pages/PostInternship';
import MyInternships from './pages/MyInternships';
import Internships from './pages/Internships';
import ApplyInternship from './pages/ApplyInternship';
import MyApplications from './pages/MyApplications';
import ReviewApplicants from './pages/ReviewApplicants';
import SubmitReport from './pages/SubmitReport';
import MyReports from './pages/MyReports';
import ReviewReports from './pages/ReviewReports';
import SubmitEvaluation from './pages/SubmitEvaluation';
import MyEvaluations from './pages/MyEvaluations';
import Notifications from './pages/Notifications';
import AdminUsers from './pages/AdminUsers';
import AdminCompanies from './pages/AdminCompanies';
import AdminUniversities from './pages/AdminUniversities';
import AdminStats from './pages/AdminStats';
import SupervisorStudents from './pages/SupervisorStudents';
import SupervisorApprovals from './pages/SupervisorApprovals';
import SupervisorMeetings from './pages/SupervisorMeetings';
import CurrentInterns from './pages/CurrentInterns';
import UniversityStudents from './pages/UniversityStudents';
import UniversityPlacements from './pages/UniversityPlacements';
import UniversitySupervisors from './pages/UniversitySupervisors';
import UniversityStats from './pages/UniversityStats';
import EditInternship from './pages/EditInternship';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';
import AdminPosts from './pages/AdminPosts';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile/student" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
        <Route path="/profile/company" element={<PrivateRoute><CompanyProfile /></PrivateRoute>} />
        <Route path="/profile/university" element={<PrivateRoute><UniversityProfile /></PrivateRoute>} />
        <Route path="/internships" element={<PrivateRoute><Internships /></PrivateRoute>} />
        <Route path="/internships/create" element={<PrivateRoute><PostInternship /></PrivateRoute>} />
        <Route path="/internships/mine" element={<PrivateRoute><MyInternships /></PrivateRoute>} />
        <Route path="/internships/edit/:id" element={<PrivateRoute><EditInternship /></PrivateRoute>} />
        <Route path="/applications/apply/:internship_id" element={<PrivateRoute><ApplyInternship /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
        <Route path="/applications/review" element={<PrivateRoute><ReviewApplicants /></PrivateRoute>} />
        <Route path="/reports/submit" element={<PrivateRoute><SubmitReport /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><MyReports /></PrivateRoute>} />
        <Route path="/supervisor/reports" element={<PrivateRoute><ReviewReports /></PrivateRoute>} />
        <Route path="/university/reports" element={<PrivateRoute><ReviewReports /></PrivateRoute>} />
        <Route path="/evaluations" element={<PrivateRoute><MyEvaluations /></PrivateRoute>} />
        <Route path="/evaluations/submit" element={<PrivateRoute><SubmitEvaluation /></PrivateRoute>} />
        <Route path="/supervisor/evaluations" element={<PrivateRoute><SubmitEvaluation /></PrivateRoute>} />
        <Route path="/supervisor/evaluations/weekly" element={<PrivateRoute><SubmitEvaluation /></PrivateRoute>} />
        <Route path="/supervisor/evaluations/final" element={<PrivateRoute><SubmitEvaluation /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/companies" element={<PrivateRoute><AdminCompanies /></PrivateRoute>} />
        <Route path="/admin/universities" element={<PrivateRoute><AdminUniversities /></PrivateRoute>} />
        <Route path="/admin/stats" element={<PrivateRoute><AdminStats /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute><ReviewReports /></PrivateRoute>} />

        {/* Previously Coming Soon - Now Built */}
        <Route path="/interns" element={<PrivateRoute><CurrentInterns /></PrivateRoute>} />
        <Route path="/supervisor/students" element={<PrivateRoute><SupervisorStudents /></PrivateRoute>} />
        <Route path="/supervisor/meetings" element={<PrivateRoute><SupervisorMeetings /></PrivateRoute>} />
        <Route path="/supervisor/approvals" element={<PrivateRoute><SupervisorApprovals /></PrivateRoute>} />
        <Route path="/supervisor/interns" element={<PrivateRoute><CurrentInterns /></PrivateRoute>} />
        <Route path="/university/students" element={<PrivateRoute><UniversityStudents /></PrivateRoute>} />
        <Route path="/university/placements" element={<PrivateRoute><UniversityPlacements /></PrivateRoute>} />
        <Route path="/university/supervisors" element={<PrivateRoute><UniversitySupervisors /></PrivateRoute>} />
        <Route path="/university/stats" element={<PrivateRoute><UniversityStats /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
        <Route path="/admin/posts" element={<PrivateRoute><AdminPosts /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
