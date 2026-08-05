import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function SubmitReport() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ week_number: '', activities: '', challenges: '', skills_learned: '', internship_id: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/reports`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Report submitted successfully!');
      setTimeout(() => navigate('/reports'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/reports')} className="text-sm text-primary hover:underline">← Back</button>
          <h2 className="text-2xl font-bold text-slate-800">Submit Weekly Report</h2>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Week Number</label>
            <input type="number" placeholder="e.g. 1" required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.week_number} onChange={(e) => setForm({ ...form, week_number: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Activities Completed</label>
            <textarea rows={3} placeholder="What did you work on this week?" required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Challenges Faced</label>
            <textarea rows={3} placeholder="Any difficulties or blockers?"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skills Learned</label>
            <textarea rows={3} placeholder="What new skills did you gain?"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.skills_learned} onChange={(e) => setForm({ ...form, skills_learned: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
