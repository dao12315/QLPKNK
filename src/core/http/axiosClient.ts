import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/src/app/store/authStore";
import publicAxios from "./publicAxios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let refreshQueue: QueueItem[] = [];

const processQueueSuccess = (token: string) => {
  console.log("✅ [QUEUE] Retry queued requests");
  refreshQueue.forEach((item) => item.resolve(token));
  refreshQueue = [];
};

const processQueueError = (error: unknown) => {
  console.log("❌ [QUEUE] Reject queued requests");
  refreshQueue.forEach((item) => item.reject(error));
  refreshQueue = [];
};

const isAuthEndpoint = (url?: string) => {
  return (
    url?.includes("/auth/login") ||
    url?.includes("/auth/refresh") ||
    url?.includes("/auth/logout")
  );
};

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    console.log("❌ [AXIOS ERROR]", {
      url: originalRequest?.url,
      status: error.response?.status,
      retry: originalRequest?._retry,
    });
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      console.log("⛔ [NO REFRESH]", {
        url: originalRequest.url,
        status: error.response?.status,
        retry: originalRequest._retry,
        isAuthEndpoint: isAuthEndpoint(originalRequest.url),
      });
      return Promise.reject(error);
    }

    console.log("🔴 [401] Token expired:", originalRequest.url);

    originalRequest._retry = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      console.log("🚫 [REFRESH] No refresh token");
      logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      console.log("⏳ [REFRESH] Waiting:", originalRequest.url);

      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axiosClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("🔄 [REFRESH] Start");

      const response = await publicAxios.post("/auth/refresh", {
        refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken ?? refreshToken;

      setTokens(newAccessToken, newRefreshToken);

      console.log("✅ [REFRESH] Success");

      processQueueSuccess(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      console.log("🔁 [RETRY] Original request:", originalRequest.url);

      return axiosClient(originalRequest);
    } catch (refreshError) {
      console.log("❌ [REFRESH] Failed");

      processQueueError(refreshError);
      logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      console.log("🏁 [REFRESH] End");
    }
  },
);

export default axiosClient;
