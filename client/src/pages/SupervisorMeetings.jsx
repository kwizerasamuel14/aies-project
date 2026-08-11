import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function SupervisorMeetings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ student_id: '', meeting_date: '', meeting_time: '', notes: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMeetings = () => {
    axios.get(`${API}/api/meetings/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMeetings(res.data)).catch(() => {});
  };

  useEffect(() => {
    axios.get(`${API}/api/evaluations/students`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data)).catch(() => {});
    fetchMeetings();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/meetings`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Meeting scheduled successfully!');
      setForm({ student_id: '', meeting_date: '', meeting_time: '', notes: '' });
      fetchMeetings();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/meetings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchMeetings();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Schedule Meeting</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-slate-700">New Meeting</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                <select required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}>
                  <option value="">-- Select student --</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  value={form.meeting_date} onChange={(e) => setForm({ ...form, meeting_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input type="time" required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  value={form.meeting_time} onChange={(e) => setForm({ ...form, meeting_time: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={3} placeholder="Meeting agenda or notes..."
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                {loading ? 'Scheduling...' : 'Schedule Meeting'}
              </button>
            </form>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 mb-4">Scheduled Meetings ({meetings.length})</h3>
            {meetings.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center text-slate-400">No meetings scheduled yet.</div>
            ) : (
              <div className="space-y-3">
                {meetings.map(m => (
                  <div key={m.meeting_id} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">{m.student_name}</p>
                      <p className="text-sm text-slate-500">📅 {new Date(m.meeting_date).toLocaleDateString()} at {m.meeting_time?.slice(0, 5)}</p>
                      {m.notes && <p className="text-sm text-slate-500 mt-1">📝 {m.notes}</p>}
                    </div>
                    <button onClick={() => handleDelete(m.meeting_id)} className="text-xs text-red-400 hover:text-red-600 ml-4">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
