import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function MyInternships() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      axios.get(`${API}/api/internships/mine`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API}/api/applications/review`, { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([i, a]) => { setInternships(i.data); setApplicants(a.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship? This cannot be undone.')) return;
    await axios.delete(`${API}/api/internships/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Internship Posts</h2>
          <button onClick={() => navigate('/internships/create')} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            + Post New
          </button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : internships.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No internships posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map(i => {
              const count = applicants.filter(a => a.internship_title === i.title).length;
              const accepted = applicants.filter(a => a.internship_title === i.title && a.status === 'accepted').length;
              return (
                <div key={i.internship_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{i.title}</h3>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${i.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{i.status}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        i.approval_status === 'approved' ? 'bg-blue-100 text-blue-600' :
                        i.approval_status === 'rejected' ? 'bg-red-100 text-red-600' :
                        i.approval_status === 'changes_requested' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>{i.approval_status === 'changes_requested' ? 'Changes Requested' : i.approval_status || 'pending'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">📍 {i.location || 'N/A'} &nbsp;|&nbsp; ⏱ {i.duration || 'N/A'}</p>
                  <p className="text-sm text-slate-500 mb-1">🛠 {i.required_skills || 'N/A'}</p>
                  <p className="text-sm text-slate-500 mb-3">📅 Deadline: {i.deadline ? new Date(i.deadline).toLocaleDateString() : 'N/A'} &nbsp;|&nbsp; 👥 {i.positions} position(s)</p>
                  <div className="flex gap-4 mb-4 text-sm">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">📨 {count} applicant{count !== 1 ? 's' : ''}</span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">✅ {accepted} accepted</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/internships/edit/${i.internship_id}`)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">
                      ✏️ Edit
                    </button>
                    <button onClick={() => navigate('/applications/review')} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                      👥 Applicants
                    </button>
                    <button onClick={() => handleDelete(i.internship_id)} className="px-4 py-2 text-red-500 hover:text-red-700 text-sm font-semibold">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
