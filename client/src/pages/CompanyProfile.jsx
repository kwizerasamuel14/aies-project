import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function CompanyProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', industry: '', location: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfile = () => {
    axios.get(`${API}/api/companies/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setForm({
        name: res.data.name || '',
        industry: res.data.industry || '',
        location: res.data.location || '',
        email: res.data.email || '',
      })).catch(() => {});
  };

  useEffect(() => { fetchProfile(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`${API}/api/companies/profile`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile saved successfully!');
      fetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Company Name', key: 'name', placeholder: 'e.g. Tech Corp' },
    { label: 'Industry', key: 'industry', placeholder: 'e.g. Software Development' },
    { label: 'Location', key: 'location', placeholder: 'e.g. Kigali, Rwanda' },
    { label: 'Company Email', key: 'email', placeholder: 'company@example.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
          <h2 className="text-2xl font-bold text-slate-800">Company Profile</h2>
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
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
