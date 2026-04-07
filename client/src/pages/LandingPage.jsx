import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
          Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Online Quiz System</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-16 max-w-2xl mx-auto font-medium">
          Please select your portal to continue. Are you a student preparing to take an exam, or an administrator managing questions?
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Student Portal Card */}
          <Link 
            to="/student/login" 
            className="group block relative p-8 glassmorphism rounded-3xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-indigo-100 shadow-xl hover:shadow-indigo-200/50"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 bg-indigo-500/20 text-indigo-400 rounded-full group-hover:scale-110 transition-transform">
                <GraduationCap size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Student Portal</h2>
                <p className="text-indigo-200 mt-2 font-medium">Take interactive quizzes and view scores.</p>
              </div>
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link 
            to="/admin/login" 
            className="group block relative p-8 glassmorphism rounded-3xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-slate-100 shadow-xl hover:shadow-slate-200/50"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 bg-cyan-500/20 text-cyan-400 rounded-full group-hover:scale-110 transition-transform">
                <ShieldCheck size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Admin Portal</h2>
                <p className="text-cyan-200 mt-2 font-medium">Manage questions and quiz settings.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
