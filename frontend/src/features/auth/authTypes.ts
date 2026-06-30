export type UserRole = "investor" | "entrepreneur";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  isProfileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authChecked : boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}


// request interfaces 
export interface LoginRequest {
  email: string;
  password: string;
}



export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  avatar: File | null;

}