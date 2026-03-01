import request from '../utils/request';
import type { ApiResponse, CartRequest, CartItemData } from '../types';

export const addToCart = (data: CartRequest) => {
  return request.post<ApiResponse>('/api/cart/add', data);
};

export const getCartItems = () => {
  return request.get<ApiResponse<CartItemData[]>>('/api/cart/list');
};

export const updateCartItemQuantity = (id: number, quantity: number) => {
  return request.put<ApiResponse>(`/api/cart/update/${id}`, { quantity });
};

export const deleteCartItem = (id: number) => {
  return request.delete<ApiResponse>(`/api/cart/delete/${id}`);
};
