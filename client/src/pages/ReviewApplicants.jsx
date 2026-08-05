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

export default function ReviewApplicants() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = () => {
    axios.get(`${API}/api/applications/review`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplicants(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplicants(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/api/applications/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchApplicants();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Review Applicants</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : applicants.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No applicants yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applicants.map(a => (
              <div key={a.application_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{a.student_name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[a.status]}`}>{a.status}</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">✉️ {a.student_email}</p>
                <p className="text-sm text-slate-500 mb-1">🎓 {a.faculty || 'N/A'} — {a.department || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-1">🛠 {a.skills || 'N/A'}</p>
                <p className="text-sm text-primary font-medium mb-4">Applied for: {a.internship_title}</p>
                <p className="text-sm text-slate-400 mb-4">📅 {new Date(a.applied_at).toLocaleDateString()}</p>
                {a.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(a.application_id, 'accepted')} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
                      Accept
                    </button>
                    <button onClick={() => updateStatus(a.application_id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
