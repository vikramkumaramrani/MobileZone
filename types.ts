
export type Category = 'Mobiles' | 'Cables' | 'Earbuds' | 'Accessories' | 'Mobile Parts';
export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';
export type UserRole = 'admin' | 'user';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number; // Slashed price
  stock: number;
  image: string;
  hoverImage?: string; // Secondary image shown on hover
  reviews?: Review[];
  isHot?: boolean; // For "Hot Deal" styling
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password?: string;
  role: UserRole;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  discountAmount?: number;
  discountCode?: string;
  status: OrderStatus;
  date: string;
  customerName: string;
  phone: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}
