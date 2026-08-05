import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function ApplyInternship() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const { internship_id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/internships`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const found = res.data.find(i => i.internship_id === parseInt(internship_id));
        setInternship(found || null);
      });
  }, [internship_id, token]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/applications`, { internship_id }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Application submitted successfully!');
      setTimeout(() => navigate('/applications'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  if (!internship) return <div className="p-8 text-slate-500">Loading internship details...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <button onClick={() => navigate('/internships')} className="text-sm text-primary hover:underline mb-6 block">← Back to Internships</button>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{internship.title}</h2>
          <p className="text-primary font-medium mb-4">{internship.company_name}</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
            <p>📍 {internship.location || 'N/A'}</p>
            <p>⏱ {internship.duration || 'N/A'}</p>
            <p>🛠 {internship.required_skills || 'N/A'}</p>
            <p>👥 {internship.positions} position(s)</p>
            <p>📅 Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}</p>
          </div>
          {internship.description && <p className="text-sm text-slate-600">{internship.description}</p>}
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <button onClick={handleApply} disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          {loading ? 'Submitting...' : 'Confirm Application'}
        </button>
      </div>
    </div>
  );
}
