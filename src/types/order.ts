// src/types/order.ts
export interface Order {
    id: string;
    _id?: string;
    user_name: string;
    user_email: string;
    user_phone?: string;
    status: OrderStatus;
    total: number;
    payment_method: string;
    delivery_partner_name?: string;
    created_at: string;
    items: OrderItem[];
    delivery_address?: Address;
  }
  
  export type OrderStatus = 
    | 'preparing' 
    | 'accepted' 
    | 'assigned' 
    | 'out_for_delivery' 
    | 'delivered' 
    | 'cancelled';
  
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