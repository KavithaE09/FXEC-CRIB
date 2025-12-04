import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EvaluatorPage from './pages/EvaluatorPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ResultsPage from './pages/ResultsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/evaluator" 
          element={
            <ProtectedRoute requiredRole="evaluator">
              <EvaluatorPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ResultsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;