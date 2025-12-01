export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: 'bread' | 'pastry' | 'other';
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    address: string;
    phone: string;
}

export type PaymentMethod = 'bizum' | 'transfer' | 'card';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    shippingCost: number;
    deliveryDate: string; // ISO Date
    paymentMethod: PaymentMethod;
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    isGuest: boolean;
}
