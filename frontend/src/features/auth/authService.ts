import api from "../../services/api"

import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "./authTypes.ts";


export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<User>>(
    "/auth/login",
    data
  );

  return response.data;
};

export const registerUser = async (data: RegisterRequest) => {

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("bio", data.bio);
    formData.append("role", data.role);

    if (data.avatar) {
        formData.append("avatar", data.avatar);
    }

    const response = await api.post<ApiResponse<User>>(
        "/auth/register",
        formData
    );

    return response.data;
};



export const logoutUser = async () => {
  const response = await api.get<ApiResponse<null>>("/auth/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<ApiResponse<User>>("/auth/me");

  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get<ApiResponse<User[]>>("/auth/users");

  return response.data;
};

