import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snowflake from '../components/common/Snowflake';
import { evaluatorLogin } from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [showEvaluatorLogin, setShowEvaluatorLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEvaluatorLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await evaluatorLogin(username, password);
      navigate('/evaluator');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const DarkBackground = () => (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.78)),
          url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1920&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        top: "120px",
      }}
    />
  );

  /* ---------------------- EVALUATOR LOGIN SCREEN --------------------- */

  if (showEvaluatorLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900 relative overflow-hidden">

        {/* Top Lights */}
        <div className="absolute top-0 left-0 right-0 h-3 z-20"
          style={{
            background: 'repeating-linear-gradient(90deg, #16a34a 0px, #16a34a 30px, #fbbf24 30px, #fbbf24 60px, #dc2626 60px, #dc2626 90px)',
            animation: 'lights 2s linear infinite'
          }}
        />

        {/* Header */}
        <div className="relative z-10 pt-3"
          style={{
            background: 'linear-gradient(to right, #991b1b, #92400e, #166534)',
            padding: '30px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h1 className="text-center text-white font-bold drop-shadow-2xl"
            style={{
              fontFamily: "'Mountains of Christmas', cursive",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              textShadow: '0 0 10px #ffd700'
            }}
          >
            🎄 Christmas Crib Competition 2025 🎄
          </h1>
          <h2 className="text-center text-white text-xl mt-2">Evaluation Portal</h2>
        </div>

        {/* Background */}
        <DarkBackground />

        {/* Snowflakes */}
        {[...Array(30)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.3} duration={10 + Math.random() * 10} left={Math.random() * 100} />
        ))}

        {/* Login Card (CLEAR WHITE BOX) */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">

            <div className="text-center mb-6">
              <div className="flex justify-center gap-5 text-4xl mb-4">
                🎁🎄⭐
              </div>

              <h2 className="text-3xl font-bold text-red-700">Welcome, Evaluator!</h2>
              <p className="text-gray-600 mt-3">Let's evaluate the Christmas cribs! 🏠</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-green-700 font-semibold mb-2 text-lg">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border-2 border-green-600 rounded-lg"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-green-700 font-semibold mb-2 text-lg">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border-2 border-green-600 rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              <button
                onClick={handleEvaluatorLogin}
                disabled={loading}
                className="w-full text-white py-3 rounded-lg text-lg font-bold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <button
                onClick={() => setShowEvaluatorLogin(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 w-full mt-10">
          <div className="w-full bg-gradient-to-r from-green-700 to-red-600 py-4 text-center text-white font-medium tracking-wide text-base flex items-center justify-center gap-2 backdrop-blur-md border-t border-white/20">

            <div className="absolute inset-0 pointer-events-none animate-snow opacity-30"></div>

            <span className="relative z-10 flex items-center gap-2 text-lg">
              🎅 Merry Christmas & Happy Evaluating! 🎁
            </span>
          </div>
        </div>

      </div>
    );
  }

  /* ---------------------- MAIN HOME SCREEN --------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900 relative overflow-hidden">

      {/* Lights */}
      <div
        className="absolute top-0 left-0 right-0 h-3 z-20"
        style={{
          background: 'repeating-linear-gradient(90deg, #16a34a 0px, #16a34a 30px, #fbbf24 30px, #fbbf24 60px, #dc2626 60px, #dc2626 90px)',
          animation: 'lights 2s linear infinite'
        }}
      />

      {/* Header */}
      <div className="relative z-10 pt-3"
        style={{
          background: 'linear-gradient(to right, #991b1b, #92400e, #166534)',
          padding: '30px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <h1 className="text-center text-white font-bold"
          style={{
            fontFamily: "'Mountains of Christmas', cursive",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            textShadow: '0 0 10px #ffd700'
          }}
        >
          🎄 Christmas Crib Competition 2025 🎄
        </h1>
        <h2 className="text-center text-white text-xl mt-2">Evaluation Portal</h2>
      </div>

      {/* Background */}
      <DarkBackground />

      {/* Snowflakes */}
      {[...Array(30)].map((_, i) => (
        <Snowflake key={i} delay={i * 0.3} duration={10 + Math.random() * 10} left={Math.random() * 100} />
      ))}

      {/* Main Card */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
          <div className="text-center w-full">

            <div className="flex justify-center gap-6 mb-6 text-5xl">
              🎁🎄⭐
            </div>

            <h2 className="text-4xl font-bold mb-4" style={{ color: '#b91c1c' }}>
              Welcome, Evaluator!
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Let's evaluate the Christmas cribs! 🏠
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setShowEvaluatorLogin(true)}
                className="w-full text-white py-4 rounded-2xl text-xl font-bold shadow-lg transition-all"
                style={{ background: '#b91c1c' }}
              >
                Evaluator Login 🔑
              </button>

              <button
                onClick={() => navigate('/admin-login')}
                className="w-full text-white py-4 rounded-2xl text-xl font-bold shadow-lg transition-all"
                style={{ background: '#16a34a' }}
              >
                Admin Login 🔐
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 w-full mt-10">
        <div className="w-full bg-gradient-to-r from-green-700 to-red-600 py-4 text-center text-white font-medium tracking-wide text-base flex items-center justify-center gap-2 backdrop-blur-md border-t border-white/20">

          <div className="absolute inset-0 pointer-events-none animate-snow opacity-30"></div>

          <span className="relative z-10 flex items-center gap-2 text-lg">
            🎅 Merry Christmas & Happy Evaluating! 🎁
          </span>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
