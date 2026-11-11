"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export function BrandValueBadges() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const badges = [
    {
      title: "Anti-Tarnish",
      desc: "Never fades, oxidizes, or turns green",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Shield */}
          <path d="M24 6 L38 12 V24 C38 33 24 41 24 41 C24 41 10 33 10 24 V12 Z" strokeLinecap="round" strokeLinejoin="round" fill="#FAF5EC" />
          {/* 4-point star sparkle in center */}
          <path d="M24 16 Q24 23 30 23 Q24 23 24 30 Q24 23 18 23 Q24 23 24 16 Z" fill="#C5A059" stroke="none" />
        </svg>
      ),
    },
    {
      title: "304 & 306 Grade Steel",
      desc: "Premium stainless steel indestructible core",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Steel Ingots / Pillars */}
          <rect x="10" y="24" width="28" height="12" rx="3" fill="#FAF5EC" />
          <path d="M14 24 L20 14 H34 L40 24" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="20" y1="24" x2="20" y2="36" />
          <line x1="28" y1="24" x2="28" y2="36" />
          {/* Sparkles */}
          <path d="M37 11 Q37 14 40 14 Q37 14 37 17 Q37 14 34 14 Q37 14 37 11 Z" fill="#C5A059" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Waterproof",
      desc: "Wear in shower, pool, gym & rain",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Water Droplet */}
          <path d="M24 8 C24 8 13 22 13 30 C13 36.6 17.9 41 24 41 C30.1 41 35 36.6 35 30 C35 22 24 8 24 8 Z" fill="#FAF5EC" strokeLinecap="round" strokeLinejoin="round" />
          {/* Sparkle */}
          <path d="M24 24 Q24 28 27 28 Q24 28 24 32 Q24 28 21 28 Q24 28 24 24 Z" fill="#C5A059" stroke="none" />
        </svg>
      ),
    },
    {
      title: "Hypoallergenic",
      desc: "100% nickel, lead & cadmium free",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Organic Leaf Motif */}
          <path d="M14 34 C14 34 17 21 34 14 C34 14 34 31 20 34 Z" fill="#FAF5EC" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 34 Q22 26 34 14" strokeLinecap="round" />
          <path d="M22 26 Q27 24 29 20" strokeLinecap="round" />
          <circle cx="36" cy="12" r="2" fill="#C5A059" stroke="none" />
        </svg>
      ),
    },
    {
      title: "PVD Gold Coating",
      desc: "Thick vacuum coating for enduring luster",
      icon: (
        <svg viewBox="0 0 48 48" className="w-7 h-7 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Diamond Jewel */}
          <path d="M16 14 L32 14 L40 23 L24 38 L8 23 Z" fill="#FAF5EC" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="23" x2="40" y2="23" />
          <line x1="16" y1="14" x2="24" y2="38" />
          <line x1="32" y1="14" x2="24" y2="38" />
          {/* Sparkle */}
          <path d="M38 10 Q38 13 41 13 Q38 13 38 16 Q38 13 35 13 Q38 13 38 10 Z" fill="#C5A059" stroke="none" />
        </svg>
      ),
    },
  ];

  // Auto-scroll every 3 seconds unless paused by touch or hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % badges.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, badges.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false);
      return;
    }
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 40) {
      // Swiped Left -> Next
      setActiveIndex((prev) => (prev + 1) % badges.length);
    } else if (delta < -40) {
      // Swiped Right -> Prev
      setActiveIndex((prev) => (prev - 1 + badges.length) % badges.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  return (
    <section id="brand-values" className="w-full py-8 sm:py-10 md:py-12 bg-[#FAF7F2] border-b border-[#EADBBE]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container with warm champagne luxury card styling */}
        <div className="rounded-3xl bg-[#FFFDF9] border border-[#EADBBE] shadow-[0_8px_30px_rgb(197,160,89,0.08)] p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          
          {/* MOBILE ONLY: Paginated 1-by-1 Carousel (< sm) */}
          <div
            className="sm:hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Stage Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF5EB]/80 to-[#FAF5EB]/30 border border-[#EADBBE] p-6 text-center shadow-sm min-h-[220px] flex flex-col items-center justify-center">
              {/* Header Pill: Step Counter */}
              <div className="absolute top-3 right-3 text-[10px] font-semibold text-[#8F7234] bg-[#FFFDF9] border border-[#EADBBE] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>{activeIndex + 1} of {badges.length}</span>
              </div>

              {/* Quality Content (Smooth animated fade-in on transition) */}
              <div
                key={activeIndex}
                className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300 space-y-3"
              >
                {/* Circular Gold Icon Container */}
                <div className="relative w-16 h-16 rounded-full border-[1.5px] border-[#C5A059] flex items-center justify-center p-3 bg-gradient-to-br from-[#FFFDF9] to-[#F5EBDA] shadow-[0_4px_16px_rgba(197,160,89,0.2)]">
                  <div className="absolute inset-[3px] rounded-full border border-[#DDC698]/50 pointer-events-none" />
                  {badges[activeIndex].icon}
                </div>

                <div className="space-y-1">
                  <h4 className="font-editorial text-base font-semibold tracking-wide text-[#1C1917]">
                    {badges[activeIndex].title}
                  </h4>
                  <p className="text-xs text-[#786E5E] leading-relaxed font-light max-w-[240px] mx-auto">
                    {badges[activeIndex].desc}
                  </p>
                </div>
              </div>

              {/* Prev / Next Circular Navigation Arrows */}
              <button
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex((prev) => (prev - 1 + badges.length) % badges.length);
                }}
                aria-label="Previous Quality"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#EADBBE] text-[#8F7234] hover:text-[#1C1917] hover:bg-[#FAF5EB] shadow-sm flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex((prev) => (prev + 1) % badges.length);
                }}
                aria-label="Next Quality"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFFDF9] border border-[#EADBBE] text-[#8F7234] hover:text-[#1C1917] hover:bg-[#FAF5EB] shadow-sm flex items-center justify-center transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Dot Indicators */}
            <div className="flex items-center justify-center gap-2 pt-3.5">
              {badges.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(idx);
                  }}
                  aria-label={`Go to quality ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    idx === activeIndex
                      ? "w-6 h-2 bg-[#C5A059] shadow-xs"
                      : "w-2 h-2 bg-[#DDC698]/60 hover:bg-[#C5A059]/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP & TABLET: Clean 5-in-a-row Luxury Grid (sm:) */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                {/* Circular Gold Icon Container */}
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[1.5px] border-[#C5A059] flex items-center justify-center p-3 mb-3 bg-gradient-to-br from-[#FFFDF9] to-[#F5EBDA] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(197,160,89,0.25)]">
                  {/* Inner Delicate Ring */}
                  <div className="absolute inset-[3px] rounded-full border border-[#DDC698]/50 pointer-events-none" />
                  {badge.icon}
                </div>

                {/* Title Matching Brand Card */}
                <h4 className="font-editorial text-sm lg:text-base font-semibold tracking-wide text-[#1C1917] group-hover:text-[#8F7234] transition-colors">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#786E5E] leading-tight font-light mt-1 max-w-[150px]">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 2. Elegant Pill Banner - One Line on Mobile & Desktop (No Stacking) */}
          <div className="pt-2 border-t border-[#EADBBE]/80">
            <Link
              href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-row items-center justify-between gap-2.5 sm:gap-4 px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-[#FAF5EB] hover:bg-[#F3E8D3] border border-[#C5A059]/60 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide sm:tracking-widest uppercase text-[#806631] truncate">
                <span className="text-[#C5A059] text-[10px] sm:text-xs shrink-0">✦</span>
                <span className="truncate">FREE SHIPPING ABOVE ₹999 • 5% OFF 1ST ORDER (CODE: NOOMI5)</span>
                <span className="text-[#C5A059] text-[10px] sm:text-xs hidden md:inline shrink-0">✦</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#4A171C] text-[#FAF5EB] group-hover:bg-[#360F13] text-[11px] sm:text-xs md:text-sm font-bold tracking-wider transition-colors shadow-sm shrink-0 whitespace-nowrap border border-[#C5A059]/40">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366] fill-[#25D366]" />
                <span>{storeConfig.brand.contact.phone}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
