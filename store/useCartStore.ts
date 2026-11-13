import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Coupon } from "@/types/store";
import { storeConfig } from "@/config/store.config";

interface CartStore {
  items: CartItem[];
  wishlist: string[]; // product IDs
  selectedCurrency: string;
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  quickViewProduct: Product | null;

  // Cart actions
  addItem: (product: Product, quantity?: number, selectedVariant?: CartItem["selectedVariant"]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Currency & Coupon & Shipping
  setCurrency: (code: string) => void;
  shippingState: string;
  setShippingState: (state: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isFirstPurchaseCustomer: (phone?: string) => boolean;
  autoCheckAndApplyFirstPurchaseDiscount: (phone?: string) => void;
  markCustomerAsPurchased: (phone?: string) => void;

  // Quick View
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Computed helpers (India INR)
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: (state?: string) => number;
  getTaxAmount: () => number;
  getTotal: (state?: string) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      selectedCurrency: "INR",
      shippingState: "Kerala",
      setShippingState: (state) => set({ shippingState: state }),
      appliedCoupon: null,
      isCartOpen: false,
      quickViewProduct: null,

      addItem: (product, quantity = 1, selectedVariant) => {
        const currentItems = get().items;
        const hasOptions =
          selectedVariant &&
          selectedVariant.options &&
          Object.keys(selectedVariant.options).length > 0;
        const normalizedVariant = hasOptions ? selectedVariant : undefined;
        const variantKey = normalizedVariant?.id || "standard";
        const itemIdentifier = `${product.id}-${variantKey}`;

        const existingIndex = currentItems.findIndex(
          (item) => item.id === itemIdentifier
        );

        const indiaPrice = product.salePrice || product.price;
        const availableStock =
          product.inStock !== false ? (product.stockCount !== undefined ? product.stockCount : 10) : 0;
        if (availableStock <= 0) {
          return;
        }

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity = Math.min(availableStock, updated[existingIndex].quantity + quantity);
          updated[existingIndex].stockCount = availableStock;
          set({ items: updated, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            id: itemIdentifier,
            productId: product.id,
            title: product.title,
            slug: product.slug,
            price: indiaPrice,
            image: normalizedVariant?.image || product.images[0],
            quantity: Math.min(availableStock, quantity),
            stockCount: availableStock,
            selectedVariant: normalizedVariant,
          };
          set({ items: [...currentItems, newItem], isCartOpen: true });
        }

        // Auto-check 1st purchase 5% discount
        setTimeout(() => {
          get().autoCheckAndApplyFirstPurchaseDiscount();
        }, 0);
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) => {
            if (item.id !== itemId) return item;
            const maxStock = item.stockCount !== undefined ? item.stockCount : 99;
            return { ...item, quantity: Math.min(maxStock, quantity) };
          }),
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      toggleWishlist: (productId) => {
        const clean = (productId || "").toString().trim();
        if (!clean) return;
        const current = get().wishlist;
        const exists = current.some((id) => id.toLowerCase() === clean.toLowerCase());
        if (exists) {
          set({ wishlist: current.filter((id) => id.toLowerCase() !== clean.toLowerCase()) });
        } else {
          set({ wishlist: [...current, clean] });
        }
      },

      isInWishlist: (productId) => {
        const clean = (productId || "").toString().trim().toLowerCase();
        return get().wishlist.some((id) => id.toLowerCase() === clean);
      },

      setCurrency: (code) => {
        set({ selectedCurrency: "INR" });
      },

      // Check whether customer is a first-time buyer
      isFirstPurchaseCustomer: (phone?: string) => {
        if (typeof window === "undefined") return true;
        try {
          if (localStorage.getItem("noomis_has_purchased") === "true") {
            return false;
          }
          const placedOrdersStr = localStorage.getItem("noomis_placed_orders");
          if (placedOrdersStr) {
            const placed = JSON.parse(placedOrdersStr);
            if (Array.isArray(placed) && placed.length > 0) {
              return false;
            }
          }
          const savedPhone = localStorage.getItem("noomis_customer_phone");
          if (savedPhone) {
            return false;
          }
          if (phone) {
            const clean = phone.replace(/[^0-9]/g, "");
            if (clean.length >= 7 && placedOrdersStr) {
              const placed = JSON.parse(placedOrdersStr || "[]");
              if (
                placed.some((o: any) =>
                  (o.phone || o.customerPhone || o.customer?.phone || "")
                    .replace(/[^0-9]/g, "")
                    .includes(clean.slice(-8))
                )
              ) {
                return false;
              }
            }
          }
          return true;
        } catch {
          return true;
        }
      },

      // Automatically apply 5% discount for 1st purchase; enforce normal rates on repeat orders
      autoCheckAndApplyFirstPurchaseDiscount: (phone?: string) => {
        const isFirst = get().isFirstPurchaseCustomer(phone);
        const currentCoupon = get().appliedCoupon;
        if (!isFirst) {
          // Returning customer -> enforce normal rates
          if (currentCoupon?.firstPurchaseOnly) {
            set({ appliedCoupon: null });
          }
        } else {
          // First purchase customer -> automatically apply the 5% first purchase discount
          if (!currentCoupon && get().items.length > 0) {
            const defaultCoupon = storeConfig.commerce.activeCoupons.find((c) => c.code === "NOOMI5") || {
              code: "NOOMI5",
              discountType: "percentage" as const,
              amount: 5,
              firstPurchaseOnly: true,
              description: "5% off your 1st purchase (new customer special)",
            };
            set({ appliedCoupon: defaultCoupon });
          }
        }
      },

      markCustomerAsPurchased: (phone?: string) => {
        if (typeof window === "undefined") return;
        try {
          localStorage.setItem("noomis_has_purchased", "true");
          if (phone) {
            localStorage.setItem("noomis_customer_phone", phone);
          }
          set({ appliedCoupon: null });
        } catch (e) {
          console.error("Failed to mark customer as purchased:", e);
        }
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = storeConfig.commerce.activeCoupons.find(
          (c) => c.code.toUpperCase() === cleanCode
        );

        if (!found) {
          return {
            success: false,
            message: "Invalid promo code. Use NOOMI5 for 5% off your 1st purchase.",
          };
        }

        // Strict verification: only 1st purchase per customer
        if (found.firstPurchaseOnly && !get().isFirstPurchaseCustomer()) {
          set({ appliedCoupon: null });
          return {
            success: false,
            message: "The 5% first-purchase offer was already redeemed on an earlier order. Standard normal rates apply.",
          };
        }

        const subtotal = get().getSubtotal();
        if (found.minSpend && subtotal < found.minSpend) {
          return {
            success: false,
            message: `Requires minimum spend of ₹${found.minSpend}. Current subtotal is ₹${subtotal.toFixed(2)}.`,
          };
        }

        set({ appliedCoupon: found });
        return {
          success: true,
          message: `${found.amount}% discount applied successfully!`,
        };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),

      // All amounts in INR (₹)
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        const subtotal = get().getSubtotal();
        if (!coupon || subtotal === 0) return 0;

        // Strict rule: Only 1st purchase per customer receives 5% discount
        if (coupon.firstPurchaseOnly && !get().isFirstPurchaseCustomer()) {
          return 0;
        }

        if (coupon.discountType === "percentage") {
          const safePercent = Math.min(coupon.amount, 10);
          return Math.round((subtotal * safePercent) / 100);
        }
        return 0;
      },

      getShippingFee: (state?: string) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const threshold = storeConfig.commerce.freeShippingThreshold || 999;
        if (subtotal >= threshold) return 0;
        const currentState = (state || get().shippingState || "Kerala").trim().toLowerCase();
        if (currentState === "kerala") {
          return storeConfig.commerce.shippingRates?.kerala ?? 50;
        }
        return storeConfig.commerce.shippingRates?.outsideKerala ?? 70;
      },

      getTaxAmount: () => {
        return 0; // Tax inclusive pricing
      },

      getTotal: (state?: string) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee(state);
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "noomis-cart-storage",
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        selectedCurrency: state.selectedCurrency,
        appliedCoupon: state.appliedCoupon,
        shippingState: state.shippingState,
      }),
    }
  )
);
