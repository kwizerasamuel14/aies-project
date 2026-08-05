import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminSettings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('settings') || JSON.stringify({
    siteName: 'AIES',
    allowRegistration: true,
    maxReportsPerWeek: 1,
    evaluationDeadlineDays: 7,
  })));
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('settings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        {message && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4">{message}</div>}
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
            <input type="text" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Reports Per Week</label>
            <input type="number" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={settings.maxReportsPerWeek} onChange={(e) => setSettings({ ...settings, maxReportsPerWeek: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Evaluation Deadline (days)</label>
            <input type="number" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
              value={settings.evaluationDeadlineDays} onChange={(e) => setSettings({ ...settings, evaluationDeadlineDays: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="allowReg" checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="allowReg" className="text-sm font-medium text-slate-700">Allow New Registrations</label>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Save Settings</button>
        </form>
      </div>
    </div>
  );
}
