import StudentDashboard from '../components/dashboards/StudentDashboard';
import CompanyDashboard from '../components/dashboards/CompanyDashboard';
import UniversityDashboard from '../components/dashboards/UniversityDashboard';
import AcademicSupervisorDashboard from '../components/dashboards/AcademicSupervisorDashboard';
import CompanySupervisorDashboard from '../components/dashboards/CompanySupervisorDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const dashboards = {
  student: StudentDashboard,
  company: CompanyDashboard,
  university: UniversityDashboard,
  academic_supervisor: UniversityDashboard,
  company_supervisor: CompanyDashboard,
  admin: AdminDashboard,
};

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const RoleDashboard = dashboards[user.role];

  if (!RoleDashboard) return <div className="p-8 text-red-500">Unknown role: {user.role}</div>;

  return <RoleDashboard user={user} />;
}
