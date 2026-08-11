import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function SupervisorApprovals() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/applications/accepted`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const markCompleted = async (id) => {
    try {
      await axios.put(`${API}/api/applications/${id}/status`, { status: 'completed' }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Internship marked as completed!');
      setApplications(prev => prev.filter(a => a.application_id !== id));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Approve Internship Completion</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {loading ? <p className="text-slate-500">Loading...</p> : applications.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No accepted internships to approve completion for.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map(a => (
              <div key={a.application_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{a.student_name}</h3>
                <p className="text-sm text-primary font-medium mb-1">{a.internship_title}</p>
                <p className="text-sm text-slate-500 mb-1">✉️ {a.student_email}</p>
                <p className="text-sm text-slate-500 mb-1">🎓 {a.faculty || 'N/A'} — {a.department || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-4">📅 Applied: {new Date(a.applied_at).toLocaleDateString()}</p>
                <button onClick={() => markCompleted(a.application_id)} className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
                  ✅ Mark as Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
