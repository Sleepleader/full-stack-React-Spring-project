import request from '../utils/request';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Admin login
export const adminLogin = (data: { username: string; password: string }) =>
  request.post<ApiResponse<{ role: string; username: string }>>('/api/admin/login', data);

// ===== Product Management =====
export const getAdminProducts = () =>
  request.get<ApiResponse<any[]>>('/api/admin/products');

export const addAdminProduct = (data: any) =>
  request.post<ApiResponse>('/api/admin/products', data);

export const updateAdminProduct = (id: number, data: any) =>
  request.put<ApiResponse>(`/api/admin/products/${id}`, data);

export const deleteAdminProduct = (id: number) =>
  request.delete<ApiResponse>(`/api/admin/products/${id}`);

// ===== User Management =====
export const getAdminUsers = () =>
  request.get<ApiResponse<any[]>>('/api/admin/users');

export const addAdminUser = (data: any) =>
  request.post<ApiResponse>('/api/admin/users', data);

export const deleteAdminUser = (id: number) =>
  request.delete<ApiResponse>(`/api/admin/users/${id}`);

// ===== Order Management =====
export const getAdminOrders = () =>
  request.get<ApiResponse<any[]>>('/api/admin/orders');

export const getAdminOrderItems = (orderId: number) =>
  request.get<ApiResponse<any[]>>(`/api/admin/orders/${orderId}/items`);

export const deleteAdminOrder = (orderId: number) =>
  request.delete<ApiResponse>(`/api/admin/orders/${orderId}`);
