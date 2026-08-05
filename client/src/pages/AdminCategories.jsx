import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const defaultCategories = ['Software Development', 'Data Analysis', 'Graphic Design', 'Marketing', 'Finance', 'Engineering', 'Healthcare', 'Education'];

export default function AdminCategories() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('categories') || JSON.stringify(defaultCategories)));
  const [newCat, setNewCat] = useState('');

  const addCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const updated = [...categories, newCat.trim()];
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    setNewCat('');
  };

  const deleteCategory = (cat) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Internship Categories</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline">← Dashboard</button>
        </div>
        <form onSubmit={addCategory} className="flex gap-3 mb-6">
          <input type="text" placeholder="Add new category..." value={newCat} onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
          <button type="submit" className="bg-primary text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Add</button>
        </form>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {categories.map((cat, i) => (
            <div key={i} className="flex justify-between items-center px-6 py-4 border-b border-slate-100 last:border-0">
              <span className="text-slate-700 font-medium">📌 {cat}</span>
              <button onClick={() => deleteCategory(cat)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
