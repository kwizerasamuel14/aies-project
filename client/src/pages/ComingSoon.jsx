import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ComingSoon({ title }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-md">
          <p className="text-5xl mb-4">🚧</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title || 'Coming Soon'}</h2>
          <p className="text-slate-500 text-sm mb-6">This feature is under development.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
