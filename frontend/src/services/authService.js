import api from './api';

export const evaluatorLogin = async (username, password) => {
  const response = await api.post('/auth/evaluator/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('role', 'evaluator');
  }
  return response.data;
};

export const adminLogin = async (username, password) => {
  const response = await api.post('/auth/admin/login', { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('role', 'admin');
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};