import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import API from '../../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

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

export default function UniversityDashboard({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [reports, setReports] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/reports/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data)).catch(() => {});
    axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => {});
  }, [token]);

  const reportStatusData = [
    { name: 'Pending', value: reports.filter(r => r.status === 'pending').length },
    { name: 'Approved', value: reports.filter(r => r.status === 'approved').length },
    { name: 'Rejected', value: reports.filter(r => r.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const weeklyData = Array.from(new Set(reports.map(r => r.week_number)))
    .sort((a, b) => a - b)
    .map(week => ({ week: `Week ${week}`, reports: reports.filter(r => r.week_number === week).length }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">University Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Reports" value={reports.length} color="border-primary" />
          <StatCard label="Approved Reports" value={reports.filter(r => r.status === 'approved').length} color="border-green-500" />
          <StatCard label="Pending Reports" value={reports.filter(r => r.status === 'pending').length} color="border-yellow-400" />
          <StatCard label="Rejected Reports" value={reports.filter(r => r.status === 'rejected').length} color="border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Report Status Overview</h3>
            {reportStatusData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No reports yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={reportStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {reportStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Reports per Week</h3>
            {weeklyData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No reports yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#22c55e" name="Reports" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="📋 Complete University Profile" onClick={() => navigate('/profile/university')} />
          <ActionButton label="🎓 Manage Students" onClick={() => navigate('/university/students')} />
          <ActionButton label="✅ Approve Placements" onClick={() => navigate('/university/placements')} />
          <ActionButton label="👨🏫 Assign Supervisors" onClick={() => navigate('/university/supervisors')} />
          <ActionButton label="📝 Review Reports" onClick={() => navigate('/university/reports')} />
          <ActionButton label="📊 Generate Statistics" onClick={() => navigate('/university/stats')} />
        </div>
      </div>
    </div>
  );
}
