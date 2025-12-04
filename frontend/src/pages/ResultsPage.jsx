// ============================================================================
// frontend/src/pages/ResultsPage.jsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, Award, TrendingUp } from 'lucide-react';
import Snowflake from '../components/common/Snowflake';
import ChristmasLights from '../components/common/ChristmasLights';
import { getCurrentUser, logout } from '../services/authService';
import { getFinalResults, getAllEvaluations } from '../services/evaluationService';

const ResultsPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [results, setResults] = useState([]);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('final'); // 'final' or 'detailed'

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const [finalRes, detailedRes] = await Promise.all([
        getFinalResults(),
        getAllEvaluations()
      ]);
      setResults(finalRes.results || []);
      setAllEvaluations(detailedRes.evaluations || []);
    } catch (err) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMedalEmoji = (medal) => {
    if (medal === 'gold') return '🥇';
    if (medal === 'silver') return '🥈';
    if (medal === 'bronze') return '🥉';
    return '';
  };

  const getMedalColor = (medal) => {
    if (medal === 'gold') return 'from-yellow-400 to-yellow-600';
    if (medal === 'silver') return 'from-gray-300 to-gray-500';
    if (medal === 'bronze') return 'from-orange-400 to-orange-600';
    return 'from-gray-100 to-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading results... 🎄</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900 relative overflow-hidden">
      <ChristmasLights />
      {[...Array(20)].map((_, i) => (
        <Snowflake
          key={i}
          delay={i * 0.5}
          duration={15 + Math.random() * 5}
          left={Math.random() * 100}
        />
      ))}

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <div className="text-white text-center">
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* View Toggle */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setView('final')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                view === 'final'
                  ? 'bg-white text-red-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Final Results
            </button>
            <button
              onClick={() => setView('detailed')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                view === 'detailed'
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Detailed View
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 md:p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {view === 'final' ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-red-700 text-center mb-8">
                  🏆 Final Results Dashboard 🏆
                </h2>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">
                      No complete results yet. Waiting for all evaluators to finish.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Top 3 Winners */}
                    {results.slice(0, 3).length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-center text-green-700 mb-4">
                          ⭐ Top 3 Winners ⭐
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {results.slice(0, 3).map((result) => (
                            <div
                              key={result.dept_code}
                              className={`bg-gradient-to-br ${getMedalColor(result.medal)} p-6 rounded-xl text-center transform hover:scale-105 transition-all shadow-lg`}
                            >
                              <Award className="w-12 h-12 mx-auto mb-2 text-white" />
                              <div className="text-5xl mb-3">
                                {getMedalEmoji(result.medal)}
                              </div>
                              <h4 className="text-xl font-bold text-white mb-1">
                                {result.dept_name}
                              </h4>
                              <p className="text-sm text-white/90 mb-2">{result.dept_code}</p>
                              <div className="bg-white/30 backdrop-blur rounded-lg p-3">
                                <p className="text-3xl font-bold text-white">
                                  {result.total_marks} / 100
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete Results Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-red-600 text-white">
                            <th className="p-3 text-left rounded-tl-lg">Rank</th>
                            <th className="p-3 text-left">Department Code</th>
                            <th className="p-3 text-left">Department Name</th>
                            <th className="p-3 text-center">Total Marks</th>
                            <th className="p-3 text-center rounded-tr-lg">Individual Scores</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result) => (
                            <tr
                              key={result.dept_code}
                              className={`border-b border-gray-200 ${
                                result.rank <= 3
                                  ? 'bg-green-50 font-semibold'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="p-3">
                                {result.rank} {getMedalEmoji(result.medal)}
                              </td>
                              <td className="p-3 font-semibold">{result.dept_code}</td>
                              <td className="p-3">{result.dept_name}</td>
                              <td className="p-3 text-center">
                                <span className="text-xl font-bold text-red-600">
                                  {result.total_marks}
                                </span>
                                <span className="text-gray-500"> / 100</span>
                              </td>
                              <td className="p-3 text-center text-sm">
                                {result.individual_marks?.split(',').map((mark, idx) => (
                                  <span key={idx} className="inline-block mx-1 bg-blue-100 px-2 py-1 rounded">
                                    {mark}
                                  </span>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-8">
                  📊 Detailed Evaluations 📊
                </h2>

                {allEvaluations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No evaluations submitted yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-green-600 text-white">
                          <th className="p-2 text-left rounded-tl-lg">Dept</th>
                          <th className="p-2 text-center">Evaluator</th>
                          <th className="p-2 text-center">Social (15)</th>
                          <th className="p-2 text-center">Creative (15)</th>
                          <th className="p-2 text-center">Natural (10)</th>
                          <th className="p-2 text-center">NonVerbal (10)</th>
                          <th className="p-2 text-center">Total (50)</th>
                          <th className="p-2 text-center rounded-tr-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allEvaluations.map((evaluation) => (
                          <tr key={evaluation.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-2 font-semibold">{evaluation.dept_code}</td>
                            <td className="p-2 text-center">
                              <span className="bg-purple-100 px-2 py-1 rounded text-xs">
                                Eval {evaluation.evaluator_number}
                              </span>
                            </td>
                            <td className="p-2 text-center">{evaluation.social_relevance}</td>
                            <td className="p-2 text-center">{evaluation.creativity}</td>
                            <td className="p-2 text-center">{evaluation.natural_elements}</td>
                            <td className="p-2 text-center">{evaluation.non_verbal}</td>
                            <td className="p-2 text-center font-bold text-red-600">
                              {evaluation.total_marks}
                            </td>
                            <td className="p-2 text-center">
                              {evaluation.is_locked ? (
                                <span className="text-green-600">🔒 Locked</span>
                              ) : (
                                <span className="text-yellow-600">🔓 Unlocked</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;