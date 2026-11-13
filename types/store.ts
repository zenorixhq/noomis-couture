export type CurrencyCode = "INR" | "QAR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size / Color"
  sku: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  stockCount: number;
  options: { [key: string]: string }; // e.g. { size: "M", color: "Slate Blue" }
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number; // India price (₹ INR)
  salePrice?: number; // India sale price (₹ INR)
  priceQatar?: number; // Qatar price (QAR)
  salePriceQatar?: number; // Qatar sale price (QAR)
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  variants?: ProductVariant[];
  variantAttributes?: {
    name: string; // e.g., "Size", "Color"
    options: string[]; // e.g., ["S", "M", "L"]
    sizeStock?: Record<string, number>; // Maps specific size option to stock count (e.g. { "Size 10 (15.9 mm)": 1 })
  }[];
  specifications?: { [key: string]: string };
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
  inSignatureCouture?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  order?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number; // India price (₹ INR)
  priceQatar?: number; // Qatar price (QAR)
  image: string;
  quantity: number;
  stockCount?: number;
  selectedVariant?: {
    id: string;
    name: string;
    options: { [key: string]: string };
  };
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number; // percentage (e.g. 5 for 5%) or fixed amount
  minimumSpend?: number;
  description: string;
  firstPurchaseOnly?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  estimatedDays: string;
  price: number;
  freeAbove?: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: "card" | "cod" | "paypal" | "razorpay";
  trackingNumber?: string;
}
