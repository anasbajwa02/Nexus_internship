import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  LoginRequest,
  RegisterRequest,
} from "./authTypes";


import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getAllUsers,
} from "./authService";


// register thunk
export const registerThunk = createAsyncThunk(
  "auth/register",

  async (
    data: RegisterRequest,
    { rejectWithValue }
  ) => {

    try {

      return await registerUser(data);

    } catch (error: any) {

      return rejectWithValue(
        error.response?.data?.data || "Registration failed"
      );

    }

  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",

  async (data: LoginRequest, thunkAPI) => {
    try {
      return await loginUser(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.data || "Login failed"
      );
    }
  }
);



// login thunk

export const meThunk = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      return await getCurrentUser();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.data || "Failed to get current user"
      );
    }
  }
);

// logout thunk 
export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            return await logoutUser();
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.data || "Logout failed"
            );
        }
    }
);