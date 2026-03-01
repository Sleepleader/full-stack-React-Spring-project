import request from '../utils/request';
import type { ApiResponse } from '../types';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: number;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
}

// Get current user info
export const getUserInfo = () => {
  return request.get<ApiResponse<UserInfo>>('/api/user/info');
};

// Update current user info
export const updateUser = (data: UpdateUserRequest) => {
  return request.put<ApiResponse>('/api/user/update', data);
};
