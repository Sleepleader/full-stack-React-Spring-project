import request from '../utils/request';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types';

// User login
export const login = (data: LoginRequest) => {
  return request.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
};

// User register
export const register = (data: RegisterRequest) => {
  return request.post<ApiResponse>('/api/user/register', data);
};
