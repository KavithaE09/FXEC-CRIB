import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import Snowflake from '../components/common/Snowflake';
import ChristmasLights from '../components/common/ChristmasLights';
import DepartmentSelector from '../components/evaluation/DepartmentSelector';
import GuidelinesBox from '../components/evaluation/GuidelinesBox';
import CriteriaInput from '../components/evaluation/CriteriaInput';
import { CRITERIA } from '../utils/constants';
import { getCurrentUser, logout } from '../services/authService';
import { submitEvaluation, getAvailableDepartments } from '../services/evaluationService';

const EvaluatorPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [marks, setMarks] = useState({
    socialRelevance: '',
    creativity: '',
    naturalElements: '',
    nonVerbal: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await getAvailableDepartments();
      setDepartments(response.departments);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const calculateTotal = () => {
    return Object.values(marks).reduce(
      (sum, mark) => sum + (parseFloat(mark) || 0), 
      0
    );
  };

  const handleSubmit = async () => {
    if (!selectedDept) {
      setError('Please select a department');
      return;
    }

    if (!marks.socialRelevance || !marks.creativity || !marks.naturalElements || !marks.nonVerbal) {
      setError('Please fill in all marks');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitEvaluation({
        departmentCode: selectedDept,
        socialRelevance: parseFloat(marks.socialRelevance),
        creativity: parseFloat(marks.creativity),
        naturalElements: parseFloat(marks.naturalElements),
        nonVerbal: parseFloat(marks.nonVerbal)
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        loadDepartments();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit evaluation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDept('');
    setMarks({
      socialRelevance: '',
      creativity: '',
      naturalElements: '',
      nonVerbal: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Home
          </button>

          <div className="text-white text-right">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm">Evaluator {user?.evaluatorNumber}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Main container */}
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200">

            <h2 className="text-3xl md:text-4xl font-bold text-red-700 text-center mb-6">
              🎅 Evaluation Form 🎅
            </h2>

            <GuidelinesBox />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">

              <DepartmentSelector
                departments={departments}
                selectedDept={selectedDept}
                onSelect={setSelectedDept}
                disabled={loading}
              />

              {CRITERIA.map(criterion => (
                <CriteriaInput
                  key={criterion.name}
                  criterion={criterion}
                  value={marks[criterion.name]}
                  onChange={(value) =>
                    setMarks({ ...marks, [criterion.name]: value })
                  }
                  disabled={loading}
                />
              ))}

              <div className="bg-yellow-50 border-2 border-yellow-600 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Marks:</span>
                  <span className="text-3xl font-bold text-red-600">
                    {calculateTotal()} / 50
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  ⚠️ <strong>Important:</strong> Once you submit, you cannot edit this evaluation later!
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Evaluation 🎁'}
                </button>

                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg text-lg font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  Reset Form
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600">Evaluation Submitted!</h3>
            <p className="text-gray-600 mt-2">This evaluation is now locked.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default EvaluatorPage;
