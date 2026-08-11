import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function SupervisorStudents() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/evaluations/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Assigned Students</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : students.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No students assigned yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map(s => (
              <div key={s.student_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{s.name}</h3>
                <p className="text-sm text-slate-500 mb-1">✉️ {s.email}</p>
                <p className="text-sm text-slate-500 mb-1">🎓 {s.faculty || 'N/A'} — {s.department || 'N/A'}</p>
                <p className="text-sm text-slate-500">🛠 {s.skills || 'N/A'}</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => navigate('/supervisor/reports')} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">View Reports</button>
                  <button onClick={() => navigate('/supervisor/evaluations')} className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition">Evaluate</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
