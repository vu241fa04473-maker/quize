import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Simple protected route wrapper based on localStorage tokens
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem(`${role}Token`);
  if (!token) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/'} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-100 flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/quiz" element={
              <ProtectedRoute role="student">
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/result" element={
              <ProtectedRoute role="student">
                <ResultPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
