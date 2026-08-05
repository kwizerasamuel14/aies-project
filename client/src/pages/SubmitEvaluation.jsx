import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const ratings = [1, 2, 3, 4, 5];
const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

export default function SubmitEvaluation() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_id: '', internship_id: '', technical_score: '', professional_score: '', comments: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/evaluations/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data))
      .catch(() => {});
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/evaluations`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Evaluation submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setLoading(false);
    }
  };

  const ScoreSelector = ({ label, field }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-3">
        {ratings.map(r => (
          <button key={r} type="button"
            onClick={() => setForm({ ...form, [field]: r })}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition ${form[field] === r ? 'bg-primary text-white border-primary' : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-primary'}`}>
            {r}<br /><span className="text-xs font-normal">{ratingLabels[r]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Back</button>
          <h2 className="text-2xl font-bold text-slate-800">Submit Evaluation</h2>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
            <select required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
              <option value="">-- Select a student --</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.name} — {s.department || 'N/A'}</option>
              ))}
            </select>
          </div>

          <ScoreSelector label="Technical Skills (Knowledge, Problem Solving, Quality of Work)" field="technical_score" />
          <ScoreSelector label="Professional Skills (Communication, Teamwork, Time Management, Responsibility)" field="professional_score" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
            <textarea rows={4} placeholder="Add your comments about the student's performance..."
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
          </div>

          <button type="submit" disabled={loading || !form.technical_score || !form.professional_score}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
}
