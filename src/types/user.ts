export type UserRole = 'admin' | 'customer' | 'delivery_partner' | 'vendor';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  joined_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  token: string;
}