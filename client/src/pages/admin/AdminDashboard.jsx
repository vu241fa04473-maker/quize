import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, Trash2, Edit2, Check, Users, List } from 'lucide-react';
import API_BASE_URL from '../../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'results'
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [questionsRes, submissionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/questions`, { headers }),
        axios.get(`${API_BASE_URL}/admin/submissions`, { headers })
      ]);
      
      setQuestions(questionsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleOptionChange = (idx, val) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setEditingId(null);
  };

  const handleEdit = (q) => {
    setEditingId(q._id);
    setText(q.text);
    setOptions([...q.options]);
    setCorrectAnswer(q.correctAnswer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('questions');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || options.some(opt => !opt) || !correctAnswer) {
      alert('Please fill out all fields. Ensure the correct answer precisely matches an option.');
      return;
    }

    if (!options.includes(correctAnswer)) {
      alert('The correct answer must be one of the provided options.');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const payload = { text, options, correctAnswer };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/admin/questions/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/admin/questions`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save question');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Manage quiz questions and student results</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-red-600 transition shadow-sm"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <List size={20} />
            Manage Questions
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            Student Results
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : activeTab === 'questions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Form */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  {editingId ? <Edit2 size={20} className="text-indigo-600"/> : <Plus size={20} className="text-emerald-600"/>}
                  {editingId ? 'Edit Question' : 'Add New Question'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Question Text</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 placeholder-slate-400"
                      rows="3"
                      placeholder="What is 2 + 2?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Options</label>
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex flex-col">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                          placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Correct Answer</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                    >
                      <option value="" disabled>Select correct answer</option>
                      {options.filter(Boolean).map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-medium"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`flex-1 py-2.5 text-white rounded-lg transition font-medium shadow-sm flex items-center justify-center gap-2 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                      <Check size={18} />
                      {editingId ? 'Update' : 'Add Question'}
                    </button>
                  </div>
                </form>
              </div>
            </aside>

            {/* Existing Questions List */}
            <main className="lg:col-span-2">
              {questions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Plus size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">No questions yet</h3>
                  <p className="text-slate-500 mt-2">Use the side panel to add your first quiz question.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">Q {idx + 1}</span>
                          </div>
                          <h3 className="text-lg font-medium text-slate-800 mb-4">{q.text}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {q.options.map((opt, i) => (
                              <div 
                                key={i} 
                                className={`p-2.5 rounded-lg border ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium flex items-center justify-between' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                              >
                                <span>{['A', 'B', 'C', 'D'][i]}. {opt}</span>
                                {opt === q.correctAnswer && <Check size={16} className="text-emerald-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button 
                            onClick={() => handleEdit(q)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit question"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(q._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete question"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        ) : (
          /* Student Results View */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {submissions.length === 0 ? (
               <div className="p-12 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Users size={32} />
                 </div>
                 <h3 className="text-xl font-semibold text-slate-800">No submissions yet</h3>
                 <p className="text-slate-500 mt-2">When students take the quiz, their results will appear here.</p>
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 font-semibold text-sm text-slate-600">Student Name</th>
                      <th className="px-6 py-4 font-semibold text-sm text-slate-600">Roll/Email</th>
                      <th className="px-6 py-4 font-semibold text-sm text-slate-600">Score</th>
                      <th className="px-6 py-4 font-semibold text-sm text-slate-600">Percentage</th>
                      <th className="px-6 py-4 font-semibold text-sm text-slate-600">Date Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => {
                      const percentage = Math.round((sub.score / sub.total) * 100);
                      return (
                        <tr key={sub._id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 text-slate-800 font-medium">{sub.userId?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{sub.userId?.emailOrRoll || '-'}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-700">{sub.score}</span>
                            <span className="text-slate-400 text-sm"> / {sub.total}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : percentage >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(sub.submissionTime).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
