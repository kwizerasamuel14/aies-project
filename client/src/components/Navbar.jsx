import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api';

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUnread(res.data.filter(n => !n.is_read).length))
      .catch(() => {});
  }, [token]);

  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>AIES</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/notifications')} className="relative text-slate-500 hover:text-primary">
          🔔
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unread}</span>
          )}
        </button>
        <span className="text-sm text-slate-600">Welcome, <strong>{user.name}</strong></span>
        <span className="bg-blue-100 text-primary text-xs px-3 py-1 rounded-full font-medium capitalize">
          {user.role === 'university' ? 'School' : user.role?.replace(/_/g, ' ')}
        </span>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </div>
    </nav>
  );
}
