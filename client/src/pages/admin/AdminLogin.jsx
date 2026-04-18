import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield } from 'lucide-react';
import API_BASE_URL from '../../config';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Credentials are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin/login`, { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4 text-emerald-400">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Access</h1>
          <p className="text-slate-400 mt-2">Secure management portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-900/50 text-red-300 border border-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-600"
              placeholder="venky"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-slate-900 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-colors font-bold text-lg mt-2"
          >
            {loading ? 'Authenticating...' : 'Login Server'}
          </button>
        </form>
      </div>
    </div>
  );
}
