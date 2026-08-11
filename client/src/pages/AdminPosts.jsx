import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const approvalColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  approved: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
  changes_requested: 'bg-orange-100 text-orange-600',
};

const postTypeColors = {
  internship: 'bg-blue-100 text-blue-600',
  job: 'bg-purple-100 text-purple-600',
  event: 'bg-pink-100 text-pink-600',
  announcement: 'bg-indigo-100 text-indigo-600',
  other: 'bg-slate-100 text-slate-600',
};

export default function AdminPosts() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchPosts = () => {
    axios.get(`${API}/api/internships/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const updateApproval = async (id, approval_status) => {
    await axios.put(`${API}/api/internships/admin/${id}/approve`, { approval_status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchPosts();
  };

  const filtered = posts.filter(p => filter === 'all' ? true : p.approval_status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Company Posts Approval</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>

        <div className="flex gap-3 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <p className="text-slate-500">Loading...</p> : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(p => (
              <div key={p.internship_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{p.title}</h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${postTypeColors[p.post_type] || postTypeColors.other}`}>{p.post_type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${approvalColors[p.approval_status]}`}>{p.approval_status?.replace('_', ' ')}</span>
                  </div>
                </div>
                <p className="text-sm text-primary font-medium mb-1">🏢 {p.company_name}</p>
                {p.description && <p className="text-sm text-slate-500 mb-1">{p.description}</p>}
                {p.location && <p className="text-sm text-slate-500 mb-1">📍 {p.location}</p>}
                {p.deadline && <p className="text-sm text-slate-500 mb-3">📅 Deadline: {new Date(p.deadline).toLocaleDateString()}</p>}
                {p.approval_status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateApproval(p.internship_id, 'approved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">✅ Approve</button>
                    <button onClick={() => updateApproval(p.internship_id, 'changes_requested')} className="flex-1 bg-orange-400 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition">🔄 Request Changes</button>
                    <button onClick={() => updateApproval(p.internship_id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">❌ Reject</button>
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
