import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/src/app/store/authStore';
import { isTokenExpiringSoon } from '@/src/shared/utils/jwt';

// ================= BASE =================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const axiosRefresh = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ================= REFRESH CONTROL =================
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};

// ================= REQUEST =================
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      // 🔥 Silent refresh trước khi request
      if (isTokenExpiringSoon(accessToken) && !isRefreshing) {
        try {
          await refreshTokenFlow();
        } catch {
          // nếu fail thì interceptor response xử lý
        }
      }

      config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const isRefreshCall = originalRequest.url?.includes('/auth/refresh');

    // ================= HANDLE 401 =================
    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 🔥 queue request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshTokenFlow();

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ================= REFRESH FUNCTION =================
const refreshTokenFlow = async (): Promise<string> => {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    throw new Error('No refresh token');
  }

  try {
    const res = await axiosRefresh.post('/auth/refresh', {
      refreshToken,
    });

    const newAccessToken = res.data.accessToken;
    const newRefreshToken = res.data.refreshToken;

    setTokens(newAccessToken, newRefreshToken);

    return newAccessToken;
  } catch (err) {
    logout();
    throw err;
  }
};

export default axiosClient;