import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const ratingLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
const ratingColors = { 1: 'text-red-500', 2: 'text-orange-500', 3: 'text-yellow-500', 4: 'text-blue-500', 5: 'text-green-500' };

export default function MyEvaluations() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/evaluations/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setEvaluations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Evaluations</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : evaluations.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No evaluations yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evaluations.map(e => (
              <div key={e.evaluation_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-1">{e.internship_title || 'General Evaluation'}</h3>
                <p className="text-sm text-slate-500 mb-4">By: {e.supervisor_name}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Technical Skills</p>
                    <p className={`text-2xl font-bold ${ratingColors[e.technical_score]}`}>{e.technical_score}/5</p>
                    <p className={`text-xs font-medium ${ratingColors[e.technical_score]}`}>{ratingLabels[e.technical_score]}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Professional Skills</p>
                    <p className={`text-2xl font-bold ${ratingColors[e.professional_score]}`}>{e.professional_score}/5</p>
                    <p className={`text-xs font-medium ${ratingColors[e.professional_score]}`}>{ratingLabels[e.professional_score]}</p>
                  </div>
                </div>
                {e.comments && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-700"><span className="font-medium">Comments:</span> {e.comments}</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-3">{new Date(e.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
