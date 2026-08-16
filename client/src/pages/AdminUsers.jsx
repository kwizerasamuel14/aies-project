import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

const statusColors = {
  active: 'bg-green-100 text-green-600',
  inactive: 'bg-slate-100 text-slate-500',
  suspended: 'bg-red-100 text-red-600',
};

export default function AdminUsers() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    axios.get(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/api/admin/users/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`${API}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Manage Users</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-slate-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.user_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 capitalize text-slate-600">{u.role === 'university' ? 'School' : u.role?.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {u.status !== 'suspended' && (
                          <button onClick={() => updateStatus(u.user_id, 'suspended')} className="text-xs text-orange-500 hover:underline">Suspend</button>
                        )}
                        {u.status === 'suspended' && (
                          <button onClick={() => updateStatus(u.user_id, 'active')} className="text-xs text-green-500 hover:underline">Activate</button>
                        )}
                        <button onClick={() => deleteUser(u.user_id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
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
