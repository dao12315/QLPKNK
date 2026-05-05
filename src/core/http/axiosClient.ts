import axios from 'axios';
import { useAuthStore } from '@/src/app/store/authStore';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        // In a real app, call your refresh token endpoint
        // const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        // useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
        
        // return axiosClient(originalRequest);
        
        // For demo: logout on refresh failure
        useAuthStore.getState().logout();
        return Promise.reject(error);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
