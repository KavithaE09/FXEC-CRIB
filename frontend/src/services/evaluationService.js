import api from './api';

export const submitEvaluation = async (evaluationData) => {
  const response = await api.post('/evaluations/submit', evaluationData);
  return response.data;
};

export const getMyEvaluations = async () => {
  const response = await api.get('/evaluations/my-evaluations');
  return response.data;
};

export const getAvailableDepartments = async () => {
  const response = await api.get('/evaluations/departments');
  return response.data;
};

export const getFinalResults = async () => {
  const response = await api.get('/results/final');
  return response.data;
};

export const getAllEvaluations = async () => {
  const response = await api.get('/results/all-evaluations');
  return response.data;
};
