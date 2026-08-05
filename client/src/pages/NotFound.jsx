import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
