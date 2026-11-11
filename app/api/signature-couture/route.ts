import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: "signature_couture_product_ids" },
    });

    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed)) {
        return NextResponse.json({ productIds: parsed }, { headers: NO_CACHE_HEADERS });
      }
    }

    return NextResponse.json({ productIds: [] }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("GET /api/signature-couture error:", err);
    return NextResponse.json({ productIds: [] }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productIds = Array.isArray(body.productIds) ? body.productIds : [];

    const jsonStr = JSON.stringify(productIds);
    await prisma.siteContent.upsert({
      where: { key: "signature_couture_product_ids" },
      update: { value: jsonStr },
      create: { key: "signature_couture_product_ids", value: jsonStr },
    });

    return NextResponse.json({ success: true, productIds }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("POST /api/signature-couture error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update signature couture selection" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
