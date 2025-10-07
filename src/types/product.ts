// src/types/product.ts
export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    brand: string;
    status: 'active' | 'inactive';
    images: string[] | ImageObject[];
    keywords?: string[];
    description: string;
  }
  
  export interface ImageObject {
    url?: string;
    secure_url?: string;
    original?: string;
    thumbnail?: string;
  }