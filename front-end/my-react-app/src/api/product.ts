import request from '../utils/request';
import type { ApiResponse, ProductData } from '../types';

export const getProductsByCategory = (category: string) => {
  return request.get<ApiResponse<ProductData[]>>(`/api/product/category/${category}`);
};

export const getProductById = (id: number) => {
  return request.get<ApiResponse<ProductData>>(`/api/product/${id}`);
};

export const searchProducts = (keyword: string) => {
  return request.get<ApiResponse<ProductData[]>>('/api/product/search', { params: { keyword } });
};
