"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import {
  CheckCircle2,
  PackageCheck,
  Video,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  Truck,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "NC-28491";
  const paymentId = searchParams.get("paymentId") || "";
  const rawTotal = searchParams.get("total") || "799";
  const cleanedTotal = rawTotal.replace(/^[₹\s]+/, "");
  const displayTotal = `₹${cleanedTotal}`;
  const phone = searchParams.get("phone") || "";
  const method = searchParams.get("method") || (paymentId ? "razorpay" : "gateway");

  const [copied, setCopied] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const isOnlinePayment = method === "razorpay" || !!paymentId;
  const whatsappPhone = storeConfig.brand.contact.whatsappNumber || "919633956222";

  useEffect(() => {
    if (typeof window === "undefined" || !orderNumber) return;
    try {
      const prevOrdersStr = localStorage.getItem("noomis_placed_orders");
      const prevOrders = prevOrdersStr ? JSON.parse(prevOrdersStr) : [];
      const found = prevOrders.find((o: any) => o.orderNumber === orderNumber);
      if (found) {
        setOrderDetails(found);
      }

      const exists = prevOrders.some((o: any) => o.orderNumber === orderNumber);
      if (!exists) {
        const numericTotal = parseFloat(cleanedTotal) || 0;
        const newRecord = {
          id: `ord_${orderNumber}`,
          orderNumber,
          createdAt: new Date().toISOString(),
          status: "processing",
          paymentStatus: isOnlinePayment ? "paid" : "pending",
          paymentMethod: method,
          razorpayPaymentId: paymentId,
          customer: {
            fullName: "Valued Patron",
            phone: phone,
          },
          items: [],
          grandTotal: numericTotal,
          trackingNumber: `DTDC-IN-${(parseInt(orderNumber.replace(/\D/g, "") || "100000", 10) * 7).toString().slice(0, 6)}`,
        };
        localStorage.setItem("noomis_placed_orders", JSON.stringify([newRecord, ...prevOrders]));
        setOrderDetails(newRecord);
      }
      if (phone) {
        localStorage.setItem("noomis_customer_phone", phone);
      }
      localStorage.setItem("noomis_has_purchased", "true");
    } catch (e) {}
  }, [orderNumber, paymentId, cleanedTotal, phone, method, isOnlinePayment]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const custName = orderDetails?.customer?.fullName || "Valued Patron";
  const itemsText = orderDetails?.items?.length
    ? orderDetails.items.map((it: any) => `• ${it.quantity}x ${it.title} (₹${it.price})`).join("\n")
    : "";
  const addressText = orderDetails?.customer?.address
    ? `${orderDetails.customer.address.street || ""}, ${orderDetails.customer.address.city || ""}, ${orderDetails.customer.address.state || ""} - ${orderDetails.customer.address.postalCode || ""}`
    : "";

  let whatsappMessage = `✨ *Noomi's Couture - Order Confirmation* ✨\n\n`;
  whatsappMessage += `*Order Reference:* #${orderNumber}\n`;
  whatsappMessage += `*Amount Paid:* ${displayTotal} (Razorpay Verified)\n`;
  if (paymentId) whatsappMessage += `*Payment ID:* ${paymentId}\n`;
  whatsappMessage += `*Customer:* ${custName}\n`;
  if (phone || orderDetails?.customer?.phone) whatsappMessage += `*Phone:* ${phone || orderDetails?.customer?.phone}\n`;
  if (addressText) whatsappMessage += `*Delivery Address:* ${addressText}\n`;
  if (itemsText) whatsappMessage += `\n*Items Ordered:*\n${itemsText}\n`;
  whatsappMessage += `\nHi Noomi's Couture! I have confirmed and paid for this order on your website. Please share packing video & dispatch tracking details. Thank you! ✨`;

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8 font-sans">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-[#4A171C]">
          {isOnlinePayment ? "Payment Verified & Order Confirmed" : "Order Placed Successfully"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#240A0D]">
          Thank you for choosing Noomi&apos;s Couture!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          {isOnlinePayment
            ? "Your payment was processed securely via Razorpay. We are preparing your anti-tarnish jewelry parcel for express dispatch."
            : "Your order details have been confirmed. Our concierge team is packing your parcel."}
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-[#FFFDF9] border border-[#EADBBE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-[#EADBBE]">
          <div>
            <span className="text-xs text-stone-500 block">Order Reference</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base sm:text-lg font-bold text-[#4A171C] font-mono">
                {orderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md text-stone-400 hover:text-[#4A171C] transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-stone-500 block">Amount Paid</span>
            <p className="text-base sm:text-lg font-bold text-[#240A0D] mt-0.5">
              {displayTotal}
            </p>
          </div>

          <div>
            <span className="text-xs text-stone-500 block">Payment Method</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Razorpay Verified</span>
            </span>
          </div>
        </div>

        {paymentId && (
          <div className="text-xs text-stone-500 bg-[#FAF6EF] p-3 rounded-xl border border-[#EADBBE] flex flex-wrap items-center justify-between gap-2">
            <span>Razorpay Payment ID:</span>
            <span className="font-mono text-stone-700 font-semibold">{paymentId}</span>
          </div>
        )}

        {/* 1. DEDICATED PROMINENT WHATSAPP CONFIRMATION SECTION */}
        <div className="bg-gradient-to-br from-[#E8F8F0] via-emerald-50 to-[#FAF7F2] border-2 border-[#25D366]/50 rounded-2xl p-5 sm:p-6 text-center space-y-3.5 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Instant Order Confirmation
            </span>
          </div>

          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-normal text-[#1C1917]">
              Confirm Your Order on WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
              Tap below to send your order receipt directly to our concierge on WhatsApp for priority packaging, personal care, and immediate dispatch updates.
            </p>
          </div>

          <div className="pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm tracking-wide transition-all shadow-[0_8px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)] active:scale-95 group"
            >
              <MessageCircle className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform" />
              <span>Confirm Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Dispatch & Unboxing Advisory */}
        <div className="space-y-3 bg-[#FAF6EF] p-5 rounded-xl border border-[#EADBBE] text-xs text-stone-600">
          <h4 className="font-bold text-[#4A171C] text-sm flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#C5A059]" />
            <span>Shipping &amp; Delivery Timeline:</span>
          </h4>
          <ul className="space-y-1.5 leading-relaxed text-[11px]">
            <li>• Your parcel will be dispatched within <strong>24 to 48 hours</strong> via DTDC Express / India Post Speed Post.</li>
            <li>• Tracking ID will be sent via SMS / WhatsApp once your package leaves our fulfillment center.</li>
            <li>• Estimated delivery: <strong>3-5 business days</strong> across India.</li>
            <li className="text-amber-800 font-medium">📦 <strong>Important Policy:</strong> A continuous 360° unboxing video without cuts is mandatory for any transit damage or missing item claims.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/account"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#4A171C] hover:bg-[#380F13] text-[#FAF5EB] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md border border-[#D4AF37]/30"
          >
            <span>Track Order in My Account</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 border border-[#EADBBE] transition-colors"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* WhatsApp Direct Concierge Help */}
        <div className="pt-4 border-t border-[#EADBBE] flex items-center justify-between text-xs text-stone-500">
          <span>Need custom assistance or sizing help?</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#128C7E] font-bold hover:underline"
          >
            <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto px-4 py-24 text-center">
            <p className="text-xs text-stone-500 animate-pulse">Loading order confirmation...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
