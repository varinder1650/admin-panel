export type OrderStatus = 
  | 'preparing' 
  | 'accepted' 
  | 'assigned' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  product_image?: string[];
}

export interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  _id?: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  status: OrderStatus;
  order_status?: OrderStatus; // Fallback
  total: number;
  total_amount?: number; // Fallback
  payment_method: string;
  payment_status?: string;
  delivery_partner_name?: string;
  delivery_partner_id?: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
  delivery_address?: Address;
}

export interface OrderFilters {
  status: string;
  date_range: string;
  from_date: string;
  to_date: string;
  delivery_partner: string;
  min_amount: string;
  max_amount: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}