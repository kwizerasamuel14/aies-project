import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import API from '../../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#6366f1'];

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
    <p className="text-slate-500 text-sm">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button onClick={onClick} className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-primary hover:shadow-sm transition w-full">
    <p className="font-semibold text-slate-700">{label}</p>
  </button>
);

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data)).catch(() => {});
    axios.get(`${API}/api/reports/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data)).catch(() => {});
  }, [token]);

  const appStatusData = [
    { name: 'Pending', value: applications.filter(a => a.status === 'pending').length },
    { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
    { name: 'Completed', value: applications.filter(a => a.status === 'completed').length },
  ].filter(d => d.value > 0);

  const reportsData = reports.map(r => ({ week: `Week ${r.week_number}`, status: r.status === 'approved' ? 1 : 0 }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Student Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="My Applications" value={applications.length} color="border-primary" />
          <StatCard label="Accepted" value={applications.filter(a => a.status === 'accepted').length} color="border-yellow-400" />
          <StatCard label="Reports Submitted" value={reports.length} color="border-green-500" />
          <StatCard label="Approved Reports" value={reports.filter(r => r.status === 'approved').length} color="border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Application Status</h3>
            {appStatusData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No applications yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={appStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {appStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Weekly Reports</h3>
            {reportsData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No reports yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reportsData}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="status" fill="#3b82f6" name="Approved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="📋 Complete My Profile" onClick={() => navigate('/profile/student')} />
          <ActionButton label="🔍 Search Internships" onClick={() => navigate('/internships')} />
          <ActionButton label="📄 My Applications" onClick={() => navigate('/applications')} />
          <ActionButton label="📝 Submit Weekly Report" onClick={() => navigate('/reports/submit')} />
          <ActionButton label="📁 My Reports" onClick={() => navigate('/reports')} />
          <ActionButton label="⭐ My Evaluations" onClick={() => navigate('/evaluations')} />
        </div>
      </div>
    </div>
  );
}
