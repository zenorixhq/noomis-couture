"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Gift, Copy, Check, X, Sparkles, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function FloatingOfferPill() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const applyCoupon = useCartStore((s) => s.applyCoupon);

  useEffect(() => {
    setMounted(true);
    // Check if user previously minimized
    try {
      const saved = sessionStorage.getItem("noomis_offer_minimized");
      if (saved === "true") setMinimized(true);
    } catch {}
  }, []);

  if (!mounted || pathname?.startsWith("/admin")) {
    return null;
  }

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText("NOOMI5");
    } catch {}
    // Automatically apply coupon to cart store
    applyCoupon("NOOMI5");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !minimized;
    setMinimized(nextState);
    try {
      sessionStorage.setItem("noomis_offer_minimized", String(nextState));
    } catch {}
  };

  return (
    <aside
      aria-label="Exclusive Offers Banner"
      className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-40 select-none max-w-[calc(100vw-88px)] sm:max-w-md transition-all duration-300"
    >
      {minimized ? (
        /* Minimized Floating Offer Pill */
        <button
          onClick={handleToggleMinimize}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#4A171C] text-[#FAF5EB] border border-[#C5A059] shadow-[0_8px_24px_rgba(74,23,28,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 group"
          title="Click to view offers"
        >
          <Gift className="w-4 h-4 text-[#C5A059] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#F7EEDD]">
            5% OFF + Free Delivery
          </span>
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping ml-0.5" />
        </button>
      ) : (
        /* Expanded Luxury Offer Card / Pill */
        <div className="relative rounded-2xl bg-gradient-to-br from-[#4A171C] via-[#380F13] to-[#25080C] text-[#FAF5EB] border border-[#C5A059]/70 shadow-[0_12px_32px_rgba(74,23,28,0.45)] p-3 sm:p-3.5 backdrop-blur-md">
          {/* Subtle gold shimmer line at top */}
          <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-70" />

          {/* Dismiss / Minimize button */}
          <button
            onClick={handleToggleMinimize}
            className="absolute top-2 right-2 p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Minimize offer"
            aria-label="Minimize offer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5 sm:gap-3 pr-5">
            {/* Gift Icon Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/60 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
              <Gift className="w-4 h-4 text-[#C5A059]" />
            </div>

            {/* Offer Texts */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                  5% OFF on 1st Order
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C5A059] text-[#1C1917]">
                  New
                </span>
              </div>

              {/* Free shipping line */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#EADBBE] font-medium">
                <Truck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>
                  Free Shipping Above <strong className="text-white">₹999</strong>
                </span>
              </div>

              {/* Coupon Code Pill & Copy Button */}
              <div className="pt-1.5 flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-black/40 border border-[#C5A059]/40 font-mono text-[11px] font-bold tracking-widest text-[#F7EEDD]">
                  NOOMI5
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-[#C5A059] hover:bg-[#D5B069] text-[#1C1917]"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
