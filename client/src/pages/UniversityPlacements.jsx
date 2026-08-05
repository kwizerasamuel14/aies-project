import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function UniversityPlacements() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const unique = [...new Map(res.data.map(r => [r.student_id, r])).values()];
        setReports(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Internship Placements</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : reports.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No placements yet. Students need to submit reports first.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(r => (
              <div key={r.student_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{r.student_name}</h3>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">Active</span>
                </div>
                {r.internship_title && <p className="text-sm text-primary font-medium mb-2">{r.internship_title}</p>}
                <p className="text-sm text-slate-500">📝 Has submitted weekly reports</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
