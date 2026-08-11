import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function PostInternship() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', required_skills: '', duration: '', location: '', deadline: '', positions: 1, post_type: 'internship' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/internships`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Post submitted! Waiting for admin approval.');
      setTimeout(() => navigate('/internships/mine'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Internship Title', key: 'title', placeholder: 'e.g. Frontend Developer Intern', required: true },
    { label: 'Location', key: 'location', placeholder: 'e.g. Kigali, Rwanda' },
    { label: 'Duration', key: 'duration', placeholder: 'e.g. 3 months' },
    { label: 'Required Skills', key: 'required_skills', placeholder: 'e.g. React, JavaScript, CSS' },
    { label: 'Application Deadline', key: 'deadline', type: 'date', required: true },
    { label: 'Number of Positions', key: 'positions', type: 'number', placeholder: '1' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Back</button>
          <h2 className="text-2xl font-bold text-slate-800">Post Internship</h2>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Post Type</label>
            <select required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.post_type} onChange={(e) => setForm({ ...form, post_type: e.target.value })}>
              <option value="internship">Academic Internship</option>
              <option value="job">Job Opportunity</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
              <option value="other">Other</option>
            </select>
          </div>
          {fields.map(({ label, key, placeholder, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                type={type || 'text'}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the internship role and responsibilities..."
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Posting...' : 'Post Internship'}
          </button>
        </form>
      </div>
    </div>
  );
}
