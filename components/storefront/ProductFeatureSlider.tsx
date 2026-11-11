"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  HeartHandshake,
  Truck,
  Video,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface ProductFeature {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  policyTab: "care-guide" | "shipping" | "return-refund" | "ordering-instructions" | "size-guide";
  linkText: string;
}

export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: "premium-steel",
    badge: "Surgical Grade",
    title: "Premium 316L Steel",
    description: "Crafted in surgical-grade 316L stainless steel with 18K real gold PVD coating for mirror brilliance.",
    icon: Sparkles,
    policyTab: "care-guide",
    linkText: "View Care Guide",
  },
  {
    id: "waterproof-anti-tarnish",
    badge: "100% Waterproof",
    title: "100% Anti-Tarnish & Waterproof",
    description: "Wear in shower, swimming pool, gym workouts, and daily wear without fading, discoloration, or green marks.",
    icon: Droplets,
    policyTab: "care-guide",
    linkText: "Waterproof Specs",
  },
  {
    id: "guaranteed-authenticity",
    badge: "Certified Quality",
    title: "Guaranteed Authenticity",
    description: "Every piece certified nickel-free, lead-free, and thoroughly inspected before dispatch.",
    icon: ShieldCheck,
    policyTab: "ordering-instructions",
    linkText: "Quality Assurance",
  },
  {
    id: "skin-safe",
    badge: "Zero Allergies",
    title: "Skin Safe & Hypoallergenic",
    description: "100% skin safe and nickel-free. Engineered for sensitive skin so you can wear your favorites 24/7 in comfort.",
    icon: HeartHandshake,
    policyTab: "care-guide",
    linkText: "Skin Safety Info",
  },
  {
    id: "shipping-courier",
    badge: "Pan-India Express",
    title: "Shipping via DTDC & India Post",
    description: "Reliable dispatch via DTDC Express & India Post (Speed Post) with live SMS/WhatsApp tracking. Free over ₹799 (Flat ₹40).",
    icon: Truck,
    policyTab: "shipping",
    linkText: "Shipping Policy",
  },
  {
    id: "damage-replacement",
    badge: "360° Unboxing Video",
    title: "Verified Damage Replacement",
    description: "Peace-of-mind guarantee. Immediate replacement for rare transit damage with a continuous 360° unboxing video.",
    icon: Video,
    policyTab: "return-refund",
    linkText: "Replacement Policy",
  },
];

interface ProductFeatureSliderProps {
  onOpenPolicy?: (tab: "care-guide" | "shipping" | "return-refund" | "ordering-instructions" | "size-guide") => void;
  className?: string;
}

export function ProductFeatureSlider({ onOpenPolicy, className = "" }: ProductFeatureSliderProps) {
  // Mobile index: 0 .. features.length - 1 (1 item per slide)
  const [mobileIndex, setMobileIndex] = useState(0);
  // Desktop index: 0 .. features.length - 3 (or 4)
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const total = PRODUCT_FEATURES.length;
  const desktopVisibleCount = 3; // 3 or 4 on desktop
  const maxDesktopIndex = Math.max(0, total - desktopVisibleCount);

  // Auto-scroll every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % total);
      setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, total, maxDesktopIndex]);

  // Handle arrow key presses
  const handlePrev = useCallback(() => {
    setMobileIndex((prev) => (prev - 1 + total) % total);
    setDesktopIndex((prev) => Math.max(0, prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setMobileIndex((prev) => (prev + 1) % total);
    setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  }, [total, maxDesktopIndex]);

  // Global & scoped arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in an input or textarea, ignore
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      // Check if carousel or container is focused or hovered
      if (e.key === "ArrowLeft") {
        if (containerRef.current?.matches(":hover") || document.activeElement === containerRef.current) {
          e.preventDefault();
          handlePrev();
        }
      } else if (e.key === "ArrowRight") {
        if (containerRef.current?.matches(":hover") || document.activeElement === containerRef.current) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  const handleCardClick = (tab: ProductFeature["policyTab"]) => {
    if (onOpenPolicy) {
      onOpenPolicy(tab);
    }
  };

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Jewelry Features & Store Policies"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`relative w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar with Section Label & Controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary">
              Noomi&apos;s Couture Assurances &amp; Standards
            </span>
          </div>

          {/* Navigation Arrows & Auto-scroll indicator */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-muted-foreground mr-2 font-medium">
              Use ← → arrow keys to navigate
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous feature"
              className="w-8 h-8 rounded-full border border-border bg-card/80 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next feature"
              className="w-8 h-8 rounded-full border border-border bg-card/80 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE VIEW (< 768px): Strictly 1 item at a time          */}
        {/* Auto-scrolling every 3s + Left/Right arrow keys/buttons    */}
        {/* ========================================================= */}
        <div
          className="md:hidden relative overflow-hidden rounded-2xl bg-card border border-border/80 shadow-sm"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {PRODUCT_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="w-full flex-shrink-0 p-5 sm:p-6 flex flex-col justify-between"
                  style={{ minWidth: "100%" }}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/15">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {feature.badge}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                          {idx + 1} / {total}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground leading-tight">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    {onOpenPolicy ? (
                      <button
                        onClick={() => handleCardClick(feature.policyTab)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <span>{feature.linkText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href={`/policies?tab=${feature.policyTab}`}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <span>{feature.linkText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    <div className="flex items-center gap-1.5">
                      {PRODUCT_FEATURES.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setMobileIndex(dotIdx)}
                          aria-label={`Go to feature ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all ${
                            mobileIndex === dotIdx
                              ? "w-5 bg-primary"
                              : "w-1.5 bg-border hover:bg-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Floating Arrow Buttons on Mobile */}
          <button
            onClick={handlePrev}
            aria-label="Previous feature"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur border border-border shadow-md flex items-center justify-center text-foreground hover:bg-background active:scale-95 z-10"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next feature"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 backdrop-blur border border-border shadow-md flex items-center justify-center text-foreground hover:bg-background active:scale-95 z-10"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VIEW (>= 768px): 3 to 4 items visible, scrollable */}
        {/* ========================================================= */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            className="flex gap-4 lg:gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${desktopIndex * (100 / desktopVisibleCount)}%)`,
            }}
          >
            {PRODUCT_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="flex-shrink-0 p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  style={{
                    width: `calc(${100 / desktopVisibleCount}% - ${(4 * (desktopVisibleCount - 1)) / desktopVisibleCount}px)`,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {feature.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    {onOpenPolicy ? (
                      <button
                        onClick={() => handleCardClick(feature.policyTab)}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <span>{feature.linkText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <Link
                        href={`/policies?tab=${feature.policyTab}`}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <span>{feature.linkText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      0{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: maxDesktopIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setDesktopIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  desktopIndex === dotIdx
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
