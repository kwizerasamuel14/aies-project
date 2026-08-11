import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import API from '../../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

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

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data)).catch(() => {});
    axios.get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data)).catch(() => {});
  }, [token]);

  const roleData = ['student', 'company', 'university', 'academic_supervisor', 'company_supervisor', 'admin'].map(role => ({
    name: role.replace(/_/g, ' '),
    count: users.filter(u => u.role === role).length,
  })).filter(d => d.count > 0);

  const systemData = stats ? [
    { name: 'Users', value: parseInt(stats.total_users) },
    { name: 'Companies', value: parseInt(stats.total_companies) },
    { name: 'Universities', value: parseInt(stats.total_universities) },
    { name: 'Internships', value: parseInt(stats.total_internships) },
    { name: 'Applications', value: parseInt(stats.total_applications) },
    { name: 'Reports', value: parseInt(stats.total_reports) },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Users" value={stats?.total_users || 0} color="border-primary" />
          <StatCard label="Companies" value={stats?.total_companies || 0} color="border-yellow-400" />
          <StatCard label="Universities" value={stats?.total_universities || 0} color="border-green-500" />
          <StatCard label="Internships" value={stats?.total_internships || 0} color="border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Users by Role</h3>
            {roleData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No users yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="name" label={({ name, count }) => `${name}: ${count}`}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">System Overview</h3>
            {systemData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">Loading...</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={systemData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" name="Count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="👥 Manage Users" onClick={() => navigate('/admin/users')} />
          <ActionButton label="🏢 Manage Companies" onClick={() => navigate('/admin/companies')} />
          <ActionButton label="🎓 Manage Universities" onClick={() => navigate('/admin/universities')} />
          <ActionButton label="📌 Internship Categories" onClick={() => navigate('/admin/categories')} />
          <ActionButton label="📋 Approve Company Posts" onClick={() => navigate('/admin/posts')} />
          <ActionButton label="📊 View Reports" onClick={() => navigate('/admin/reports')} />
          <ActionButton label="⚙️ System Settings" onClick={() => navigate('/admin/settings')} />
        </div>
      </div>
    </div>
  );
}
