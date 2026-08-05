import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import API from '../api';

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    axios.get(`${API}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    await axios.put(`${API}/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await axios.put(`${API}/api/notifications/read/all`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          {notifications.some(n => !n.is_read) && (
            <button onClick={markAllAsRead} className="text-sm text-primary hover:underline">Mark all as read</button>
          )}
        </div>
        {loading ? <p className="text-slate-500">Loading...</p> : notifications.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-400">No notifications yet.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.notification_id}
                className={`bg-white rounded-xl p-4 border flex justify-between items-start gap-4 ${!n.is_read ? 'border-primary' : 'border-slate-100'}`}>
                <div>
                  <p className={`text-sm ${!n.is_read ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.is_read && (
                  <button onClick={() => markAsRead(n.notification_id)} className="text-xs text-primary hover:underline whitespace-nowrap">Mark read</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
