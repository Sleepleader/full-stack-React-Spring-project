import request from '../utils/request';
import type { ApiResponse, OrderData, OrderItemData } from '../types';

export const checkout = (cartItemIds: number[]) => {
  return request.post<ApiResponse<OrderData>>('/api/order/checkout', { cartItemIds });
};

export const getUserOrders = () => {
  return request.get<ApiResponse<OrderData[]>>('/api/order/list');
};

export const getOrderItems = (orderId: number) => {
  return request.get<ApiResponse<OrderItemData[]>>(`/api/order/${orderId}/items`);
};
