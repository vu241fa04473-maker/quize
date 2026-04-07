import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, BarChart2 } from 'lucide-react';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };
  
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let status = 'Good Effort!';
  if (percentage >= 80) status = 'Excellent Work!';
  else if (percentage >= 50) status = 'Well Done!';
  else status = 'Keep Practicing!';

  // Clear student token to simulate logout / prevent multi-takes on same session
  useEffect(() => {
    // Optionally remove token to prevent back navigation
    localStorage.removeItem('studentToken');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glassmorphism rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
        {/* Confetti / Decor effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6">
            <Trophy size={48} />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Quiz Completed!</h1>
          <p className="text-lg text-slate-500 font-medium mb-8">{status}</p>

          <div className="bg-white/80 rounded-2xl p-6 border border-slate-100 mb-8 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-indigo-600 mb-4">
              <BarChart2 size={24} />
              <span className="font-semibold text-lg uppercase tracking-wide">Final Score</span>
            </div>
            <div className="flex justify-center items-end gap-2 mb-2">
              <span className="text-6xl font-black text-slate-800 leading-none">{score}</span>
              <span className="text-2xl text-slate-400 font-medium mb-1">/ {total}</span>
            </div>
            <div className="text-slate-500 font-medium">
              You scored <span className="text-indigo-600 font-bold">{percentage}%</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition text-lg"
          >
            <ArrowLeft size={20} />
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
