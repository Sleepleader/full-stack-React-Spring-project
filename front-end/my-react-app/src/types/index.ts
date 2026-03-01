// API Response types
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// Login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Register
export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

// Form validation errors
export interface RegisterFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  phone?: string;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

// Shopping Cart
export interface CartRequest {
  productName: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl: string;
}

// Cart item from backend
export interface CartItemData {
  id: number;
  userId: number;
  productName: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl: string;
  createTime: string;
  updateTime: string;
}

// Product
export interface ProductData {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  createTime: string;
  updateTime: string;
}

// Order
export interface OrderData {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createTime: string;
}

// Order Item
export interface OrderItemData {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
