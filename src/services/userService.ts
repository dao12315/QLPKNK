import axiosClient from "@/src/core/http/axiosClient";
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserFilter,
} from "@/src/types/user";
import { PaginatedResponse } from "@/src/types/common";

export const userService = {
  getAll: (params?: UserFilter) =>
    axiosClient.get<PaginatedResponse<UserDto>>("/users", { params }),

  getById: (id: string) => axiosClient.get<UserDto>(`/users/${id}`),

  create: (data: CreateUserDto) =>
    axiosClient.post<UserDto>("/users/create", data),

  update: (id: string, data: UpdateUserDto) =>
    axiosClient.put<UserDto>(`/users/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/users/${id}`),

  changePassword: (data: ChangePasswordDto) =>
    axiosClient.post("/users/change-password", data),
};
