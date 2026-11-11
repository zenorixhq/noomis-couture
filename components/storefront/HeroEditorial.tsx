"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroEditorial() {
  return (
    <section className="relative w-full h-[52vh] min-h-[370px] max-h-[480px] md:h-screen md:h-[100dvh] md:max-h-screen md:min-h-0 overflow-hidden bg-[#20050A]">
      {/* 1. Main Visual Canvas */}
      <div className="relative w-full h-full flex flex-col justify-between">
        {/* Responsive Hero Imagery: Mobile Portrait & Desktop Landscape */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source
            media="(max-width: 767px)"
            srcSet="/images/noomis-hero-mobile.jpg"
          />
          <img
            src="/images/noomis-hero-velvet.jpg"
            alt="Noomi's Couture - Where Every Piece Tells a Story. Luxury Jewelry Collection on deep red velvet"
            className="w-full h-full object-cover object-center pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-transparent md:bg-gradient-to-r md:from-black/85 md:via-black/30 md:to-transparent pointer-events-none" />

        {/* Top subtle vignette for glass navbar legibility */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 md:h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent pointer-events-none" />

        {/* 2. Editorial Typography & Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 my-auto pt-16 sm:pt-20 md:pt-28 pb-10 sm:pb-16 md:pb-20">
          <div className="max-w-xl lg:max-w-2xl text-left">
            {/* Editorial Headline */}
            <h1 className="font-editorial text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-normal text-white tracking-tight leading-[1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
              <span className="block font-normal">
                WHERE EVERY{" "}
                <span className="italic font-light font-editorial">PIECE</span>
              </span>
              <span className="block font-normal mt-1 sm:mt-1.5">
                TELLS A STORY.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-2.5 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base text-white/90 font-light max-w-[280px] xs:max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed drop-shadow-md">
              Handcrafted with radiant 18K gold finish, composed for everyday luxury and timeless confidence.
            </p>

            {/* CTA Button (Hidden on mobile per request, visible on tablet & desktop) */}
            <div className="mt-4 sm:mt-6 md:mt-8 hidden sm:block">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 md:py-4 rounded-full bg-[#184E44] hover:bg-[#133F37] text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_10px_28px_rgba(24,78,68,0.45)] hover:shadow-[0_14px_36px_rgba(24,78,68,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group border border-emerald-300/25"
              >
                <span>Discover the Collection</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Bottom Organic Curved Wave Transition into #FAF7F2 Warm Ivory Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-6 sm:h-10 md:h-16 lg:h-20 block preserve-3d"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C340,74 800,78 1440,16 L1440,80 L0,80 Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
