"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  Truck,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Sparkles,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
  PackageCheck,
  Video,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi NCR", "Chandigarh", "Puducherry"
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const autoCheckAndApplyFirstPurchaseDiscount = useCartStore(
    (s) => s.autoCheckAndApplyFirstPurchaseDiscount
  );
  const isFirstPurchaseCustomer = useCartStore((s) => s.isFirstPurchaseCustomer);
  const markCustomerAsPurchased = useCartStore((s) => s.markCustomerAsPurchased);

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    state: "Kerala",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);

    // Auto-fill saved customer profile from localStorage if returning
    if (typeof window !== "undefined") {
      try {
        const savedProfile = localStorage.getItem("noomis_customer_profile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setFormData((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (e) {}
    }

    // Check first-purchase discount
    const hasPurchased =
      typeof window !== "undefined" &&
      localStorage.getItem("noomis_has_purchased") === "true";

    if (hasPurchased) {
      if (appliedCoupon?.firstPurchaseOnly) {
        removeCoupon();
      }
    } else {
      autoCheckAndApplyFirstPurchaseDiscount();
    }
  }, [appliedCoupon, autoCheckAndApplyFirstPurchaseDiscount, removeCoupon]);

  // Real-time verification against database orders
  useEffect(() => {
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length >= 10) {
      const isFirst = isFirstPurchaseCustomer(cleanPhone);
      if (!isFirst && appliedCoupon?.firstPurchaseOnly) {
        removeCoupon();
        setCouponMsg({
          type: "error",
          text: "Welcome back! The 5% first-purchase offer was redeemed on an earlier order. Standard order rate applies.",
        });
      }
    }
  }, [formData.phone, appliedCoupon, isFirstPurchaseCustomer, removeCoupon]);

  const subtotal = useCartStore((s) => s.getSubtotal)();
  const discount = useCartStore((s) => s.getDiscountAmount)();
  const shipping = useCartStore((s) => s.getShippingFee)();
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-xs text-muted-foreground animate-pulse">Loading checkout details...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-editorial font-normal text-foreground">Your shopping bag is empty</h2>
        <p className="text-xs text-muted-foreground">
          Discover our 304 &amp; 316L stainless steel anti-tarnish jewelry collection.
        </p>
        <Link
          href="/products"
          className="inline-block px-7 py-3 rounded-full bg-[#4A171C] text-[#FAF5EB] font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-[#380F13] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponMsg({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setCouponMsg({ type: "error", text: res.message });
    }
  };

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim()
    ) {
      alert("Please fill in your name, 10-digit mobile number, street address, and PIN code.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `NC-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // 1. Create Razorpay order via backend API
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to initiate payment gateway");
      }

      // 2. Ensure checkout.js SDK is ready
      let rzpReady = typeof window !== "undefined" && !!(window as any).Razorpay;
      if (!rzpReady && typeof window !== "undefined") {
        rzpReady = await new Promise<boolean>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      }

      if (!rzpReady) {
        alert("Payment gateway could not be loaded. Please check your internet connection and try again.");
        setIsSubmitting(false);
        return;
      }

      const logoUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/images/noomis-medallion.png`
          : "https://noomiscouture.com/images/noomis-medallion.png";

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Noomi's Couture",
        description: `Order #${orderNumber} (${items.length} item${items.length > 1 ? "s" : ""})`,
        image: logoUrl,
        order_id: orderData.id,
        prefill: {
          name: formData.fullName,
          email: formData.email || undefined,
          contact: cleanPhone.slice(-10),
        },
        theme: {
          color: "#4A171C", // Royal Burgundy Wine
        },
        handler: async function (response: any) {
          try {
            // 4. Verify cryptographic signature & save confirmed order
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCreationId: orderData.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: formData,
                items,
                orderNumber,
                subtotal,
                discountTotal: discount,
                shippingFee: shipping,
                grandTotal,
                orderDetails: {
                  orderNumber,
                  items,
                  customer: formData,
                  pricing: { subtotal, discount, shipping, grandTotal },
                },
              }),
            });

            const verifyData = await verifyRes.json();

            // 5. Persist order record in client storage for Account Portal
            const orderRecord = {
              id: verifyData.order?.id || `ord_${orderNumber}`,
              orderNumber,
              createdAt: new Date().toISOString(),
              status: "processing",
              paymentStatus: "paid",
              paymentMethod: "razorpay",
              paymentId: response.razorpay_payment_id,
              customer: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: {
                  street: formData.address,
                  city: formData.city,
                  state: formData.state,
                  postalCode: formData.postalCode,
                  country: "India",
                },
              },
              items: items.map((it) => ({
                id: it.id,
                title: it.title,
                image: it.image || "/images/noomis-hero-velvet.jpg",
                price: it.price,
                quantity: it.quantity,
                selectedVariant: it.selectedVariant,
              })),
              subtotal,
              discount,
              shipping,
              grandTotal,
              trackingNumber: `DTDC-IN-${(parseInt(orderNumber.replace(/\D/g, "") || "100000", 10) * 7).toString().slice(0, 6)}`,
            };

            try {
              localStorage.setItem("noomis_customer_profile", JSON.stringify(formData));
              localStorage.setItem("noomis_customer_phone", formData.phone);
              localStorage.setItem("noomis_has_purchased", "true");
              markCustomerAsPurchased(formData.phone);

              const prevOrdersStr = localStorage.getItem("noomis_placed_orders");
              const prevOrders = prevOrdersStr ? JSON.parse(prevOrdersStr) : [];
              const updatedOrders = [
                orderRecord,
                ...prevOrders.filter((o: any) => o.orderNumber !== orderNumber),
              ];
              localStorage.setItem("noomis_placed_orders", JSON.stringify(updatedOrders));
            } catch (storageErr) {
              console.warn("Could not save to localStorage:", storageErr);
            }

            clearCart();
            router.push(
              `/checkout/success?orderNumber=${orderNumber}&paymentId=${response.razorpay_payment_id}&total=${grandTotal}&method=razorpay&phone=${encodeURIComponent(
                formData.phone
              )}`
            );
          } catch (err: any) {
            console.error("Verification error:", err);
            clearCart();
            router.push(
              `/checkout/success?orderNumber=${orderNumber}&paymentId=${response.razorpay_payment_id}&total=${grandTotal}&method=razorpay`
            );
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", function (resp: any) {
        alert(`Payment not completed: ${resp.error?.description || "Transaction failed"}`);
        setIsSubmitting(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      alert(`Could not start payment gateway: ${err.message || "Please check connection"}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#FAF7F2] text-[#240A0D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EADBBE]">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#4A171C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Bag</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Lock className="w-3.5 h-3.5" /> 256-bit SSL Razorpay Secure
              </span>
            </div>
          </div>

          {/* Luxury Brand Trust Banner */}
          <div className="mb-8 p-4 bg-[#FAF6EF] rounded-2xl border border-[#EADBBE] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-[#4A171C] font-bold">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="font-editorial text-sm tracking-wide">
                Noomi&apos;s Couture • Everyday Luxury Jewellery
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-600 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <PackageCheck className="w-3.5 h-3.5 text-[#4A171C]" /> Pan-India Express Delivery
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Video className="w-3.5 h-3.5 text-[#4A171C]" /> 360° Unboxing Video 📦
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Anti-Tarnish &amp; Skin Safe
              </span>
            </div>
          </div>

          <form onSubmit={handleRazorpayPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Delivery Details & Payment */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Shipping Details */}
              <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#EADBBE] shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBBE]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#4A171C]" />
                    <h3 className="text-sm font-bold text-[#4A171C] uppercase tracking-wider font-editorial">
                      1. Delivery Address (Pan-India)
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🇮🇳 Express Shipping ₹40 • Free Above ₹799
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                  />
                </div>

                {/* Contact Information (Phone & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#4A171C]" />
                      <span>Mobile Number (10 Digits) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>Email Address (for receipt)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                    />
                  </div>
                </div>

                {/* Secondary Alternate Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>Alternate Phone (Optional)</span>
                    </span>
                    <span className="text-[10px] text-stone-400">For courier delivery driver</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876500000"
                    maxLength={10}
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                  />
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    House / Flat No., Building, Street Name *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Flat 402, Lotus Heights, MG Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none resize-none"
                  />
                </div>

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">City / Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kochi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 682001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Special Instructions / Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-500">
                    Order / Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave package with security if unavailable"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Payment Method Card */}
              <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#EADBBE] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBBE]">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#4A171C]" />
                    <h3 className="text-sm font-bold text-[#4A171C] uppercase tracking-wider font-editorial">
                      2. Payment Method
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant Confirmation
                  </span>
                </div>

                {/* Razorpay Gateway Pill */}
                <div className="p-4 rounded-xl border-2 border-[#4A171C] bg-[#FAF6EF] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#4A171C] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <span className="text-xs font-bold text-[#240A0D]">
                        Razorpay Secure Payment Gateway (UPI • Cards • NetBanking • Wallets)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A171C] bg-[#4A171C]/10 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 pl-6.5 leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards (Visa, MasterCard, RuPay), or NetBanking.
                  </p>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#4A171C] hover:bg-[#380F13] text-[#FAF5EB] font-bold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer border border-[#D4AF37]/30"
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isSubmitting
                        ? "Connecting to Razorpay..."
                        : `Pay ${formatPrice(grandTotal)} via Razorpay`}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-stone-500 mt-2">
                    🔒 100% Encrypted &amp; Authenticated by Razorpay
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupon */}
            <div className="lg:col-span-5 space-y-6">
              {/* Items in Bag */}
              <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBBE] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADBBE]">
                  <h3 className="text-sm font-bold text-[#4A171C] uppercase tracking-wider font-editorial">
                    Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                  <Link href="/cart" className="text-xs text-[#4A171C] font-semibold hover:underline">
                    Edit
                  </Link>
                </div>

                {/* Item List */}
                <div className="divide-y divide-[#EADBBE]/50 max-h-72 overflow-y-auto no-scrollbar pr-1 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#EADBBE] flex-shrink-0 bg-stone-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-[#4A171C] text-white text-[10px] font-bold w-4 h-4 rounded-bl-lg flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#240A0D] truncate">
                          {item.title}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-[10px] text-stone-500">
                            {item.selectedVariant.name || (item.selectedVariant as any).title}
                          </p>
                        )}
                        <p className="text-xs font-bold text-[#4A171C] mt-0.5">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="pt-3 border-t border-[#EADBBE]">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span className="text-[11px]">(-{formatPrice(discount)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. NOOMI5)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#EADBBE] focus:ring-1 focus:ring-[#4A171C] outline-none uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 rounded-xl bg-[#4A171C] text-[#FAF5EB] text-xs font-bold hover:bg-[#380F13] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponMsg && (
                        <p
                          className={`text-[11px] ${
                            couponMsg.type === "success" ? "text-emerald-700 font-medium" : "text-red-600"
                          }`}
                        >
                          {couponMsg.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-[#EADBBE] space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code || "1st Purchase"})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#4A171C] pt-2 border-t border-[#EADBBE]">
                    <span>Total Amount</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Policy Links */}
              <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#EADBBE] space-y-3 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-bold text-[#4A171C]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>The Noomi&apos;s Couture Promise</span>
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed">
                  <li>• Handcrafted 304 &amp; 316L Stainless Steel with 18K Gold Plating</li>
                  <li>• 100% Anti-Tarnish &amp; Waterproof Everyday Wear</li>
                  <li>• Pan-India express dispatch within 24-48 hours via DTDC / India Post</li>
                  <li>• 360° unboxing video verification for full customer protection</li>
                </ul>
                <div className="pt-2 border-t border-[#EADBBE] flex flex-wrap gap-2 text-[10px] text-[#4A171C] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("shipping")}
                    className="hover:underline"
                  >
                    Shipping Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("return-refund")}
                    className="hover:underline"
                  >
                    Return &amp; Refund Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("care-guide")}
                    className="hover:underline"
                  >
                    Jewelry Care Guide
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {policyModalTab && (
        <PolicyModal
          initialTab={policyModalTab}
          isOpen={true}
          onClose={() => setPolicyModalTab(null)}
        />
      )}
    </>
  );
}
