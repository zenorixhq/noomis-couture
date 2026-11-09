"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories as initialCategories } from "@/data/mockData";
import { Category } from "@/types/store";
import { HeroEditorial } from "@/components/storefront/HeroEditorial";
import { AboutUsSection } from "@/components/storefront/AboutUsSection";
import { BrandValueBadges } from "@/components/storefront/BrandValueBadges";
import { CustomerReviewsWithVideos } from "@/components/storefront/CustomerReviewsWithVideos";
import { InstagramReelSection } from "@/components/storefront/InstagramReelSection";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const [categoryItems, setCategoryItems] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("noomis_categories");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return initialCategories;
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryItems(data);
          try {
            sessionStorage.setItem("noomis_categories", JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch((err) => console.error("Error fetching dynamic categories:", err));
  }, []);

  return (
    <div className="w-full bg-[#FAF7F2] overflow-x-hidden">
      {/* 1. Hero Section (Enclosed within entire screen window, full scroll) */}
      <HeroEditorial />

      {/* 2. Curated Catalog / Shop by Category Grid (Next section immediately following Hero) */}
      <section id="categories" className="w-full py-12 sm:py-16 bg-[#FAF7F2] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <ScrollReveal variant="fade-up">
            <div className="text-center space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#AF8A4A] font-semibold block">
                CURATED COLLECTIONS
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-[#4A171C]">
                Shop by Category
              </h2>
              <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-2 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {categoryItems.slice(0, 6).map((cat, idx) => (
              <ScrollReveal
                key={cat.id}
                delay={idx * 45}
                variant="fade-up"
                className="h-full"
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-[#EADBBE] shadow-sm bg-[#FFFDF9] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(74,23,28,0.18)] transition-all duration-500 ease-out"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white transition-opacity duration-300">
                    {idx === 0 && (
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#EADBBE] font-medium tracking-wider uppercase">
                          🔥 Trending
                        </span>
                        <span className="text-[9px] font-bold bg-[#C5A059] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Hot
                        </span>
                      </div>
                    )}
                    <h3 className="font-editorial text-sm sm:text-base font-semibold tracking-wide text-white group-hover:text-[#F3DFB0] transition-colors leading-snug mt-0.5">
                      {cat.name.replace(/\s*Collection/gi, "").trim()}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* View All Categories CTA Button */}
          <div className="text-center pt-2 sm:pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#4A171C] text-[#FAF5EB] hover:bg-[#381014] hover:shadow-lg font-semibold text-xs tracking-widest uppercase transition-all shadow-sm group border border-[#D4AF37]/30"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. About Us Section with smooth luxury fade-in */}
      <ScrollReveal variant="fade-up">
        <AboutUsSection />
      </ScrollReveal>

      {/* 4. Five Signature Brand Badges & WhatsApp Direct Contact Banner */}
      <ScrollReveal variant="fade-up">
        <BrandValueBadges />
      </ScrollReveal>

      {/* 5. In Their Words: Customer Feedback Screenshots & Video Reels */}
      <ScrollReveal variant="fade-up">
        <CustomerReviewsWithVideos />
      </ScrollReveal>

      {/* 6. Follow The House (Instagram Video Reels) */}
      <ScrollReveal variant="fade-up">
        <InstagramReelSection />
      </ScrollReveal>
    </div>
  );
}
