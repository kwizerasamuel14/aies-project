import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function CurrentInterns() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/applications/accepted`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInterns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Current Interns</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : interns.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No current interns. Accept applicants first.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interns.map(a => (
              <div key={a.application_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{a.student_name}</h3>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">Active</span>
                </div>
                <p className="text-sm text-primary font-medium mb-1">{a.internship_title}</p>
                <p className="text-sm text-slate-500 mb-1">✉️ {a.student_email}</p>
                <p className="text-sm text-slate-500 mb-1">🎓 {a.faculty || 'N/A'} — {a.department || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-4">🛠 {a.skills || 'N/A'}</p>
                <button onClick={() => navigate('/evaluations/submit', { state: { student_id: a.student_id, internship_id: a.internship_id } })} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  ⭐ Evaluate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
