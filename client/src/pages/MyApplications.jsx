import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  accepted: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-600',
};

export default function MyApplications() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
          <button onClick={() => navigate('/internships')} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            Browse Internships
          </button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : applications.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No applications yet. Start browsing internships!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map(a => (
              <div key={a.application_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{a.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[a.status]}`}>{a.status}</span>
                </div>
                <p className="text-sm font-medium text-primary mb-2">{a.company_name}</p>
                <p className="text-sm text-slate-500 mb-1">📍 {a.location || 'N/A'} &nbsp;|&nbsp; ⏱ {a.duration || 'N/A'}</p>
                <p className="text-sm text-slate-500">📅 Applied: {new Date(a.applied_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
