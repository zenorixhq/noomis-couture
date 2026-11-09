import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { amount, currency = "INR", receipt } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // Convert to paise if passed in Rupees (e.g., store checkout passing 299 for ₹299)
    // If already in paise (body.inPaise or body.amountInPaise), use directly
    let amountInPaise: number;
    if (body.inPaise || body.amountInPaise) {
      amountInPaise = Math.round(body.amountInPaise || amount);
    } else if (body.isPaise || (amount >= 100 && Number.isInteger(amount) && body.fromStandardCheckout)) {
      amountInPaise = Math.round(amount);
    } else {
      // In store checkout, amount is in INR, convert to paise
      amountInPaise = Math.round(amount * 100);
    }

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1.00)" },
        { status: 400 }
      );
    }

    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keyId =
      rawKeyId && !rawKeyId.includes("TmUYZ") && !rawKeyId.includes("Tvxxm") && !rawKeyId.includes("Tvzvx")
        ? rawKeyId
        : "rzp_live_Tw10ncniHzIDNS";

    const rawSecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || "";
    const keySecret =
      rawSecret && !rawSecret.includes("8wuz") && !rawSecret.includes("fGBx") && !rawSecret.includes("NXHZ")
        ? rawSecret
        : "fucsYkk2r0mCB8ZqkvF7bzKa";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured" },
        { status: 401 }
      );
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: currency || "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error("Razorpay order creation failed from API:", orderData);
      const statusCode = response.status === 401 ? 401 : 500;
      return NextResponse.json(
        {
          error:
            orderData.error?.description ||
            orderData.message ||
            "Razorpay API error",
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      order_id: orderData.id,
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      key: keyId,
    });
  } catch (err: any) {
    console.error("Order API route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate Razorpay order" },
      { status: 500 }
    );
  }
}
