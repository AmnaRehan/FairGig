import axios from 'axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const authAPI = axios.create({ baseURL: 'http://localhost:8000' });
export const earningsAPI = axios.create({ baseURL: 'http://localhost:8001' });
export const anomalyAPI = axios.create({ baseURL: 'http://localhost:8002' });
export const grievanceAPI = axios.create({ baseURL: 'http://localhost:3001' });
export const analyticsAPI = axios.create({ baseURL: 'http://localhost:8003' });
export const certificateAPI = axios.create({ baseURL: 'http://localhost:8004' });

// Add auth header to all protected APIs
[earningsAPI, anomalyAPI, analyticsAPI, certificateAPI, grievanceAPI].forEach(api => {
  api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  });
});