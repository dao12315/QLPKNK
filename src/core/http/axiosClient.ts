import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/src/app/store/authStore";
import { authService } from "@/src/services/authService";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  console.log("📤 REQUEST:", {
    url: config.url,
    method: config.method,
    hasToken: !!token,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
axiosClient.interceptors.response.use(
  (res) => {
    console.log("✅ RESPONSE:", {
      url: res.config.url,
      status: res.status,
    });
    return res;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.log("❌ RESPONSE ERROR:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
    });

    // ================= NOT 401 =================
    if (error.response?.status !== 401 || originalRequest._retry) {
      console.log("⛔ NOT 401 OR ALREADY RETRIED → REJECT");
      return Promise.reject(error);
    }

    console.log("🔴 401 DETECTED → START REFRESH FLOW");

    originalRequest._retry = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      console.log("🚫 NO REFRESH TOKEN → LOGOUT");
      logout();
      return Promise.reject(error);
    }

    // ================= QUEUE =================
    if (isRefreshing) {
      console.log("⏳ ALREADY REFRESHING → ADD TO QUEUE:", originalRequest.url);

      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          console.log("🔁 RETRY FROM QUEUE:", originalRequest.url);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    console.log("🟡 CALL REFRESH API...");
    console.log("🟡 REFRESH TOKEN:", refreshToken);

    try {
      const res = await authService.refresh(refreshToken);

      console.log("🟢 REFRESH SUCCESS:", res.data);

      const newAccessToken = res.data.accessToken;

      setTokens(newAccessToken, refreshToken);

      console.log("🟢 STORE UPDATED WITH NEW TOKEN");

      // retry queue
      refreshQueue.forEach((cb) => cb(newAccessToken));
      console.log("🟢 QUEUE CLEARED:", refreshQueue.length);

      refreshQueue = [];

      // retry current request
      console.log("🔁 RETRY ORIGINAL REQUEST:", originalRequest.url);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (err: any) {
      console.log("❌ REFRESH FAILED → LOGOUT");
      console.log("❌ ERROR:", err.response?.data || err.message);

      refreshQueue = [];
      logout();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
      console.log("🔵 REFRESH FLOW END");
    }
  },
);

export default axiosClient;
