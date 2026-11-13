"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { categories as defaultCategories } from "@/data/mockData";
import { Category } from "@/types/store";
import { useProductStore } from "@/store/useProductStore";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  SlidersHorizontal,
  X,
  Search,
  ArrowDown,
} from "lucide-react";

const BATCH_SIZE = 12;

function matchesCategory(
  product: { category: string; isNewArrival?: boolean },
  targetSlug: string
): boolean {
  if (targetSlug === "all") return true;
  if (targetSlug === "new-arrivals") {
    return Boolean(product.isNewArrival || product.category === "new-arrivals");
  }
  const pCat = (product.category || "").trim().toLowerCase();
  const tSlug = (targetSlug || "").trim().toLowerCase();

  if (tSlug === "bangles" || tSlug === "bangles-kada") {
    return pCat === "bangles" || pCat === "bangles-kada" || pCat.includes("bangle") || pCat.includes("kada");
  }
  if (tSlug === "necklaces" || tSlug === "necklaces-and-chains") {
    return pCat === "necklaces" || pCat === "necklaces-and-chains" || pCat.includes("necklace") || pCat.includes("chain");
  }
  if (tSlug === "bracelets") {
    return pCat === "bracelets" || pCat.includes("bracelet");
  }
  if (tSlug === "pendants") {
    return pCat === "pendants" || pCat.includes("pendant");
  }
  if (tSlug === "watches") {
    return pCat === "watches" || pCat.includes("watch");
  }
  if (tSlug === "rings") {
    return pCat === "rings" || pCat.includes("ring");
  }
  if (tSlug === "hand-chains" || tSlug === "hip-chains") {
    return pCat === "hand-chains" || pCat === "hip-chains" || pCat.includes("hand-chain") || pCat.includes("chain");
  }
  if (tSlug === "anklets") {
    return pCat === "anklets" || pCat.includes("anklet");
  }
  if (tSlug === "earrings") {
    return pCat === "earrings" || pCat.includes("earring");
  }
  if (tSlug === "mangalsutra") {
    return pCat === "mangalsutra" || pCat.includes("mangalsutra");
  }
  return pCat === tSlug;
}

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const hasLoaded = useProductStore((s) => s.hasLoaded);
  const [categoryList, setCategoryList] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("noomis_categories");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return defaultCategories;
  });

  // Sync with database on mount (force fresh to show newly added products immediately)
  useEffect(() => {
    fetchProducts(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryList(data);
          try {
            sessionStorage.setItem("noomis_categories", JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [fetchProducts]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset batch count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [selectedCategory, searchTerm, priceRange, inStockOnly, sortBy]);

  // Sync category if URL searchParams changes
  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") || "all");
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (!matchesCategory(p, selectedCategory)) {
            return false;
          }
        }

        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchCategory && !matchTags) return false;
        }

        // Price filter
        const currentPrice = p.salePrice || p.price;
        if (priceRange === "under200" && currentPrice >= 200) return false;
        if (priceRange === "200to350" && (currentPrice < 200 || currentPrice > 350)) return false;
        if (priceRange === "over350" && currentPrice <= 350) return false;

        // In Stock filter
        if (inStockOnly && (!p.inStock || p.stockCount === 0)) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "rating") return b.rating - a.rating;

        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        if (sortBy === "newest") {
          if (timeB !== timeA) return timeB - timeA;
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        }

        // Default "featured":
        // 1. Newly created pieces from recent days always surface at the top
        const isRecentA = timeA > Date.now() - 14 * 86400 * 1000;
        const isRecentB = timeB > Date.now() - 14 * 86400 * 1000;
        if (isRecentA && !isRecentB) return -1;
        if (!isRecentA && isRecentB) return 1;
        if (isRecentA && isRecentB && timeB !== timeA) return timeB - timeA;

        // 2. Signature Couture items and Featured items rank next
        const scoreA = (a.inSignatureCouture ? 3 : 0) + (a.featured ? 2 : 0) + (a.isBestSeller ? 1 : 0);
        const scoreB = (b.inSignatureCouture ? 3 : 0) + (b.featured ? 2 : 0) + (b.isBestSeller ? 1 : 0);
        if (scoreB !== scoreA) return scoreB - scoreA;

        // 3. Tie-break by newest creation timestamp
        if (timeB !== timeA) return timeB - timeA;
        return 0;
      });
  }, [products, selectedCategory, searchTerm, priceRange, inStockOnly, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Auto-load next batch when scrolling down to sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredProducts.length));
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  const loadMoreRows = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredProducts.length));
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange("all");
    setInStockOnly(false);
    setSortBy("featured");
    setVisibleCount(BATCH_SIZE);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchTerm !== "" ||
    priceRange !== "all" ||
    inStockOnly;

  const sortedCategoryList = useMemo(() => {
    return [...categoryList].sort((a, b) => {
      const orderA = typeof a.order === "number" ? a.order : 999;
      const orderB = typeof b.order === "number" ? b.order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [categoryList]);

  const currentCategoryName = useMemo(() => {
    if (selectedCategory === "all") return "All Jewelry";
    const found = categoryList.find((c) => c.slug === selectedCategory);
    return found ? found.name.replace(/\s*Collection/gi, "").trim() : "Jewelry";
  }, [selectedCategory, categoryList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {/* 1. Category Header & Count (Exact Reference Style: e.g. "Jhumkas" / "48 pieces") */}
      <div className="space-y-0.5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1C1917]">
          {currentCategoryName}
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-normal">
          {filteredProducts.length} pieces
        </p>
      </div>

      {/* 2. Horizontal Category Filter Pills (Exact Reference Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-[#2B2725] text-white shadow-xs"
              : "bg-stone-100/90 hover:bg-stone-200/70 text-stone-600 border border-stone-200/60"
          }`}
        >
          All
        </button>

        {sortedCategoryList.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? "bg-[#2B2725] text-white shadow-xs"
                : "bg-stone-100/90 hover:bg-stone-200/70 text-stone-600 border border-stone-200/60"
            }`}
          >
            {cat.name.replace(/\s*Collection/gi, "").trim()}
          </button>
        ))}
      </div>

      {/* 3. Search Bar & Filters/Sort Toolbar (Exact Reference Style) */}
      <div className="flex items-center justify-between gap-3 pt-1 pb-2 border-b border-stone-200/60">
        {/* Minimal Search Input */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search jewelry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-6 py-1.5 text-xs sm:text-sm bg-transparent placeholder:text-stone-400 text-stone-800 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Filters & Filters & Sort Action Button */}
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#C5A059] hover:text-[#AF8A4A] underline text-xs font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}

          <button
            onClick={() => setFilterDrawerOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterDrawerOpen || hasActiveFilters
                ? "bg-[#2B2725] text-white shadow-xs"
                : "bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-50 shadow-2xs"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters &amp; Sort</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter & Sort Controls */}
      {filterDrawerOpen && (
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Filters &amp; Sort
            </h4>
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sort */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-1.5">
                Price
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under200">Under ₹200</option>
                <option value="200to350">₹200 to ₹350</option>
                <option value="over350">Over ₹350</option>
              </select>
            </div>

            {/* In Stock Only */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer text-xs font-medium text-stone-800 hover:bg-stone-100 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#2B2725] rounded"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Grid: 2 Columns on Mobile (Exact Match to Uploaded Screenshot) */}
      {!hasLoaded && products.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-stone-200/60 animate-pulse border border-stone-200/40"
            />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-stone-200 bg-white p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-medium text-stone-800">No pieces match your filters</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try choosing another category or clearing your search term.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-[#2B2725] text-white text-xs font-medium hover:bg-black transition-colors"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 5. Infinite Scroll Sentinel & Batch Control */}
          {visibleCount < filteredProducts.length ? (
            <div className="pt-4 pb-8 flex flex-col items-center justify-center space-y-3">
              <div ref={sentinelRef} className="h-4 w-full pointer-events-none" />

              <div className="text-xs text-stone-400 font-medium">
                Showing {displayedProducts.length} of {filteredProducts.length} pieces
              </div>

              {/* Progress bar */}
              <div className="w-40 h-1 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2B2725] transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (displayedProducts.length / filteredProducts.length) * 100)}%`,
                  }}
                />
              </div>

              <button
                onClick={loadMoreRows}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-medium shadow-2xs transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>Load More Pieces</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-600" />
              </button>
            </div>
          ) : (
            <div className="py-8 text-center border-t border-stone-200/50 text-xs text-stone-400">
              You&apos;ve viewed all {filteredProducts.length} pieces
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-stone-400">Loading collection...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
