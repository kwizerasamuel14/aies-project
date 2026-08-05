import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

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

export default function CompanySupervisorDashboard({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [interns, setInterns] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications/accepted', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInterns(res.data)).catch(() => {});
    axios.get('http://localhost:5000/api/evaluations/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEvaluations(res.data)).catch(() => {});
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Company Supervisor Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Active Interns" value={interns.length} color="border-primary" />
          <StatCard label="Evaluations Given" value={evaluations.filter(e => e.supervisor_id === user?.user_id).length} color="border-yellow-400" />
          <StatCard label="Total Evaluations" value={evaluations.length} color="border-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="🧑‍💼 Manage Assigned Interns" onClick={() => navigate('/supervisor/interns')} />
          <ActionButton label="📝 Submit Weekly Evaluation" onClick={() => navigate('/supervisor/evaluations/weekly')} />
          <ActionButton label="⭐ Rate Student Skills" onClick={() => navigate('/supervisor/evaluations/weekly')} />
          <ActionButton label="💬 Add Comments" onClick={() => navigate('/supervisor/evaluations/weekly')} />
          <ActionButton label="📋 Submit Final Assessment" onClick={() => navigate('/supervisor/evaluations/final')} />
          <ActionButton label="✅ Approve Completion" onClick={() => navigate('/supervisor/approvals')} />
        </div>
      </div>
    </div>
  );
}
