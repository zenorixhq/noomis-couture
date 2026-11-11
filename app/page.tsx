"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories as initialCategories } from "@/data/mockData";
import { Category } from "@/types/store";
import { HeroEditorial } from "@/components/storefront/HeroEditorial";
import { FeaturedProductsGrid } from "@/components/storefront/FeaturedProductsGrid";
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

      {/* 2. Curated Catalog / Shop by Category (Circle Items - All Categories) */}
      <section id="categories" className="w-full py-10 sm:py-14 bg-[#FAF7F2] scroll-mt-20 border-b border-[#EADBBE]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <ScrollReveal variant="fade-up">
            <div className="text-center space-y-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#AF8A4A] font-semibold block">
                CURATED COLLECTIONS
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#4A171C]">
                Shop by Category
              </h2>
              <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-2 rounded-full" />
            </div>
          </ScrollReveal>

          {/* Circle Items Grid & Horizontal Carousel on Mobile (Showing All Categories) */}
          <div className="relative">
            <div className="flex sm:flex-wrap items-center justify-start sm:justify-center gap-4 sm:gap-6 md:gap-7 overflow-x-auto pb-4 pt-2 px-2 no-scrollbar scroll-smooth">
              {categoryItems.map((cat, idx) => (
                <ScrollReveal
                  key={cat.id || cat.slug || idx}
                  delay={idx * 30}
                  variant="fade-up"
                  className="flex-shrink-0"
                >
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="group flex flex-col items-center w-20 sm:w-24 md:w-28 text-center transition-transform hover:-translate-y-1 duration-300"
                  >
                    {/* Circle Image with Luxury Gold Gradient Ring */}
                    <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-[#AF8A4A] via-[#EADBBE] to-[#4A171C] group-hover:from-[#C5A059] group-hover:to-[#7A1E27] transition-all duration-300 shadow-sm group-hover:shadow-[0_8px_20px_rgba(74,23,28,0.18)]">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white border-2 border-[#FAF7F2]">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                      </div>
                      {idx === 0 && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full shadow-sm tracking-wider pointer-events-none">
                          Hot
                        </span>
                      )}
                    </div>

                    {/* Category Label */}
                    <span className="font-editorial text-xs sm:text-sm font-medium text-[#4A171C] group-hover:text-[#AF8A4A] transition-colors mt-2 sm:mt-2.5 leading-tight line-clamp-2 max-w-[80px] sm:max-w-[95px]">
                      {cat.name.replace(/\s*Collection/gi, "").trim()}
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* View All Categories Link */}
          <div className="text-center pt-1">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AF8A4A] hover:text-[#4A171C] font-semibold transition-colors group"
            >
              <span>Explore All Categories ({categoryItems.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Products: Featured & Best Sellers First (3*2 Products Grid) */}
      <FeaturedProductsGrid />

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
