import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateProductsCache } from "@/lib/productCache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function formatProduct(p: any, isSignature = false) {
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
    inSignatureCouture: isSignature || !!p.featured,
    variantAttributes: safeJsonParse(p.variantJson, undefined),
    specifications: safeJsonParse(p.specsJson, undefined),
    createdAt: p.createdAt ? (typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString()) : undefined,
    updatedAt: p.updatedAt ? (typeof p.updatedAt === "string" ? p.updatedAt : p.updatedAt.toISOString()) : undefined,
  };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [product, sigRow] = await Promise.all([
      prisma.product.findFirst({
        where: {
          OR: [{ id: params.id }, { slug: params.id }],
        },
      }),
      prisma.siteContent
        .findUnique({
          where: { key: "signature_couture_product_ids" },
        })
        .catch(() => null),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    let isSig = !!product.featured;
    if (sigRow?.value) {
      try {
        const parsed = JSON.parse(sigRow.value);
        if (Array.isArray(parsed)) {
          isSig = parsed.includes(product.id) || parsed.includes(product.slug);
        }
      } catch (e) {}
    }

    return NextResponse.json(formatProduct(product, isSig), { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch product" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const imageUrls =
      Array.isArray(body.images) && body.images.length > 0 && body.images[0]
        ? body.images
        : typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? [body.imageUrl.trim()]
        : undefined;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        priceQatar: body.priceQatar !== undefined && body.priceQatar !== "" && body.priceQatar !== null
          ? parseFloat(body.priceQatar)
          : body.price ? Math.max(10, Math.round(parseFloat(body.price) / 20)) : null,
        salePriceQatar: body.salePriceQatar !== undefined && body.salePriceQatar !== "" && body.salePriceQatar !== null
          ? parseFloat(body.salePriceQatar)
          : null,
        category: body.category,
        stockCount: parseInt(body.stockCount) || 0,
        inStock: (parseInt(body.stockCount) || 0) > 0,
        featured: !!body.featured,
        isBestSeller: !!body.isBestSeller,
        isNewArrival: !!body.isNewArrival,
        images: imageUrls ? JSON.stringify(imageUrls) : undefined,
        variantJson: body.variantAttributes !== undefined ? JSON.stringify(body.variantAttributes) : undefined,
      },
    });

    // Update Signature Couture list if specified
    if (body.inSignatureCouture !== undefined) {
      try {
        const sigRow = await prisma.siteContent.findUnique({
          where: { key: "signature_couture_product_ids" },
        });
        const currentIds: string[] = sigRow?.value ? JSON.parse(sigRow.value) : [];
        let updatedIds = currentIds;
        if (body.inSignatureCouture) {
          if (!currentIds.includes(params.id)) {
            updatedIds = [...currentIds, params.id];
          }
        } else {
          updatedIds = currentIds.filter((id) => id !== params.id);
        }
        await prisma.siteContent.upsert({
          where: { key: "signature_couture_product_ids" },
          update: { value: JSON.stringify(updatedIds) },
          create: { key: "signature_couture_product_ids", value: JSON.stringify(updatedIds) },
        });
      } catch (sigErr) {
        console.warn("Failed to update signature couture selection in PUT:", sigErr);
      }
    }

    invalidateProductsCache();
    return NextResponse.json(formatProduct(updated, !!body.inSignatureCouture), { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    // Remove from signature couture if present
    try {
      const sigRow = await prisma.siteContent.findUnique({
        where: { key: "signature_couture_product_ids" },
      });
      if (sigRow?.value) {
        const currentIds: string[] = JSON.parse(sigRow.value);
        const filtered = currentIds.filter((id) => id !== params.id);
        await prisma.siteContent.update({
          where: { key: "signature_couture_product_ids" },
          data: { value: JSON.stringify(filtered) },
        });
      }
    } catch (e) {}

    invalidateProductsCache();
    return NextResponse.json({ success: true, message: "Product deleted" }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete product" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
