import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const ratings = [1, 2, 3, 4, 5];
const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

export default function SubmitEvaluation() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    student_id: location.state?.student_id || '',
    internship_id: location.state?.internship_id || '',
    technical_score: '',
    professional_score: '',
    comments: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const isCompanyUser = user.role === 'company' || user.role === 'company_supervisor';

  useEffect(() => {
    axios.get(`${API}/api/evaluations/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setStudents(res.data);
        // If student_id came from navigation state, ensure internship_id is set
        if (location.state?.student_id) {
          const matched = res.data.find(s => String(s.student_id) === String(location.state.student_id));
          if (matched && matched.internship_id) {
            setForm(prev => ({ ...prev, internship_id: matched.internship_id }));
          }
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load interns'))
      .finally(() => setFetching(false));
  }, [token, location.state]);

  const handleStudentSelect = (selectedId) => {
    const matched = students.find(s => String(s.student_id) === String(selectedId));
    setForm(prev => ({
      ...prev,
      student_id: selectedId,
      internship_id: matched?.internship_id || prev.internship_id || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/evaluations`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Evaluation submitted successfully!');
      setTimeout(() => {
        if (isCompanyUser) {
          navigate('/interns');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
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
          <button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline">← Back</button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{isCompanyUser ? 'Submit Intern Evaluation' : 'Submit Student Evaluation'}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{isCompanyUser ? 'Select one of your active interns to submit performance evaluation.' : 'Evaluate student performance and technical skills.'}</p>
          </div>
        </div>

        {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg mb-4 font-medium">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4 font-medium">{error}</div>}

        {!fetching && isCompanyUser && students.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-6 text-amber-800">
            <p className="font-semibold text-sm mb-1">⚠️ No Current Interns Found</p>
            <p className="text-xs text-amber-700 mb-3">You do not have any accepted interns yet. Only accepted applicants will display in the evaluation list.</p>
            <button onClick={() => navigate('/applications/review')} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 transition">
              👥 Review Applicants & Accept Interns
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5 border border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isCompanyUser ? 'Select Current Intern' : 'Select Student'} <span className="text-red-500">*</span>
            </label>
            <select required
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.student_id} onChange={(e) => handleStudentSelect(e.target.value)}>
              <option value="">{isCompanyUser ? '-- Select an active intern --' : '-- Select a student --'}</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} {s.internship_title ? `— ${s.internship_title}` : ''} {s.department ? `(${s.department})` : ''}
                </option>
              ))}
            </select>
          </div>

          <ScoreSelector label="Technical Skills (Knowledge, Problem Solving, Quality of Work)" field="technical_score" />
          <ScoreSelector label="Professional Skills (Communication, Teamwork, Time Management, Responsibility)" field="professional_score" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comments & Performance Feedback</label>
            <textarea rows={4} placeholder="Add your comments about the student's performance..."
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
          </div>

          <button type="submit" disabled={loading || !form.student_id || !form.technical_score || !form.professional_score}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
}
