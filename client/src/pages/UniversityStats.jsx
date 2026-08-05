import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

export default function UniversityStats() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/reports/all', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/evaluations/all', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([r, e]) => { setReports(r.data); setEvaluations(e.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const reportStatusData = [
    { name: 'Pending', value: reports.filter(r => r.status === 'pending').length },
    { name: 'Approved', value: reports.filter(r => r.status === 'approved').length },
    { name: 'Rejected', value: reports.filter(r => r.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const avgTechnical = evaluations.length ? (evaluations.reduce((s, e) => s + e.technical_score, 0) / evaluations.length).toFixed(1) : 'N/A';
  const avgProfessional = evaluations.length ? (evaluations.reduce((s, e) => s + e.professional_score, 0) / evaluations.length).toFixed(1) : 'N/A';

  const weeklyData = Array.from(new Set(reports.map(r => r.week_number))).sort((a, b) => a - b)
    .map(w => ({ week: `W${w}`, reports: reports.filter(r => r.week_number === w).length }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">University Statistics</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary"><p className="text-slate-500 text-sm">Total Reports</p><p className="text-2xl font-bold text-slate-800 mt-1">{reports.length}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500"><p className="text-slate-500 text-sm">Approved Reports</p><p className="text-2xl font-bold text-slate-800 mt-1">{reports.filter(r => r.status === 'approved').length}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400"><p className="text-slate-500 text-sm">Avg Technical Score</p><p className="text-2xl font-bold text-slate-800 mt-1">{avgTechnical}/5</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500"><p className="text-slate-500 text-sm">Avg Professional Score</p><p className="text-2xl font-bold text-slate-800 mt-1">{avgProfessional}/5</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-md font-semibold text-slate-700 mb-4">Report Status</h3>
                {reportStatusData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No data yet</p> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart><Pie data={reportStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {reportStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie><Tooltip /></PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-md font-semibold text-slate-700 mb-4">Reports per Week</h3>
                {weeklyData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No data yet</p> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyData}><XAxis dataKey="week" /><YAxis allowDecimals={false} /><Tooltip />
                      <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
