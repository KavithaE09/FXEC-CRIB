import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Snowflake from '../components/common/Snowflake';
import ChristmasLights from '../components/common/ChristmasLights';
import { adminLogin } from '../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminLogin(username, password);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-900 relative overflow-hidden">
      <ChristmasLights />
      {[...Array(30)].map((_, i) => (
        <Snowflake
          key={i}
          delay={i * 0.3}
          duration={10 + Math.random() * 10}
          left={Math.random() * 100}
        />
      ))}

      <div className="relative z-10 p-4">
        <button
          onClick={() => navigate('/')}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Home
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 -mt-20">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-700 text-center mb-6">
            🏆 Admin Login 🏆
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;