import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleOrders } from "@/data/mockData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length >= 7) {
        const existingOrder = await prisma.order.findFirst({
          where: {
            customerPhone: {
              contains: cleanPhone.slice(-8),
            },
          },
        });
        return NextResponse.json({ isFirstPurchase: !existingOrder });
      }
      return NextResponse.json({ isFirstPurchase: true });
    }

    const dbOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders.length === 0) {
      return NextResponse.json([]);
    }

    const formatted = dbOrders.map((o: any) => {
      let parsedItems = [];
      try {
        if (o.itemsJson) {
          parsedItems = typeof o.itemsJson === "string" ? JSON.parse(o.itemsJson) : o.itemsJson;
        }
      } catch (e) {
        parsedItems = [];
      }

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt.toISOString(),
        status: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        customer: {
          id: `cust-${o.id}`,
          name: o.customerName || "Valued Customer",
          fullName: o.customerName || "Valued Customer",
          email: o.customerEmail || "concierge@noomiscouture.com",
          phone: o.customerPhone || "",
          shippingAddress: {
            line1: o.shippingAddress || "Direct Delivery",
            city: "Kerala",
            state: "KL",
            postalCode: "",
            country: "India",
          },
          address: {
            street: o.shippingAddress || "Direct Delivery",
            city: "Kerala",
            state: "KL",
            postalCode: "",
            country: "India",
          },
        },
        items: Array.isArray(parsedItems) ? parsedItems : [],
        subtotal: o.subtotal || 0,
        discount: o.discountTotal || 0,
        shipping: o.shippingFee || 0,
        tax: o.taxTotal || 0,
        grandTotal: o.grandTotal || 0,
        currency: "INR",
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail || `${body.customerPhone}@whatsapp.customer`,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        itemsJson: JSON.stringify(body.items || []),
        subtotal: parseFloat(body.subtotal) || 0,
        discountTotal: parseFloat(body.discountTotal) || 0,
        shippingFee: parseFloat(body.shippingFee) || 0,
        taxTotal: 0,
        grandTotal: parseFloat(body.grandTotal) || 0,
        paymentMethod: body.paymentMethod || "WhatsApp UPI",
        paymentStatus: body.paymentStatus || "pending",
        orderStatus: body.orderStatus || "processing",
      },
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { orderStatus: status },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
