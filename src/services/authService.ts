import axiosClient from "../core/http/axiosClient";

export const authService = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post("/auth/login", data),

  refresh: (refreshToken: string) =>
    axiosClient.post("/auth/refresh", { refreshToken }),

  logout: () => axiosClient.post("/auth/logout"),
};
