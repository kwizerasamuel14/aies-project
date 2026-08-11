import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import API from '../../api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'];

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
    <p className="text-slate-500 text-sm">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button onClick={onClick} className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-primary hover:shadow-sm transition w-full">
    <p className="font-semibold text-slate-700">{label}</p>
  </button>
);

export default function CompanyDashboard({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/internships/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setInternships(res.data)).catch(() => {});
    axios.get(`${API}/api/applications/review`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApplicants(res.data)).catch(() => {});
  }, [token]);

  const statusData = [
    { name: 'Pending', value: applicants.filter(a => a.status === 'pending').length },
    { name: 'Accepted', value: applicants.filter(a => a.status === 'accepted').length },
    { name: 'Rejected', value: applicants.filter(a => a.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const internshipData = internships.map(i => ({
    name: i.title.length > 15 ? i.title.substring(0, 15) + '...' : i.title,
    applicants: applicants.filter(a => a.internship_title === i.title).length,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Company Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Internship Posts" value={internships.length} color="border-primary" />
          <StatCard label="Total Applicants" value={applicants.length} color="border-yellow-400" />
          <StatCard label="Accepted Interns" value={applicants.filter(a => a.status === 'accepted').length} color="border-green-500" />
          <StatCard label="Pending Review" value={applicants.filter(a => a.status === 'pending').length} color="border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Applicants by Status</h3>
            {statusData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No applicants yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-md font-semibold text-slate-700 mb-4">Applicants per Internship</h3>
            {internshipData.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No internships yet</p> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={internshipData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#3b82f6" name="Applicants" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="📋 Complete Company Profile" onClick={() => navigate('/profile/company')} />
          <ActionButton label="➕ Post Internship" onClick={() => navigate('/internships/create')} />
          <ActionButton label="📌 My Internship Posts" onClick={() => navigate('/internships/mine')} />
          <ActionButton label="👥 Review Applicants" onClick={() => navigate('/applications/review')} />
          <ActionButton label="🧑‍💼 Current Interns" onClick={() => navigate('/interns')} />
          <ActionButton label="⭐ Submit Evaluation" onClick={() => navigate('/evaluations/submit')} />
        </div>
      </div>
    </div>
  );
}
