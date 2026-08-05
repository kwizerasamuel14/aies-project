import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function UniversityStudents() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/evaluations/students', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Students</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : students.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No students registered yet.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Name', 'Email', 'Faculty', 'Department', 'Skills'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.student_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                    <td className="px-6 py-4 text-slate-500">{s.email}</td>
                    <td className="px-6 py-4 text-slate-500">{s.faculty || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500">{s.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500">{s.skills || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
