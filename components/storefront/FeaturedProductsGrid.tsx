"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { ArrowRight, Sparkles, Flame, Award } from "lucide-react";
import { Product } from "@/types/store";

export function FeaturedProductsGrid() {
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const hasLoaded = useProductStore((s) => s.hasLoaded);

  const [activeTab, setActiveTab] = useState<"all" | "featured" | "bestseller">("all");

  useEffect(() => {
    if (!hasLoaded) {
      fetchProducts();
    }
  }, [hasLoaded, fetchProducts]);

  // Sort and filter to exactly 6 products (3*2 grid) with Featured and Best Sellers first
  const displayProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    if (activeTab === "featured") {
      const featured = products.filter((p) => p.featured);
      // Backfill with best sellers or in-stock products if fewer than 6
      const backfill = products.filter((p) => !p.featured);
      return [...featured, ...backfill].slice(0, 6);
    }

    if (activeTab === "bestseller") {
      const bestSellers = products.filter((p) => p.isBestSeller);
      // Backfill with featured or in-stock products if fewer than 6
      const backfill = products.filter((p) => !p.isBestSeller);
      return [...bestSellers, ...backfill].slice(0, 6);
    }

    // Default "all": Rank products so that Featured and Best Sellers appear first
    const ranked = [...products].sort((a, b) => {
      // Score: Featured (2) + BestSeller (1)
      const scoreA = (a.featured ? 2 : 0) + (a.isBestSeller ? 1 : 0);
      const scoreB = (b.featured ? 2 : 0) + (b.isBestSeller ? 1 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      // Secondary preference for in-stock
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      return 0;
    });

    return ranked.slice(0, 6);
  }, [products, activeTab]);

  return (
    <section id="featured-products" className="w-full py-12 sm:py-16 md:py-20 bg-[#FAF7F2] border-b border-[#EADBBE]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#AF8A4A] font-semibold block">
              SIGNATURE COUTURE
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#4A171C]">
              Featured &amp; Best Sellers
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-2 rounded-full" />
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-[#4A171C] text-[#FAF5EB] shadow-md border border-[#4A171C]"
                  : "bg-[#FFFDF9] text-stone-600 hover:text-[#4A171C] hover:bg-[#F0E6D2]/60 border border-[#EADBBE]"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>All Top Picks</span>
            </button>

            <button
              onClick={() => setActiveTab("featured")}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "featured"
                  ? "bg-[#4A171C] text-[#FAF5EB] shadow-md border border-[#4A171C]"
                  : "bg-[#FFFDF9] text-stone-600 hover:text-[#4A171C] hover:bg-[#F0E6D2]/60 border border-[#EADBBE]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab("bestseller")}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeTab === "bestseller"
                  ? "bg-[#4A171C] text-[#FAF5EB] shadow-md border border-[#4A171C]"
                  : "bg-[#FFFDF9] text-stone-600 hover:text-[#4A171C] hover:bg-[#F0E6D2]/60 border border-[#EADBBE]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Best Sellers</span>
            </button>
          </div>
        </ScrollReveal>

        {/* 3 * 2 Product Grid (Exactly 6 Products) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
          {displayProducts.map((product, idx) => (
            <ScrollReveal
              key={product.id || product.slug || idx}
              delay={idx * 50}
              variant="fade-up"
              className="h-full"
            >
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA to view all products */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="text-center pt-2 sm:pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#4A171C] text-[#FAF5EB] hover:bg-[#381014] hover:shadow-xl font-semibold text-xs tracking-widest uppercase transition-all shadow-md group border border-[#D4AF37]/40"
            >
              <span>Explore All Pieces {products.length > 0 ? `(${products.length})` : ""}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#D4AF37]" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
