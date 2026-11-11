"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sampleOrders } from "@/data/mockData";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import { storeConfig } from "@/config/store.config";
import {
  Package,
  Heart,
  MapPin,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
} from "lucide-react";

function AccountPageContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [placedOrders, setPlacedOrders] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState<string>("Valued Patron");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");

  const wishlist = useCartStore((s) => s.wishlist);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const addItem = useCartStore((s) => s.addItem);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);

  const whatsappPhone = storeConfig.brand.contact.whatsappNumber || "919633956222";

  useEffect(() => {
    fetchProducts().finally(() => {
      setHasLoadedProducts(true);
    });
  }, [fetchProducts]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedOrdersStr = localStorage.getItem("noomis_placed_orders");
      if (savedOrdersStr) {
        const parsed = JSON.parse(savedOrdersStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlacedOrders(parsed);
          const latestCust = parsed[0]?.customer;
          if (latestCust?.fullName && latestCust.fullName !== "Valued Patron") {
            setCustomerName(latestCust.fullName);
          }
          if (latestCust?.phone) setCustomerPhone(latestCust.phone);
          if (latestCust?.email) setCustomerEmail(latestCust.email);
        }
      }

      const profileStr = localStorage.getItem("noomis_customer_profile");
      if (profileStr) {
        const prof = JSON.parse(profileStr);
        if (prof.fullName) setCustomerName(prof.fullName);
        if (prof.phone) setCustomerPhone(prof.phone);
        if (prof.email) setCustomerEmail(prof.email);
      }
    } catch (e) {}
  }, []);

  const allOrders = [...placedOrders, ...sampleOrders];

  const isWishlisted = (p: (typeof products)[0]) => {
    const pId = (p.id || "").toLowerCase().trim();
    const pSlug = (p.slug || "").toLowerCase().trim();
    return wishlist.some((w) => {
      if (!w) return false;
      const cleanW = String(w).toLowerCase().trim();
      return (
        cleanW === pId ||
        cleanW === pSlug ||
        cleanW === pSlug.replace(/s$/, "") ||
        cleanW === pSlug + "s" ||
        cleanW.replace(/[-_]/g, "") === pSlug.replace(/[-_]/g, "")
      );
    });
  };

  const wishlistProducts = products.filter(isWishlisted);
  const isLoadingSavedPieces = (!hasLoadedProducts || products.length === 0) && wishlist.length > 0;
  const displayWishlistCount =
    hasLoadedProducts && products.length > 0
      ? wishlistProducts.length
      : wishlist.length;

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => {
      addItem(p, 1);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Truck className="w-3 h-3" />
            <span>Shipped &amp; In Transit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" />
            <span>Processing Order</span>
          </span>
        );
    }
  };

  const createWhatsAppOrderUrl = (order: any) => {
    const isPaid = order.paymentStatus === "paid" || !!order.razorpayPaymentId || !!order.paymentId;
    const itemsList = order.items?.length
      ? order.items.map((it: any) => `• ${it.quantity}x ${it.title} (₹${it.price})`).join("\n")
      : "";
    
    let msg = `✨ *Noomi's Couture - Order Confirmation & Inquiry* ✨\n\n`;
    msg += `*Order Reference:* #${order.orderNumber}\n`;
    msg += `*Total Amount:* ₹${order.grandTotal}\n`;
    msg += `*Payment Status:* ${isPaid ? "Paid (Razorpay Verified)" : "Pending / COD"}\n`;
    if (order.razorpayPaymentId || order.paymentId) {
      msg += `*Payment ID:* ${order.razorpayPaymentId || order.paymentId}\n`;
    }
    if (order.trackingNumber) {
      msg += `*Tracking Code:* ${order.trackingNumber}\n`;
    }
    if (itemsList) {
      msg += `\n*Items Ordered:*\n${itemsList}\n`;
    }
    msg += `\nHi Noomi's Couture Concierge! I would like to confirm my order #${order.orderNumber} and check dispatch tracking details. Thank you! ✨`;

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 font-sans">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, <strong className="text-foreground">{customerName}</strong>
            {customerPhone && ` • ${customerPhone}`}
            {customerEmail && ` • ${customerEmail}`}
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "orders"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders &amp; Shipments ({allOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "wishlist"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({displayWishlistCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "addresses"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses (2)</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {allOrders.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No orders placed yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore our everyday waterproof luxury jewelry and place your first order today.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            allOrders.map((order) => {
              const isPaid = order.paymentStatus === "paid" || !!order.razorpayPaymentId || !!order.paymentId;
              const waUrl = createWhatsAppOrderUrl(order);

              return (
                <div
                  key={order.id || order.orderNumber}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Order Reference</span>
                      <p className="text-sm font-bold text-foreground font-mono">#{order.orderNumber}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Razorpay Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Payment Pending</span>
                        </span>
                      )}
                      {getStatusBadge(order.status || "processing")}
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(order.grandTotal, selectedCurrency)}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="flex items-center gap-4">
                          <img
                            src={item.image || "/images/noomis-hero-velvet.jpg"}
                            alt={item.title || "Product"}
                            className="w-16 h-16 object-cover rounded-lg border border-border shrink-0 aspect-square"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                            {item.selectedVariant && (
                              <p className="text-[11px] text-muted-foreground">
                                {Object.values(item.selectedVariant.options || {}).join(" / ")}
                              </p>
                            )}
                            <p className="text-[11px] text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(item.price * item.quantity, selectedCurrency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Address Preview if saved */}
                  {order.customer?.address && (
                    <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">
                      <span className="font-semibold text-foreground block mb-0.5">Delivery Address:</span>
                      <span>
                        {order.customer.fullName && `${order.customer.fullName}, `}
                        {order.customer.address.street}, {order.customer.address.city}, {order.customer.address.state} - {order.customer.address.postalCode}
                      </span>
                    </div>
                  )}

                  {/* Actions & WhatsApp Support Bar */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {order.trackingNumber && (
                        <span>Tracking: <strong className="text-foreground font-mono">{order.trackingNumber}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all group"
                      >
                        <MessageCircle className="w-4 h-4 fill-current shrink-0 group-hover:scale-110 transition-transform" />
                        <span>Confirm on WhatsApp</span>
                      </a>

                      <Link
                        href={`/checkout/success?orderNumber=${order.orderNumber}&total=${order.grandTotal}${order.razorpayPaymentId ? `&paymentId=${order.razorpayPaymentId}` : ""}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <span>View Receipt</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === "wishlist" && (
        <div className="space-y-6">
          {wishlistProducts.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Shopping Bag</span>
              </button>
            </div>
          )}

          {isLoadingSavedPieces ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground animate-pulse">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Retrieving your saved pieces...</p>
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Your wishlist is empty</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click the heart icon on any product in our catalog to save items for future consideration.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase">Default Delivery Address</span>
            <h4 className="text-sm font-bold text-foreground">{customerName}</h4>
            <p className="text-xs text-muted-foreground">Noomi&apos;s Couture Concierge Delivery</p>
            <p className="text-xs text-muted-foreground">Express Priority Dispatch across India</p>
            {customerPhone && <p className="text-xs text-muted-foreground">Phone: {customerPhone}</p>}
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">WhatsApp Concierge Office</span>
            <h4 className="text-sm font-bold text-foreground">Noomi&apos;s Couture Kerala Studio</h4>
            <p className="text-xs text-muted-foreground">South Kalamassery, Ernakulam, Kerala 682033</p>
            <p className="text-xs text-muted-foreground">Phone: +91 96339 56222</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto py-16 text-center">Loading account...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}
