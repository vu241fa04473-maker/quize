import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function StudentLogin() {
  const [name, setName] = useState('');
  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name || !emailOrRoll) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/student/login', { name, emailOrRoll });
      localStorage.setItem('studentToken', res.data.token);
      navigate('/quiz');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glassmorphism rounded-3xl p-10 transform transition-all hover:scale-[1.01] hover:shadow-indigo-500/20 hover:shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 mb-6 text-indigo-400 shadow-inner">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Student Portal</h1>
          <p className="text-indigo-200 mt-2 font-medium">Enter your details to start the exam</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-indigo-100 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-black/30 transition-all font-medium text-white placeholder-slate-400"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label htmlFor="emailOrRoll" className="block text-sm font-semibold text-indigo-100 mb-2">
              Email Address / Roll Number
            </label>
            <input
              id="emailOrRoll"
              type="text"
              value={emailOrRoll}
              onChange={(e) => setEmailOrRoll(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-black/30 transition-all font-medium text-white placeholder-slate-400"
              placeholder="e.g. 123456 or john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 flex items-center justify-center gap-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mt-4"
          >
            {loading ? 'Entering...' : 'Start Exam'}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
