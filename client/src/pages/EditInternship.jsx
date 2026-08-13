import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function EditInternship() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', required_skills: '', duration: '', location: '', deadline: '', positions: 1, status: 'open', post_type: 'internship' });
  const [internship, setInternship] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/internships/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const foundInternship = res.data.find(i => i.internship_id === parseInt(id));
        if (foundInternship) {
          setInternship(foundInternship);
          setForm({
            title: foundInternship.title || '',
            description: foundInternship.description || '',
            required_skills: foundInternship.required_skills || '',
            duration: foundInternship.duration || '',
            location: foundInternship.location || '',
            deadline: foundInternship.deadline ? foundInternship.deadline.split('T')[0] : '',
            positions: foundInternship.positions || 1,
            status: foundInternship.status || 'open',
            post_type: foundInternship.post_type || 'internship',
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`${API}/api/internships/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Internship updated successfully!');
      setTimeout(() => navigate('/internships/mine'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update internship');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/internships/mine')} className="text-sm text-primary hover:underline">← My Internships</button>
          <h2 className="text-2xl font-bold text-slate-800">Edit Internship</h2>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        {internship && internship.approval_status === 'changes_requested' && internship.admin_comment && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-orange-600 mb-2">💬 Admin's Feedback:</p>
            <p className="text-sm text-orange-700 mb-3">{internship.admin_comment}</p>
            <p className="text-xs text-orange-500">✏️ Make the requested changes and save to resubmit for review.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Post Type / Category</label>
            <select required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.post_type} onChange={(e) => setForm({ ...form, post_type: e.target.value })}>
              <option value="internship">Academic Internship</option>
              <option value="job">Job Opportunity</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
              <option value="other">Other</option>
            </select>
          </div>
          {[
            { label: 'Internship Title', key: 'title', required: true },
            { label: 'Location', key: 'location' },
            { label: 'Duration', key: 'duration', placeholder: 'e.g. 3 months' },
            { label: 'Required Skills', key: 'required_skills' },
          ].map(({ label, key, placeholder, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input type="text" placeholder={placeholder || ''} required={required}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input type="date" required
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Positions</label>
              <input type="number" min="1"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={form.positions} onChange={(e) => setForm({ ...form, positions: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea rows={4} placeholder="Describe the internship role..."
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
