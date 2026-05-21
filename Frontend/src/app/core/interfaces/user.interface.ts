// src/app/core/interfaces/user.interface.ts
// Ensure your User interface matches your Mongoose model [cite: 123, 125]
export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
  isActive: boolean; // This MUST be added
  emailConsent?: boolean;
}

export interface Address {
  label: 'home' | 'work' | 'other';
  addressText: string;
  isDefault?: boolean;
}

// src/app/core/interfaces/product.interface.ts
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  categoryId?: number;
  subCategoryId?: number[];
  isDeleted: boolean;
  isActive: boolean;
}

// src/app/core/interfaces/order.interface.ts
export interface Order {
  _id?: string;
  userId: string;
  addressId: string;
  phoneNumber: number;
  totalPrice: number;
  status:
    | 'pending'
    | 'preparing'
    | 'shipped'
    | 'cancelledByUser'
    | 'cancelledByAdmin'
    | 'refused'
    | 'received';
  products: OrderProduct[];
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
