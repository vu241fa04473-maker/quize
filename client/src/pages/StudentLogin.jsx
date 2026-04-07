import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import API_BASE_URL from '../config';

export default function StudentLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrRoll || !password || (isRegistering && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isRegistering ? '/auth/student/register' : '/auth/student/login';
      const payload = isRegistering 
        ? { name, emailOrRoll, password }
        : { emailOrRoll, password };

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      localStorage.setItem('studentToken', res.data.token);
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glassmorphism rounded-3xl p-10 transform transition-all hover:scale-[1.01] hover:shadow-indigo-500/20 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 mb-4 text-indigo-400 shadow-inner">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            {isRegistering ? 'Create Account' : 'Student Portal'}
          </h1>
          <p className="text-indigo-200 mt-2 font-medium">
            {isRegistering ? 'Register to take the exam' : 'Login to access your exam'}
          </p>
        </div>

        {/* Toggle Bar */}
        <div className="flex bg-black/40 rounded-xl mb-8 p-1">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${!isRegistering ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${isRegistering ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <UserPlus size={16} />
            Register
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 text-red-200 border border-red-500/30 text-sm font-medium backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-indigo-100 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-black/30 transition-all font-medium text-white placeholder-slate-500"
                placeholder="e.g. John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="emailOrRoll" className="block text-sm font-semibold text-indigo-100 mb-2">
              Email Address / Roll Number
            </label>
            <input
              id="emailOrRoll"
              type="text"
              value={emailOrRoll}
              onChange={(e) => setEmailOrRoll(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-black/30 transition-all font-medium text-white placeholder-slate-500"
              placeholder="e.g. 123456 or john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-indigo-100 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-black/30 transition-all font-medium text-white placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 flex items-center justify-center gap-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mt-6"
          >
            {loading ? 'Processing...' : isRegistering ? 'Create Account' : 'Start Exam'}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
