import axios from 'axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// export const authAPI = axios.create({ baseURL: 'http://localhost:8000' });
export const authAPI = axios.create({ baseURL: 'https://fairgig-auth-5mtg.onrender.com' });
// export const earningsAPI = axios.create({ baseURL: 'http://localhost:8001' });
export const earningsAPI = axios.create({ baseURL: 'https://fairgig-earnings-hqyc.onrender.com' });
//export const anomalyAPI = axios.create({ baseURL: 'http://localhost:8002' });
export const anomalyAPI = axios.create({ baseURL: 'https://fairgig-anamoly.onrender.com' });
// export const grievanceAPI = axios.create({ baseURL: 'http://localhost:3001' });
 export const grievanceAPI = axios.create({ baseURL: 'https://fairgig-grievances.onrender.com' });
// export const analyticsAPI = axios.create({ baseURL: 'http://localhost:8003' });
export const analyticsAPI = axios.create({ baseURL: 'https://fairgig-analytics-eeah.onrender.com' });
// const certificateAPI = axios.create({ baseURL: 'http://localhost:8004' });
export const certificateAPI = axios.create({ baseURL: 'https://fairgig-certificate-of1w.onrender.com' });

// Add auth header to all protected APIs
[earningsAPI, anomalyAPI, analyticsAPI, certificateAPI, grievanceAPI].forEach(api => {
  api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  });
});