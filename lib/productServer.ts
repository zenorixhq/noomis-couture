import { prisma } from "@/lib/prisma";
import { products as fallbackProducts } from "@/data/mockData";
import { Product } from "@/types/store";

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export function formatProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice || undefined,
    priceQatar: p.priceQatar !== null && p.priceQatar !== undefined ? p.priceQatar : undefined,
    salePriceQatar: p.salePriceQatar !== null && p.salePriceQatar !== undefined ? p.salePriceQatar : undefined,
    category: p.category,
    tags: safeJsonParse<string[]>(p.tags, [p.category]),
    images: safeJsonParse<string[]>(p.images, [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    ]),
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    stockCount: p.stockCount,
    featured: p.featured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    variantAttributes: safeJsonParse(p.variantJson, undefined),
    specifications: safeJsonParse(p.specsJson, undefined),
  };
}

/**
 * Server-side product retrieval for Static Generation (SSG) & metadata.
 * Queries Neon PostgreSQL; gracefully falls back to mockData catalog if offline.
 */
export async function getAllProductsServer(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(formatProduct);
    }
  } catch (err) {
    // Database query failed or unconfigured during build time, safely fallback
    console.warn("getAllProductsServer: Falling back to static mock catalog data.");
  }
  return fallbackProducts;
}

export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const allProducts = await getAllProductsServer();

  const found = allProducts.find((p) => {
    const pSlug = (p.slug || "").toLowerCase().trim();
    const pId = (p.id || "").toLowerCase().trim();
    if (pSlug === cleanSlug || pId === cleanSlug) return true;
    if (cleanSlug.endsWith("s") && pSlug === cleanSlug.slice(0, -1)) return true;
    if (!cleanSlug.endsWith("s") && pSlug === cleanSlug + "s") return true;
    if (pSlug.replace(/[-_]/g, "") === cleanSlug.replace(/[-_]/g, "")) return true;
    return false;
  });

  return found || null;
}
