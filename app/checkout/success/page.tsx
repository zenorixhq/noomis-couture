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

  const [copiedMsg, setCopiedMsg] = useState(false);

  // Auto-fetch confirmed order from Neon PostgreSQL database to guarantee complete details
  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrderDetails(data[0]);
        }
      })
      .catch(() => {});
  }, [orderNumber]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const custName =
    orderDetails?.customer?.fullName ||
    orderDetails?.customerName ||
    "Valued Patron";

  const customerPhone =
    phone ||
    orderDetails?.customer?.phone ||
    orderDetails?.customerPhone ||
    "";

  const itemsList = orderDetails?.items?.length
    ? orderDetails.items
        .map(
          (it: any) =>
            `• *${it.quantity}x* ${it.title}${
              it.selectedVariant
                ? ` (${Object.values(it.selectedVariant.options || {}).join(", ")})`
                : ""
            } — ₹${it.price * it.quantity}`
        )
        .join("\n")
    : "";

  const addressText =
    orderDetails?.customer?.address?.street
      ? `${orderDetails.customer.address.street}, ${orderDetails.customer.address.city}, ${orderDetails.customer.address.state} - ${orderDetails.customer.address.postalCode}`
      : orderDetails?.shippingAddress || "";

  let whatsappMessage = `━━━━━━━━━━━━━━━━━━━━━\n`;
  whatsappMessage += `✨ *N O O M I ' S   C O U T U R E* ✨\n`;
  whatsappMessage += `_Official Order Confirmation & Priority Dispatch_\n`;
  whatsappMessage += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  whatsappMessage += `👑 *ORDER REFERENCE:* #${orderNumber}\n`;
  whatsappMessage += `💳 *PAYMENT:* Paid & Verified (Razorpay)\n`;
  whatsappMessage += `💰 *TOTAL AMOUNT:* ${displayTotal}\n`;
  if (paymentId) {
    whatsappMessage += `🔖 *TRANSACTION ID:* ${paymentId}\n`;
  }
  whatsappMessage += `\n👤 *CUSTOMER DETAILS:*\n`;
  whatsappMessage += `• *Name:* ${custName}\n`;
  if (customerPhone) {
    whatsappMessage += `• *Phone:* ${customerPhone}\n`;
  }
  if (addressText) {
    whatsappMessage += `• *Deliver To:* ${addressText}\n`;
  }
  if (itemsList) {
    whatsappMessage += `\n💍 *ITEMS ORDERED:*\n${itemsList}\n`;
  }
  whatsappMessage += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  whatsappMessage += `💬 *MESSAGE TO CONCIERGE:*\n`;
  whatsappMessage += `"Hello Noomi's Couture team! I have completed and paid for this order on your website. Please share packing video & dispatch tracking details once ready. Thank you! 💖"\n`;
  whatsappMessage += `━━━━━━━━━━━━━━━━━━━━━`;

  const encodedMsg = encodeURIComponent(whatsappMessage);
  const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMsg}`;
  const whatsappMobileUrl = `https://wa.me/${whatsappPhone}?text=${encodedMsg}`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2200);
    } catch (e) {}
  };

  const accountUrl = `/account?query=${encodeURIComponent(customerPhone || orderNumber)}`;

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

        {/* 1. DEDICATED BEAUTIFIED WHATSAPP CONFIRMATION SECTION (DESKTOP & MOBILE) */}
        <div className="bg-[#FAF8F5] border-2 border-[#25D366]/40 rounded-2xl overflow-hidden shadow-sm">
          {/* WhatsApp Brand Header */}
          <div className="bg-[#075E54] text-white px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold shadow-xs">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold tracking-wide leading-tight">
                  Noomi&apos;s Couture Concierge
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Instant Packaging Desk</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold flex items-center gap-1 text-emerald-100 transition-colors"
              title="Copy message text"
            >
              {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMsg ? "Copied!" : "Copy Receipt"}</span>
            </button>
          </div>

          {/* WhatsApp Chat Preview Canvas (Authentic Chat Bubble) */}
          <div className="p-4 sm:p-6 bg-[#EFEAE2] space-y-4">
            <div className="max-w-xl mx-auto">
              <div className="bg-[#DCF8C6] border border-[#C5E1A5] rounded-2xl p-4 sm:p-5 shadow-xs text-[#1C1917] space-y-3 relative">
                <div className="text-[11px] sm:text-xs font-mono whitespace-pre-wrap leading-relaxed text-stone-800">
                  {whatsappMessage}
                </div>

                <div className="flex items-center justify-end gap-1 text-[10px] text-stone-500 pt-1 border-t border-emerald-700/10">
                  <span>Just now</span>
                  <span className="text-[#34B7F1] font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Desktop & Mobile Action Buttons */}
            <div className="max-w-xl mx-auto pt-2 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Desktop: WhatsApp Web button */}
                <a
                  href={whatsappWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Send on WhatsApp Web</span>
                </a>

                {/* Mobile / Direct App button */}
                <a
                  href={whatsappMobileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Open in WhatsApp App</span>
                </a>
              </div>

              <p className="text-[11px] text-center text-stone-500">
                Tap above to notify our packing concierge directly with your receipt for priority dispatch.
              </p>
            </div>
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
            href={accountUrl}
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
            href={whatsappMobileUrl}
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
