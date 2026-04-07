import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        const res = await axios.get('http://localhost:5000/api/quiz/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
      } catch (err) {
        setError('Failed to load questions. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    
    if (timeLeft <= 0) {
      handleFinalSubmit(); // auto submit when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, questions]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
    setShowUnansweredWarning(false);
  };

  const handleFinalSubmit = async () => {
    // block premature manual submission if questions remain
    if (Object.keys(answers).length < questions.length && timeLeft > 0) {
      setShowUnansweredWarning(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const res = await axios.post('http://localhost:5000/api/quiz/submit', 
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navigate to results
      navigate('/result', { state: { score: res.data.score, total: questions.length } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-slate-800 text-center mb-4">{error}</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Return to Login</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-500">No questions available. Please contact your instructor.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const unansweredCount = totalQuestions - Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock size={20} />
            <span className="text-lg tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-slate-500 font-medium">Time Remaining</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-500">
            Progress: {Object.keys(answers).length} / {totalQuestions}
          </div>
          <div className="w-32 md:w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Question Navigation Grid */}
        <aside className="lg:col-span-1 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200 order-2 lg:order-1 h-fit">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
            Questions
            {unansweredCount > 0 && (
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">{unansweredCount} Left</span>
            )}
          </h3>
          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q._id];
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                    h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all
                    ${isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                    ${isAnswered 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-indigo-300'}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Side: Question Card */}
        <main className="lg:col-span-3 flex flex-col order-1 lg:order-2">
          {showUnansweredWarning && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-3 shadow-sm animate-bounce">
              <AlertTriangle className="mt-0.5 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Unanswered Questions</h4>
                <p className="text-sm mt-0.5">You still have {unansweredCount} unanswered question(s). Please complete them before submitting.</p>
              </div>
            </div>
          )}

          <div className="flex-grow bg-white rounded-2xl p-6 md:p-8 xl:p-10 shadow-lg border border-slate-100 flex flex-col relative overflow-hidden">
            {/* Minimal Background Decor */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 z-0"></div>
            
            <div className="relative z-10 flex-grow">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 block">Question {currentIdx + 1}</span>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-tight">
                  {currentQuestion.text}
                </h2>
              </div>
              
              <div className="space-y-4 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion._id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(currentQuestion._id, option)}
                      className={`
                        w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between text-lg
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                      `}
                    >
                      <span className={`${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>
                        {option}
                      </span>
                      {isSelected && <CheckCircle className="text-indigo-600 flex-shrink-0" size={24} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2 transition"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 flex items-center gap-2 transition"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Final Quiz'}
                </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
