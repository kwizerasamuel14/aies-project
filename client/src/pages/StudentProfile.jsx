import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function StudentProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ department: '', faculty: '', skills: '', portfolio_url: '', university_id: '' });
  const [schools, setSchools] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/students/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setForm({
        department: res.data.department || '',
        faculty: res.data.faculty || '',
        skills: res.data.skills || '',
        portfolio_url: res.data.portfolio_url || '',
        university_id: res.data.university_id || '',
      })).catch(() => {});
    axios.get(`${API}/api/universities/list`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSchools(res.data)).catch(() => {});
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`${API}/api/students/profile`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Faculty', key: 'faculty', placeholder: 'e.g. Engineering' },
    { label: 'Department', key: 'department', placeholder: 'e.g. Computer Science' },
    { label: 'Skills', key: 'skills', placeholder: 'e.g. React, Node.js, Python' },
    { label: 'Your School (text)', key: 'portfolio_url', placeholder: 'e.g. University of Rwanda' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
          <h2 className="text-2xl font-bold text-slate-800">Student Profile</h2>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {fields.map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input type="text" placeholder={placeholder}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Your School</label>
            <select
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.university_id} onChange={(e) => setForm({ ...form, university_id: e.target.value })}>
              <option value="">-- Select school (optional) --</option>
              {schools.map(s => <option key={s.university_id} value={s.university_id}>{s.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
