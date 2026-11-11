"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, getProductPrices } from "@/lib/utils";
import { X, Star, ShoppingBag, Plus, Minus, ArrowRight, ChevronDown } from "lucide-react";
import { getProductSizeInfo } from "@/lib/productSizes";

export function QuickViewModal() {
  const product = useCartStore((s) => s.quickViewProduct);
  const closeQuickView = useCartStore((s) => s.closeQuickView);
  const addItem = useCartStore((s) => s.addItem);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const sizeInfo = getProductSizeInfo(product || undefined);
  const [selectedSize, setSelectedSize] = useState<string>(() => sizeInfo?.defaultSize || "");

  useEffect(() => {
    if (sizeInfo) {
      setSelectedSize(sizeInfo.defaultSize);
    }
  }, [product?.id]);

  if (!product) return null;

  const effectiveSize = selectedSize || sizeInfo?.defaultSize || "";

  const hasSpecificSizeStock = Boolean(
    sizeInfo &&
    !sizeInfo.isAdjustableOnly &&
    sizeInfo.sizeStock &&
    effectiveSize &&
    effectiveSize in sizeInfo.sizeStock
  );

  const selectedSizeInventory = hasSpecificSizeStock
    ? Math.max(0, sizeInfo!.sizeStock![effectiveSize])
    : undefined;

  const isCurrentSizeOutOfStock = selectedSizeInventory !== undefined && selectedSizeInventory <= 0;

  const overallStock = product.inStock !== false ? (product.stockCount !== undefined ? product.stockCount : 10) : 0;
  const isOverallOutOfStock = overallStock <= 0;

  const isOutOfStock = isOverallOutOfStock || isCurrentSizeOutOfStock;

  const effectiveMaxStock = isOutOfStock
    ? 0
    : selectedSizeInventory !== undefined
    ? selectedSizeInventory
    : overallStock;

  const { regularPrice, salePrice, effectivePrice } = getProductPrices(
    product,
    selectedCurrency
  );

  // Initialize default options
  const currentOptions = { ...selectedOptions };
  if (product.variantAttributes) {
    product.variantAttributes.forEach((attr) => {
      if (!currentOptions[attr.name] && attr.options.length > 0) {
        currentOptions[attr.name] = attr.options[0];
      }
    });
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const combinedOptions: { [key: string]: string } = { ...currentOptions };
    if (sizeInfo && effectiveSize) {
      combinedOptions[sizeInfo.label] = effectiveSize;
    }

    const hasVariants = Object.keys(combinedOptions).length > 0;
    const variantId = hasVariants
      ? Object.entries(combinedOptions)
          .map(([k, v]) => `${k}-${v.replace(/\s+/g, "_")}`)
          .join("_")
      : undefined;
    const variantName = hasVariants
      ? Object.entries(combinedOptions)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" / ")
      : undefined;

    addItem(
      product,
      quantity,
      hasVariants
        ? {
            id: variantId || "standard",
            name: variantName || "Standard",
            options: combinedOptions,
          }
        : undefined
    );
    closeQuickView();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeQuickView}
      />

      <div data-lenis-prevent className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background border border-border text-foreground transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image - Clean Framing without cropping */}
          <div className="aspect-square bg-[#FAF8F5] dark:bg-stone-900/40 relative flex items-center justify-center p-4 sm:p-6">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain object-center drop-shadow-md"
            />
          </div>

          {/* Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {product.category}
                  </span>
                  {isOutOfStock ? (
                    <span className="bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Out of Stock
                    </span>
                  ) : effectiveMaxStock <= 3 ? (
                    <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Only {effectiveMaxStock} Left
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mt-1">
                  {product.title}
                </h3>

                {product.rating && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-current" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground">
                  {formatPrice(effectivePrice, selectedCurrency)}
                </span>
                {salePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(regularPrice, selectedCurrency)}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {product.description}
              </p>

              {/* Ring / Bangle Dedicated Sizing (Adjustable vs Specific Sizes) */}
              {sizeInfo && (
                <div className="space-y-1.5 p-2.5 rounded-lg bg-muted/30 border border-border/80">
                  <div className="flex justify-between items-center text-xs">
                    <label htmlFor="quickview-size-select" className="font-semibold text-foreground">
                      {sizeInfo.label}: <span className="font-bold text-primary">{selectedSize || sizeInfo.defaultSize}</span>
                    </label>
                  </div>
                  {sizeInfo.isAdjustableOnly ? (
                    <p className="text-[11px] text-muted-foreground pt-0.5">
                      ✨ {sizeInfo.type === "ring" ? "Adjustable comfort band fits all finger sizes." : "Adjustable open cuff fits all wrist sizes."}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <select
                          id="quickview-size-select"
                          value={effectiveSize}
                          onChange={(e) => {
                            setSelectedSize(e.target.value);
                            setQuantity(1);
                          }}
                          className="w-full appearance-none px-3 py-2 text-xs font-semibold rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none transition-all pr-8 cursor-pointer shadow-sm hover:border-primary/50"
                        >
                          {sizeInfo.options.map((opt) => {
                            const optStock = sizeInfo.sizeStock?.[opt];
                            const isOptOut = optStock !== undefined && optStock <= 0;
                            return (
                              <option key={opt} value={opt}>
                                {opt} {isOptOut ? "— (Out of Stock)" : optStock !== undefined ? `(${optStock} in stock)` : ""}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {isCurrentSizeOutOfStock ? (
                        <p className="text-[11px] text-amber-600 font-medium">
                          ⚠️ {effectiveSize} is currently out of stock. Please select another size.
                        </p>
                      ) : selectedSizeInventory !== undefined && selectedSizeInventory <= 3 ? (
                        <p className="text-[11px] text-amber-600 font-medium">
                          ✨ Only {selectedSizeInventory} left in {effectiveSize}!
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Other Variant Attribute Selectors */}
              {product.variantAttributes
                ?.filter((attr) => !/size/i.test(attr.name))
                .map((attr) => (
                  <div key={attr.name} className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      {attr.name}: <span className="font-normal text-muted-foreground">{currentOptions[attr.name]}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {attr.options.map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setSelectedOptions({ ...currentOptions, [attr.name]: option })
                          }
                          className={`px-3 py-1 text-xs rounded-md font-medium border transition-all ${
                            currentOptions[attr.name] === option
                              ? "border-primary bg-primary text-primary-foreground font-semibold"
                              : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Quantity */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Quantity</span>
                  {isCurrentSizeOutOfStock ? (
                    <span className="text-amber-600 font-semibold text-[11px]">Size Out of Stock</span>
                  ) : isOverallOutOfStock ? (
                    <span className="text-destructive font-semibold text-[11px]">Out of Stock</span>
                  ) : effectiveMaxStock <= 3 ? (
                    <span className="text-amber-600 font-semibold text-[11px]">Only {effectiveMaxStock} left</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold text-[11px]">In Stock ({effectiveMaxStock} units)</span>
                  )}
                </div>
                <div className="flex items-center w-28 border border-border rounded-lg bg-muted/20">
                  <button
                    disabled={isOutOfStock || quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-foreground">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    disabled={isOutOfStock || quantity >= effectiveMaxStock}
                    onClick={() => setQuantity(Math.min(effectiveMaxStock, quantity + 1))}
                    className="p-2 hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 mt-6 border-t border-border space-y-2.5">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  isOutOfStock
                    ? "bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed border border-border opacity-70"
                    : "bg-[#4A171C] text-[#FAF5EB] hover:bg-[#381014] border border-[#D4AF37]/30"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isCurrentSizeOutOfStock
                    ? `${effectiveSize} Out of Stock`
                    : isOverallOutOfStock
                    ? "Out of Stock / Sold Out"
                    : "Add to Bag"}
                </span>
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={closeQuickView}
                className="w-full py-2.5 px-4 rounded-xl border border-border text-foreground hover:bg-muted font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
