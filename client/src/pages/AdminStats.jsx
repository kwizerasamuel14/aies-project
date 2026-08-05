import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
    <p className="text-slate-500 text-sm">{label}</p>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default function AdminStats() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">System Statistics</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : !stats ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">Could not load stats.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value={stats.total_users} color="border-primary" />
            <StatCard label="Companies" value={stats.total_companies} color="border-yellow-400" />
            <StatCard label="Universities" value={stats.total_universities} color="border-indigo-500" />
            <StatCard label="Internships Posted" value={stats.total_internships} color="border-green-500" />
            <StatCard label="Applications" value={stats.total_applications} color="border-orange-400" />
            <StatCard label="Reports Submitted" value={stats.total_reports} color="border-pink-500" />
          </div>
        )}
      </div>
    </div>
  );
}
