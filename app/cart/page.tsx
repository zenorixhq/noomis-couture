"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const autoCheckAndApplyFirstPurchaseDiscount = useCartStore((s) => s.autoCheckAndApplyFirstPurchaseDiscount);
  const isFirstPurchaseCustomer = useCartStore((s) => s.isFirstPurchaseCustomer);
  const isFirstCustomer = isFirstPurchaseCustomer();

  useEffect(() => {
    setMounted(true);
    autoCheckAndApplyFirstPurchaseDiscount();
  }, [autoCheckAndApplyFirstPurchaseDiscount]);

  // Instant memoized calculations directly from in-memory cart items
  const { subtotal, discount, shipping, tax, total } = useMemo(() => {
    let sub = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      sub += it.price * it.quantity;
    }

    let disc = 0;
    if (appliedCoupon && sub > 0) {
      disc =
        appliedCoupon.discountType === "percentage"
          ? (sub * appliedCoupon.amount) / 100
          : Math.min(appliedCoupon.amount, sub);
    }

    let ship = 0;
    if (sub > 0 && sub < storeConfig.commerce.freeShippingThreshold) {
      ship = storeConfig.commerce.flatShippingFee;
    }

    const taxableAmount = Math.max(0, sub - disc);
    const tx = taxableAmount * (storeConfig.commerce.taxRatePercent / 100);
    const tot = Math.max(0, sub - disc + ship + tx);

    return { subtotal: sub, discount: disc, shipping: ship, tax: tx, total: tot };
  }, [items, appliedCoupon]);

  const freeShippingThreshold = storeConfig.commerce.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="h-12 w-full bg-muted/60 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 h-72 bg-muted/40 rounded-2xl" />
          <div className="lg:col-span-4 h-72 bg-muted/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Your shopping bag is empty</h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Explore our collection of 304 & 306 grade waterproof anti-tarnish jewelry.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors"
        >
          <span>Discover Jewelry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Shopping Bag</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review your items before proceeding to secure checkout.
        </p>
      </div>

      {/* Free Shipping Meter */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="flex items-center gap-2 text-foreground">
            <Truck className="w-4 h-4 text-primary" />
            {amountNeeded === 0 ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Congratulations! You qualified for Complimentary Shipping.
              </span>
            ) : (
              <span>
                Add <strong className="text-primary">{formatPrice(amountNeeded, selectedCurrency)}</strong> more to receive Free Shipping
              </span>
            )}
          </span>
          <span className="text-muted-foreground">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm divide-y divide-border/60">
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Item Details
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
            >
              Clear Entire Bag
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="py-4 sm:py-6 first:pt-4 flex flex-row items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#FAF8F5] dark:bg-stone-900/40 rounded-xl border border-border p-1 flex items-center justify-center shrink-0 aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain rounded-lg max-w-full max-h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/noomis-brand-card.png";
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedVariant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Object.entries(item.selectedVariant.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" / ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-2">
                  <div className="flex items-center border border-border rounded-lg bg-muted/20">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-muted text-foreground transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stockCount !== undefined && item.quantity >= item.stockCount}
                      className="p-1.5 hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-foreground">
                    {formatPrice(item.price * item.quantity, selectedCurrency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, selectedCurrency)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>1st Purchase Discount (5% OFF)</span>
                <span>-{formatPrice(discount, selectedCurrency)}</span>
              </div>
            ) : !isFirstCustomer ? (
              <div className="flex justify-between text-muted-foreground text-[11px] bg-muted/40 p-2 rounded-lg">
                <span>Client Status:</span>
                <span className="font-semibold text-foreground">Repeat Client (Normal Rate)</span>
              </div>
            ) : null}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping, selectedCurrency)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax</span>
              <span>{formatPrice(tax, selectedCurrency)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
              <span>Estimated Total</span>
              <span>{formatPrice(total, selectedCurrency)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba59] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.99]"
          >
            <span>Proceed to WhatsApp Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-[#25D366]" />
            <span>Direct WhatsApp Order • 100% Secure UPI / COD Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
