"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "compact" | "emblem-only";
  showTagline?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export function BrandLogo({
  variant = "full",
  showTagline = true,
  className = "",
  theme = "light",
}: BrandLogoProps) {
  const isDark = theme === "dark";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 group select-none ${className}`}
      aria-label="Noomi's Couture Home"
    >
      {/* 1. Official Noomi's Couture Emblem / Medallion */}
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
        {isDark ? (
          <div className="w-full h-full p-0.5 rounded-full border border-[#D4AF37]/50 bg-[#350E13] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/noomis-emblem-transparent.png"
              alt="Noomi's Couture Emblem"
              className="w-7 h-7 sm:w-8.5 sm:h-8.5 object-contain"
            />
          </div>
        ) : (
          <img
            src="/images/noomis-medallion.png"
            alt="Noomi's Couture Emblem"
            className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* 2. Official Vertical Gold Divider Line (from Logo) */}
      {variant !== "emblem-only" && (
        <div
          className={`h-7 sm:h-8.5 w-[1.5px] rounded-full flex-shrink-0 transition-opacity ${
            isDark ? "bg-[#D4AF37]/70" : "bg-[#C5A059]/80"
          }`}
        />
      )}

      {/* 3. Official Brand Wordmark & Tagline: "Noomi's Couture" & "WEAR YOUR CONFIDENCE" */}
      {variant !== "emblem-only" && (
        <div className="flex flex-col text-left justify-center">
          <span
            className={`font-serif-luxury text-base sm:text-lg md:text-[1.35rem] font-bold tracking-tight leading-none transition-colors ${
              isDark
                ? "text-[#F8E7BE] group-hover:text-[#FFFFFF]"
                : "text-[#4A171C] group-hover:text-[#6B1B24]"
            }`}
          >
            Noomi&apos;s Couture
          </span>

          {showTagline && (
            <span
              className={`text-[7.5px] sm:text-[9px] md:text-[9.5px] tracking-[0.24em] uppercase font-semibold mt-1 transition-colors ${
                isDark ? "text-[#D4AF37]" : "text-[#A87C38]"
              }`}
            >
              WEAR YOUR CONFIDENCE
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
