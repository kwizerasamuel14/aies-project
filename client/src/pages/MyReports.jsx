import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  approved: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
};

export default function MyReports() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/reports/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Reports</h2>
          <button onClick={() => navigate('/reports/submit')} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            + Submit Report
          </button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : reports.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No reports submitted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(r => (
              <div key={r.report_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-800">Week {r.week_number}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                {r.internship_title && <p className="text-sm text-primary font-medium mb-2">{r.internship_title}</p>}
                <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Activities:</span> {r.activities}</p>
                {r.challenges && <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Challenges:</span> {r.challenges}</p>}
                {r.skills_learned && <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Skills:</span> {r.skills_learned}</p>}
                {r.feedback && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700"><span className="font-medium">Feedback:</span> {r.feedback}</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-3">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
