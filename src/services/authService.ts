import axiosClient from "../core/http/axiosClient";
import publicAxios from "../core/http/publicAxios";
import { useAuthStore } from "@/src/app/store/authStore";

export const authService = {
  login: (data: { email: string; password: string }) =>
    publicAxios.post("/auth/login", data),

  refresh: (refreshToken: string) =>
    publicAxios.post("/auth/refresh", { refreshToken }),

  me: () => axiosClient.get("/auth/me"),

  logout: () => {
    const refreshToken = useAuthStore.getState().refreshToken;

    return axiosClient.post("/auth/logout", {
      refreshToken,
    });
  },
};
