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

export default function ReviewReports() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});

  const [error, setError] = useState('');

  const fetchReports = () => {
    axios.get(`${API}/api/reports/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const reviewReport = async (id, status) => {
    setError('');
    try {
      await axios.put(`${API}/api/reports/${id}/review`, { status, feedback: feedback[id] || '' }, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Review Reports</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        {loading ? <p className="text-slate-500">Loading...</p> : reports.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No reports to review.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(r => (
              <div key={r.report_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">{r.student_name} — Week {r.week_number}</h3>
                    {r.internship_title && <p className="text-sm text-primary">{r.internship_title}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Activities:</span> {r.activities}</p>
                {r.challenges && <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Challenges:</span> {r.challenges}</p>}
                {r.skills_learned && <p className="text-sm text-slate-600 mb-3"><span className="font-medium">Skills:</span> {r.skills_learned}</p>}
                {r.status === 'pending' && (
                  <>
                    <textarea
                      rows={2}
                      placeholder="Add feedback (optional)..."
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-primary"
                      value={feedback[r.report_id] || ''}
                      onChange={(e) => setFeedback({ ...feedback, [r.report_id]: e.target.value })}
                    />
                    <div className="flex gap-3">
                      <button onClick={() => reviewReport(r.report_id, 'approved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">Approve</button>
                      <button onClick={() => reviewReport(r.report_id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">Reject</button>
                    </div>
                  </>
                )}
                {r.feedback && <div className="mt-3 p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-700"><span className="font-medium">Feedback:</span> {r.feedback}</p></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
