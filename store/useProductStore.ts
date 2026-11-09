import { create } from "zustand";
import { Product } from "@/types/store";
import { products as fallbackProducts } from "@/data/mockData";

const STORAGE_KEY = "noomis_catalog_live_v8";

// Auto-purge obsolete and legacy catalog cache keys from previous versions
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("noomis_products_catalog");
    localStorage.removeItem("noomis_products_catalog_v2");
    localStorage.removeItem("noomis_products_catalog_v3");
    localStorage.removeItem("noomis_catalog_live_v4");
    localStorage.removeItem("noomis_catalog_live_v5");
    localStorage.removeItem("noomis_catalog_live_v6");
    localStorage.removeItem("noomis_catalog_live_v7");
    sessionStorage.removeItem("noomis_products_catalog");
    sessionStorage.removeItem("noomis_products_catalog_v2");
    sessionStorage.removeItem("noomis_products_catalog_v3");
    sessionStorage.removeItem("noomis_catalog_live_v4");
    sessionStorage.removeItem("noomis_catalog_live_v5");
    sessionStorage.removeItem("noomis_catalog_live_v6");
    sessionStorage.removeItem("noomis_catalog_live_v7");
  } catch (e) {}
}

function getInitialProducts(): { products: Product[]; hasLoaded: boolean } {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify cache does NOT contain stale template products
          const isStale = parsed.some(
            (p: any) =>
              p.slug === "imperial-emerald-cuban-pendant" ||
              p.title === "Statement Ring" ||
              p.slug === "statement-ring" ||
              p.title === "Imperial Emerald & Gold Cuban Pendant"
          );
          if (!isStale) {
            return { products: parsed, hasLoaded: true };
          }
          localStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      // Ignore if storage error
    }
  }
  return { products: fallbackProducts, hasLoaded: true };
}

function persistProducts(prods: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
    } catch (e) {}
  }
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;

  // Actions
  fetchProducts: (forceFresh?: boolean) => Promise<void>;
  addProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, updateData: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
}

const initial = getInitialProducts();

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initial.products,
  isLoading: !initial.hasLoaded,
  hasLoaded: initial.hasLoaded,
  error: null,

  fetchProducts: async (forceFresh = false) => {
    try {
      const currentProducts = get().products;
      if (!currentProducts || currentProducts.length === 0) {
        set({ isLoading: true });
      }

      const url = forceFresh ? "/api/products?fresh=true" : "/api/products";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        set({ products: data, hasLoaded: true, isLoading: false, error: null });
        persistProducts(data);
      } else {
        if (get().products.length === 0) {
          set({ products: fallbackProducts, hasLoaded: true, isLoading: false });
        } else {
          set({ hasLoaded: true, isLoading: false });
        }
      }
    } catch (err: any) {
      console.error("fetchProducts error:", err);
      if (get().products.length === 0) {
        set({ products: fallbackProducts, hasLoaded: true, isLoading: false });
      } else {
        set({ error: err.message, isLoading: false, hasLoaded: true });
      }
    }
  },

  addProduct: async (productData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create product");
      }

      const createdProduct = await res.json();
      const updatedProducts = [createdProduct, ...get().products.filter((p) => p.id !== createdProduct.id)];
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return createdProduct;
    } catch (err: any) {
      console.error("addProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id: string, updateData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update product");
      }

      const updated = await res.json();
      const updatedProducts = get().products.map((p) => (p.id === id ? { ...p, ...updated } : p));
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return updated;
    } catch (err: any) {
      console.error("updateProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      const updatedProducts = get().products.filter((p) => p.id !== id);
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return true;
    } catch (err: any) {
      console.error("deleteProduct error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  getProductBySlug: (slug: string) => {
    return get().products.find((p) => p.slug === slug);
  },
}));
