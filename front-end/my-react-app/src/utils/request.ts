import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types';

// Create axios instance
const request = axios.create({
  baseURL: 'http://localhost:9527',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach Token
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 expiration
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expired, clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(new Error('登录已过期，请重新登录'));
        case 403:
          return Promise.reject(new Error('没有权限访问该资源'));
        case 404:
          return Promise.reject(new Error('请求的资源不存在'));
        case 500:
          return Promise.reject(
            new Error(data?.message || '服务器内部错误，请稍后重试')
          );
        default:
          return Promise.reject(
            new Error(data?.message || `请求失败 (${status})`)
          );
      }
    } else if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请检查网络连接'));
    } else if (!error.response) {
      return Promise.reject(new Error('网络连接失败，请检查网络设置'));
    }

    return Promise.reject(error);
  }
);

export default request;
