"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/store";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, getProductPrices } from "@/lib/utils";
import { Heart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isStoreInWishlist = useCartStore((s) =>
    s.wishlist.includes(product.id) ||
    (product.slug ? s.wishlist.includes(product.slug) : false) ||
    s.wishlist.some(
      (id) =>
        Boolean(id) &&
        (id.toLowerCase() === product.id.toLowerCase() ||
          (product.slug && id.toLowerCase() === product.slug.toLowerCase()))
    )
  );

  // Optimistic state for 0ms instantaneous visual feedback on click
  const [optimisticWishlist, setOptimisticWishlist] = useState<boolean | null>(null);
  const isInWishlist = optimisticWishlist !== null ? optimisticWishlist : isStoreInWishlist;

  useEffect(() => {
    setOptimisticWishlist(null);
  }, [isStoreInWishlist]);

  const { regularPrice, salePrice, effectivePrice } = getProductPrices(
    product,
    selectedCurrency
  );

  const maxStock = product.inStock !== false ? (product.stockCount !== undefined ? product.stockCount : 10) : 0;
  const isOutOfStock = maxStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = !isInWishlist;
    setOptimisticWishlist(nextVal);
    toggleWishlist(product.id);
  };

  const displayImage =
    Array.isArray(product.images) && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : typeof product.images === "string" && (product.images as string).trim()
      ? (product.images as string).trim()
      : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="group relative flex flex-col bg-transparent">
      {/* Product Image Container with Top-Right Floating Wishlist Icon */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-stone-200/50 shadow-2xs group-hover:shadow-md transition-shadow duration-300">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
              isOutOfStock ? "opacity-70 grayscale-[25%]" : ""
            }`}
          />
        </Link>

        {/* Floating Wishlist Heart Button in Top-Right Corner (Exact Reference Style) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isInWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10 border border-stone-200/60"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist ? "fill-rose-500 text-rose-500" : "text-stone-700 hover:text-rose-600"
            }`}
          />
        </button>

        {/* Out of Stock Pill Badge */}
        {isOutOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-stone-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-2 sm:pt-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#4A171C] transition-colors">
            <h3 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-1 leading-snug" title={product.title}>
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm sm:text-base font-bold text-stone-950">
              {formatPrice(effectivePrice, selectedCurrency)}
            </span>
            {salePrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(regularPrice, selectedCurrency)}
              </span>
            )}
          </div>
        </div>

        {/* Full-Width Add To Cart Button (Exact Reference Style) */}
        <button
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          className={`w-full py-2.5 sm:py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 mt-2.5 flex items-center justify-center gap-1.5 active:scale-[0.98] ${
            isOutOfStock
              ? "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200"
              : isAdded
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-[#2B2725] hover:bg-[#1A1817] text-white shadow-sm hover:shadow"
          }`}
        >
          {isOutOfStock ? (
            <span>Out of Stock</span>
          ) : isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <span>ADD TO CART</span>
          )}
        </button>
      </div>
    </div>
  );
}
