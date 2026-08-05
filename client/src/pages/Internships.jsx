import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function Internships() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInternships = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    axios.get(`${API}/api/internships`, { headers: { Authorization: `Bearer ${token}` }, params })
      .then(res => setInternships(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInternships(); }, []);

  const handleApply = (internship_id) => {
    navigate(`/applications/apply/${internship_id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Browse Internships</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title or skills..."
            className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by location..."
            className="w-48 px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={fetchInternships} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            Search
          </button>
        </div>

        {loading ? <p className="text-slate-500">Loading...</p> : internships.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No internships found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map(i => (
              <div key={i.internship_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{i.title}</h3>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">Open</span>
                </div>
                <p className="text-sm font-medium text-primary mb-2">{i.company_name}</p>
                <p className="text-sm text-slate-500 mb-1">📍 {i.location || 'N/A'} &nbsp;|&nbsp; ⏱ {i.duration || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-1">🏭 {i.industry || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-1">🛠 {i.required_skills || 'N/A'}</p>
                <p className="text-sm text-slate-500 mb-4">📅 Deadline: {i.deadline ? new Date(i.deadline).toLocaleDateString() : 'N/A'} &nbsp;|&nbsp; 👥 {i.positions} position(s)</p>
                {i.description && <p className="text-sm text-slate-600 mb-4 line-clamp-2">{i.description}</p>}
                {user.role === 'student' && (
                  <button onClick={() => handleApply(i.internship_id)} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
