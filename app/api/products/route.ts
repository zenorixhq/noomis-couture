import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products as fallbackProducts } from "@/data/mockData";
import {
  getCachedProducts,
  setCachedProducts,
  invalidateProductsCache,
} from "@/lib/productCache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function formatProduct(p: any, signatureSet?: Set<string>) {
  const isSignature = signatureSet
    ? signatureSet.has(p.id) || signatureSet.has(p.slug)
    : !!p.featured;

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
    inSignatureCouture: isSignature,
    variantAttributes: safeJsonParse(p.variantJson, undefined),
    specifications: safeJsonParse(p.specsJson, undefined),
    createdAt: p.createdAt ? (typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString()) : undefined,
    updatedAt: p.updatedAt ? (typeof p.updatedAt === "string" ? p.updatedAt : p.updatedAt.toISOString()) : undefined,
  };
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const forceFresh = searchParams.get("fresh") === "true";

    // 1. Fast path: Serve from server in-memory cache (< 1ms) if not requested fresh
    if (!forceFresh) {
      const memoryHit = getCachedProducts();
      if (memoryHit && memoryHit.length > 0) {
        return NextResponse.json(memoryHit, { headers: NO_CACHE_HEADERS });
      }
    }

    // 2. Query Neon PostgreSQL database & Signature Couture selection in parallel
    const [dbProducts, signatureRow] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.siteContent
        .findUnique({
          where: { key: "signature_couture_product_ids" },
        })
        .catch(() => null),
    ]);

    let signatureSet = new Set<string>();
    if (signatureRow?.value) {
      try {
        const parsed = JSON.parse(signatureRow.value);
        if (Array.isArray(parsed)) {
          signatureSet = new Set(parsed);
        }
      } catch (e) {}
    }

    if (dbProducts.length === 0) {
      return NextResponse.json(
        fallbackProducts.map((p) => formatProduct(p, signatureSet)),
        { headers: NO_CACHE_HEADERS }
      );
    }

    // Format DB products into application Product interface
    const formatted = dbProducts.map((p) => formatProduct(p, signatureSet));
    setCachedProducts(formatted);
    return NextResponse.json(formatted, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(fallbackProducts, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const imageUrls =
      Array.isArray(body.images) && body.images.length > 0 && body.images[0]
        ? body.images
        : typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? [body.imageUrl.trim()]
        : ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"];

    const newProduct = await prisma.product.create({
      data: {
        slug,
        title: body.title,
        shortDescription: body.shortDescription || body.description?.slice(0, 100) || "",
        description: body.description || "",
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        priceQatar: body.priceQatar !== undefined && body.priceQatar !== "" && body.priceQatar !== null
          ? parseFloat(body.priceQatar)
          : body.price ? Math.max(10, Math.round(parseFloat(body.price) / 20)) : null,
        salePriceQatar: body.salePriceQatar !== undefined && body.salePriceQatar !== "" && body.salePriceQatar !== null
          ? parseFloat(body.salePriceQatar)
          : null,
        category: body.category || "necklaces-and-chains",
        tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : [body.category || "jewelry", "New"]),
        images: JSON.stringify(imageUrls),
        rating: 5.0,
        reviewCount: 0,
        inStock: body.inStock !== false,
        stockCount: parseInt(body.stockCount) || 10,
        featured: !!body.featured || !!body.inSignatureCouture,
        isNewArrival: true,
        isBestSeller: !!body.isBestSeller,
        variantJson: body.variantAttributes ? JSON.stringify(body.variantAttributes) : null,
        specsJson: body.specifications ? JSON.stringify(body.specifications) : null,
      },
    });

    // If marked for Signature Couture, update signature_couture_product_ids
    if (body.inSignatureCouture) {
      try {
        const sigRow = await prisma.siteContent.findUnique({
          where: { key: "signature_couture_product_ids" },
        });
        const currentIds: string[] = sigRow?.value ? JSON.parse(sigRow.value) : [];
        if (!currentIds.includes(newProduct.id)) {
          const updatedIds = [newProduct.id, ...currentIds];
          await prisma.siteContent.upsert({
            where: { key: "signature_couture_product_ids" },
            update: { value: JSON.stringify(updatedIds) },
            create: { key: "signature_couture_product_ids", value: JSON.stringify(updatedIds) },
          });
        }
      } catch (sigErr) {
        console.warn("Failed to update signature couture selection:", sigErr);
      }
    }

    invalidateProductsCache();
    return NextResponse.json(formatProduct(newProduct), { status: 201, headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
