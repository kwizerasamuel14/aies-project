import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const approvalColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  changes_requested: 'bg-orange-100 text-orange-700',
};

const postTypeColors = {
  internship: 'bg-blue-100 text-blue-700',
  job: 'bg-purple-100 text-purple-700',
  event: 'bg-pink-100 text-pink-700',
  announcement: 'bg-indigo-100 text-indigo-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function AdminPosts() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [comments, setComments] = useState({});
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchPosts = () => {
    setLoading(true);
    axios.get(`${API}/api/internships/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPosts(res.data))
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const isPostExpired = (p) => {
    if (p.is_deleted && p.deletion_reason === 'expired') return true;
    if (!p.deadline) return false;
    const deadlineDate = new Date(p.deadline);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate.getTime() < Date.now();
  };

  const updateApproval = async (id, approval_status) => {
    if (!comments[id] && approval_status !== 'approved') {
      setError('Comment required for reject/changes request');
      return;
    }

    setUpdating({ ...updating, [id]: true });
    setError('');
    setMessage('');

    try {
      await axios.put(`${API}/api/internships/admin/${id}/approve`,
        { approval_status, admin_comment: comments[id] || '' },
        { headers: { Authorization: `Bearer ${token}` } });
      setMessage(`✅ Post ${approval_status.replace('_', ' ')} successfully!`);
      setTimeout(() => {
        setMessage('');
        fetchPosts();
        setComments({});
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setUpdating({ ...updating, [id]: false });
    }
  };

  const handleDeleteExpired = async (id, title) => {
    if (!window.confirm(`Delete expired post "${title}"? It will be moved to Expired Posts.`)) return;

    setDeleting({ ...deleting, [id]: true });
    setError('');
    setMessage('');

    try {
      await axios.delete(`${API}/api/internships/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason: 'expired' }
      });
      setMessage('✅ Post deleted successfully and redirected to Expired Posts!');
      fetchPosts();
      setFilter('expired'); // Redirect to Expired Posts tab
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expired post');
    } finally {
      setDeleting({ ...deleting, [id]: false });
    }
  };

  const expiredCount = posts.filter(p => p.is_deleted || isPostExpired(p)).length;
  const pendingCount = posts.filter(p => p.approval_status === 'pending' && !p.is_deleted).length;
  const approvedCount = posts.filter(p => p.approval_status === 'approved' && !p.is_deleted).length;
  const changesCount = posts.filter(p => p.approval_status === 'changes_requested' && !p.is_deleted).length;
  const rejectedCount = posts.filter(p => p.approval_status === 'rejected' && !p.is_deleted).length;

  const filtered = posts.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'expired') return p.is_deleted || isPostExpired(p);
    if (filter === 'pending') return p.approval_status === 'pending' && !p.is_deleted;
    if (filter === 'approved') return p.approval_status === 'approved' && !p.is_deleted;
    if (filter === 'changes_requested') return p.approval_status === 'changes_requested' && !p.is_deleted;
    if (filter === 'rejected') return p.approval_status === 'rejected' && !p.is_deleted;
    return p.approval_status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Company Posts Approval & Moderation</h2>
            <p className="text-sm text-slate-500 mt-1">Review, approve, request changes, or delete expired company posts.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>

        {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg mb-4 font-medium">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4 font-medium">{error}</div>}

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'pending', label: 'Pending Approval', count: pendingCount },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'changes_requested', label: 'Changes Requested', count: changesCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
            { id: 'expired', label: 'Expired Posts', count: expiredCount, badgeColor: 'bg-red-100 text-red-700' },
            { id: 'all', label: 'All Posts', count: posts.length },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                filter === f.id ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary'
              }`}>
              <span>{f.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                filter === f.id ? 'bg-blue-800 text-white' : f.badgeColor || 'bg-slate-100 text-slate-600'
              }`}>{f.count}</span>
            </button>
          ))}
        </div>

        {loading ? <p className="text-slate-500">Loading posts...</p> : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-400 border border-slate-100">
            <p className="text-base font-medium">No posts found in "{filter.replace('_', ' ')}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(p => {
              const expired = isPostExpired(p);
              return (
                <div key={p.internship_id} className={`bg-white rounded-xl shadow-sm p-6 border ${p.is_deleted ? 'border-red-200 bg-red-50/30' : expired ? 'border-amber-200' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-slate-800 text-lg">{p.title}</h3>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${postTypeColors[p.post_type] || postTypeColors.other}`}>{p.post_type}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${approvalColors[p.approval_status]}`}>{p.approval_status?.replace('_', ' ')}</span>
                      {p.is_deleted ? (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700">🔴 Deleted (Expired)</span>
                      ) : expired ? (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-100 text-amber-800">⚠️ Expired</span>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-sm text-primary font-semibold mb-3">🏢 {p.company_name}</p>

                  {p.description && <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">{p.description}</p>}

                  {/* Duration and Applicant Count visible before approval */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100/60 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">⏱ Duration</p>
                      <p className="font-semibold text-slate-800">{p.duration || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">📨 Number of Applicants</p>
                      <p className="font-semibold text-primary">{p.applicant_count ?? 0} applicant{(p.applicant_count ?? 0) !== 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">👥 Positions Available</p>
                      <p className="font-semibold text-slate-800">{p.positions || 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">📅 Application Deadline</p>
                      <p className={`font-semibold ${expired ? 'text-red-600' : 'text-slate-800'}`}>
                        {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'} {expired && '(Expired)'}
                      </p>
                    </div>
                  </div>

                  {p.location && <p className="text-xs text-slate-500 mb-1">📍 <strong>Location:</strong> {p.location}</p>}
                  {p.required_skills && <p className="text-xs text-slate-500 mb-3">🛠 <strong>Required Skills:</strong> {p.required_skills}</p>}

                  {/* Deleted / Expired status info banner */}
                  {p.is_deleted && (
                    <div className="p-3 bg-red-100/70 border border-red-200 rounded-lg mb-3">
                      <p className="text-xs text-red-800 font-semibold">🔴 Expired Post Deleted</p>
                      <p className="text-xs text-red-700">Deleted on: {p.deleted_at ? new Date(p.deleted_at).toLocaleString() : 'N/A'}</p>
                      <p className="text-xs text-red-700">Reason: {p.deletion_reason || 'expired'}</p>
                    </div>
                  )}

                  {/* Admin Comment if any */}
                  {p.admin_comment && (
                    <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs font-semibold text-orange-700">💬 Admin Feedback / Comment:</p>
                      <p className="text-sm text-orange-800 mt-0.5">{p.admin_comment}</p>
                    </div>
                  )}

                  {/* Approval Actions for Pending non-deleted posts */}
                  {p.approval_status === 'pending' && !p.is_deleted && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Admin Feedback / Reason:</label>
                      <textarea rows={2} placeholder="Add feedback or comment (required for reject / request changes)..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-primary"
                        value={comments[p.internship_id] || ''}
                        onChange={(e) => setComments({ ...comments, [p.internship_id]: e.target.value })} />
                      <div className="flex gap-2">
                        <button onClick={() => updateApproval(p.internship_id, 'approved')} disabled={updating[p.internship_id]}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">
                          {updating[p.internship_id] ? '⏳ Processing...' : '✅ Approve'}
                        </button>
                        <button onClick={() => updateApproval(p.internship_id, 'changes_requested')} disabled={updating[p.internship_id]}
                          className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50">
                          {updating[p.internship_id] ? '⏳ Processing...' : '🔄 Request Changes'}
                        </button>
                        <button onClick={() => updateApproval(p.internship_id, 'rejected')} disabled={updating[p.internship_id]}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50">
                          {updating[p.internship_id] ? '⏳ Processing...' : '❌ Reject'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delete Expired Post button if post is expired and not yet deleted */}
                  {!p.is_deleted && (expired || filter === 'expired') && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => handleDeleteExpired(p.internship_id, p.title)} disabled={deleting[p.internship_id]}
                        className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2">
                        {deleting[p.internship_id] ? '⏳ Deleting...' : '🗑️ Delete Expired Post (Move to Expired)'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

