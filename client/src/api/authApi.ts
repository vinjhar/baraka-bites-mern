import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:7001/api/v1',
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const signin = (data) => API.post('/auth/signin', data);
export const resendVerification = (data) => API.post('/auth/resend-verification', data);
