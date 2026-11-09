"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice, calculateDiscountPercent, getProductPrices } from "@/lib/utils";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Ruler,
  AlertCircle,
  Video,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";
import { getProductSizeInfo } from "@/lib/productSizes";
import { Product } from "@/types/store";

interface ProductDetailClientProps {
  initialProduct: Product | null;
  allProducts: Product[];
  rawSlug?: string;
}

export function ProductDetailClient({
  initialProduct,
  allProducts: serverProducts,
  rawSlug = "",
}: ProductDetailClientProps) {
  const router = useRouter();
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);

  // Zustand client store
  const storeProducts = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    fetchProducts().finally(() => {
      setHasAttemptedFetch(true);
    });
  }, [fetchProducts]);

  const effectiveProducts = storeProducts && storeProducts.length > 0 ? storeProducts : serverProducts;

  const cleanSlug = decodeURIComponent(rawSlug || initialProduct?.slug || "").toLowerCase().trim();

  // Smart matching: exact slug, singular/plural variations, ID, or hyphen variations
  const matchedFromStore = useMemo(() => {
    if (!cleanSlug) return null;
    return effectiveProducts.find((p) => {
      const pSlug = (p.slug || "").toLowerCase().trim();
      const pId = (p.id || "").toLowerCase().trim();
      if (pSlug === cleanSlug || pId === cleanSlug) return true;
      if (cleanSlug.endsWith("s") && pSlug === cleanSlug.slice(0, -1)) return true;
      if (!cleanSlug.endsWith("s") && pSlug === cleanSlug + "s") return true;
      if (pSlug.replace(/[-_]/g, "") === cleanSlug.replace(/[-_]/g, "")) return true;
      return false;
    });
  }, [cleanSlug, effectiveProducts]);

  const product = matchedFromStore || initialProduct;

  // Keep address bar in sync if matched via plural alias (e.g. /flower-earrings -> /flower-earring)
  useEffect(() => {
    if (product && product.slug && product.slug !== rawSlug && typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", `/products/${product.slug}`);
      } catch (e) {}
    }
  }, [product, rawSlug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const isInWishlist = useCartStore((s) => {
    if (!product) return false;
    return (
      s.wishlist.includes(product.id) ||
      (product.slug ? s.wishlist.includes(product.slug) : false)
    );
  });
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);

  useEffect(() => {
    if (product) {
      const info = getProductSizeInfo(product);
      if (info) {
        setSelectedSize(info.defaultSize);
      }
    }
  }, [product?.id]);

  if (!product) {
    if (!hasAttemptedFetch && effectiveProducts.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-block p-4 rounded-full bg-[#FAF5EB] text-[#C5A059] mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <p className="font-editorial text-xl text-[#1C1917]">Loading piece details...</p>
        </div>
      );
    }

    // Graceful, branded fallback UI when piece is not in the live catalog
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 sm:py-28 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF5EB] text-[#C5A059] mx-auto flex items-center justify-center border border-[#EADBBE]">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl text-foreground font-bold">
            Piece Not Found
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The piece you requested is currently unavailable or may have been renamed in our live catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase hover:bg-primary/90 transition-all shadow-sm"
          >
            Explore All Jewelry
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-xs tracking-wider uppercase hover:bg-muted transition-all"
          >
            Return Home
          </Link>
        </div>

        {effectiveProducts.length > 0 && (
          <div className="pt-12 border-t border-border mt-12 text-left">
            <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-6 text-center">
              Popular Everyday Luxury Pieces
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {effectiveProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const sizeInfo = getProductSizeInfo(product);

  // Initialize variant defaults if needed
  const currentOptions = { ...selectedOptions };
  if (product.variantAttributes) {
    product.variantAttributes.forEach((attr) => {
      if (!currentOptions[attr.name] && attr.options.length > 0) {
        currentOptions[attr.name] = attr.options[0];
      }
    });
  }

  const { regularPrice, salePrice, effectivePrice, discountPercent, isQatar } = getProductPrices(
    product,
    selectedCurrency
  );

  const effectiveSize = selectedSize || sizeInfo?.defaultSize || "";

  // Check if size inventory is explicitly defined
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

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Combine standard variant options with selected size
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

    openCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    router.push("/checkout");
  };

  const handleDirectWhatsAppOrder = () => {
    const combinedOptions: { [key: string]: string } = { ...currentOptions };
    if (sizeInfo && effectiveSize) {
      combinedOptions[sizeInfo.label] = effectiveSize;
    }

    const selectedVariantSummary = Object.entries(combinedOptions)
      .map(([k, v]) => `• *${k}:* *${v}*`)
      .join("\n");

    const phone = storeConfig.brand.contact.whatsappNumber;
    const itemTotalFormatted = formatPrice(effectivePrice * quantity, selectedCurrency);

    let greetingMessage = "";
    if (isOutOfStock) {
      greetingMessage = `Hello Noomi's Couture! I am inquiring about *${product.title}* in *${effectiveSize || "this size"}*, which is currently out of stock on your website. Could you please notify me when it's back in stock or if custom piece sizing is available? Thank you! 💖`;
    } else {
      greetingMessage = isQatar
        ? "I want to order this piece from your website! Please confirm availability and share payment/delivery details for Qatar (Free Delivery). Thank you! 💖"
        : "I want to order this piece from your website! Please confirm availability and share your *UPI QR code* so I can pay and confirm my delivery. Thank you! 💖";
    }

    const message = `━━━━━━━━━━━━━━━━━━━━━
✨ *G L E A M N E S T* ✨
_${isOutOfStock ? "Size Restock & Custom Inquiry" : "Instant Order Inquiry"}_
━━━━━━━━━━━━━━━━━━━━━

💍 *SELECTED PIECE*
• *Title:* *${product.title}*
${selectedVariantSummary ? `${selectedVariantSummary}\n` : ""}• *Quantity:* ${quantity}
${isOutOfStock ? `• *Status:* ⚠️ *Size Currently Out of Stock*\n` : `• *Item Total:* *${itemTotalFormatted}*\n`}• *Destination:* *${isQatar ? "Qatar (Complimentary Delivery)" : "India"}*

💬 *Hello Noomi's Couture Team!*
${greetingMessage}
━━━━━━━━━━━━━━━━━━━━━`;

    const encodedMessage = encodeURIComponent(message);
    const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // 8 pieces total: same category first, followed by catalog favorites (2*4 desktop, 2*2 mobile)
  const categoryProducts = effectiveProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const otherProducts = effectiveProducts.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  const relatedProducts = [...categoryProducts, ...otherProducts].slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-12 sm:space-y-16 pb-24 sm:pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-muted-foreground overflow-x-auto pb-1">
        <Link href="/" className="hover:text-foreground whitespace-nowrap">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-foreground whitespace-nowrap">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left Column: Product Visuals / Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border shadow-sm group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-background transition-all shadow-sm"
              title="Share piece link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <div className="absolute top-16 right-4 px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-medium shadow-lg animate-fade-in">
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx ? "border-primary ring-2 ring-primary/20 scale-95" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Narrative & Ordering Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {product.category}
              </span>
              <h1 className="font-editorial text-3xl sm:text-4xl text-foreground font-bold tracking-tight">
                {product.title}
              </h1>
            </div>

            {/* Ratings & Authenticity Badges */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-muted-foreground font-normal">({product.reviewCount} verified reviews)</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Anti-Tarnish & Waterproof
              </span>
            </div>

            {/* Price Presentation */}
            <div className="pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-foreground">
                  {formatPrice(effectivePrice, selectedCurrency)}
                </span>
                {salePrice && salePrice < regularPrice && (
                  <>
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(regularPrice, selectedCurrency)}
                    </span>
                    <span className="text-xs font-bold text-destructive px-2 py-0.5 rounded-full bg-destructive/10">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {isQatar
                  ? "Direct Qatar Order: Complimentary VIP Delivery (Within 14 Days)"
                  : "All taxes included. Complimentary express Pan-India shipping on orders ₹799+."}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Size Guide & Selection */}
            {sizeInfo && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Select {sizeInfo.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTab("size-guide")}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Size Guide</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {sizeInfo.isAdjustableOnly ? (
                  <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{sizeInfo.defaultSize}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Fits all sizes seamlessly
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sizeInfo.options.map((opt) => {
                      const isSelected = effectiveSize === opt;
                      const sizeStockCount = sizeInfo.sizeStock?.[opt];
                      const isSizeSoldOut = sizeStockCount !== undefined && sizeStockCount <= 0;

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedSize(opt)}
                          className={`p-2.5 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                              : isSizeSoldOut
                              ? "border-border/60 bg-muted/40 text-muted-foreground opacity-60"
                              : "border-border bg-card hover:border-primary/40 text-foreground"
                          }`}
                        >
                          <div className="text-xs font-bold truncate pr-3">{opt}</div>
                          <div className="text-[10px] mt-0.5">
                            {isSizeSoldOut ? (
                              <span className="text-destructive font-semibold">Out of Stock</span>
                            ) : sizeStockCount !== undefined && sizeStockCount <= 2 ? (
                              <span className="text-amber-600 font-medium">Only {sizeStockCount} left!</span>
                            ) : (
                              <span className="text-muted-foreground">In Stock</span>
                            )}
                          </div>
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Standard Variant Attributes (Color, Polish, Metal Finish) */}
            {product.variantAttributes && product.variantAttributes.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-border">
                {product.variantAttributes.map((attr) => (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground uppercase tracking-wider">{attr.name}</span>
                      <span className="text-muted-foreground font-medium">{currentOptions[attr.name]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [attr.name]: opt }))}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            currentOptions[attr.name] === opt
                              ? "border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20"
                              : "border-border bg-card text-foreground hover:border-muted-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-xl bg-card p-1">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg hover:bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-foreground">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= effectiveMaxStock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(effectiveMaxStock, q + 1))}
                    className="p-1.5 rounded-lg hover:bg-muted text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isOutOfStock ? (
                  <span className="text-xs font-bold text-destructive">
                    ⚠️ {isCurrentSizeOutOfStock ? `Size ${effectiveSize} Sold Out` : "Sold Out"}
                  </span>
                ) : effectiveMaxStock <= 3 ? (
                  <span className="text-xs font-bold text-amber-600">
                    Hurry, only {effectiveMaxStock} available!
                  </span>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Dispatch
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Add to Bag + Buy Now + WhatsApp Direct */}
            <div className="space-y-3 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  }`}
                >
                  {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isAdded ? "Added to Bag!" : isOutOfStock ? "Out of Stock" : "Add to Bag"}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl bg-[#4A171C] text-[#FAF8F5] hover:bg-[#380F13] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-[#C5A059]/40 shadow-sm transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isOutOfStock ? "Sold Out" : "Buy Now"}</span>
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <button
                type="button"
                onClick={handleDirectWhatsAppOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE5D] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>
                  {isOutOfStock
                    ? "Inquire on WhatsApp (Custom Restock)"
                    : isQatar
                    ? "Order via WhatsApp (Qatar Free VIP Delivery)"
                    : "Direct Order via WhatsApp (Fast Dispatch)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.slug || product.id)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isInWishlist
                    ? "border-rose-400 bg-rose-500/10 text-rose-500"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "fill-current" : ""}`} />
                <span>{isInWishlist ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>
            </div>

            {/* Reassurance Value Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-xs">
              <div className="p-2.5 rounded-xl bg-card border border-border/80 space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-primary" />
                <p className="font-bold text-foreground">Anti-Tarnish</p>
                <p className="text-[10px] text-muted-foreground">304 & 316L Grade</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border/80 space-y-1">
                <RotateCcw className="w-4 h-4 mx-auto text-primary" />
                <p className="font-bold text-foreground">360° Unboxing</p>
                <p className="text-[10px] text-muted-foreground">Video Guarantee</p>
              </div>
              <button
                type="button"
                onClick={() => setPolicyModalTab("shipping")}
                className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 transition-all text-center space-y-1 group"
              >
                <Truck className="w-4 h-4 mx-auto text-primary group-hover:scale-110 transition-transform" />
                <p className="font-bold text-foreground">DTDC & India Post</p>
                <p className="text-[10px]">{isQatar ? "Qatar Free Delivery (Within 14 Days)" : "Pan-India ₹40 / Free ₹799+"}</p>
              </button>
            </div>

            {/* Quick Policies Navigation Links */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setPolicyModalTab("size-guide")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span>Size Guide</span>
              </button>
              <button
                type="button"
                onClick={() => setPolicyModalTab("return-refund")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-primary" />
                <span>360° Unboxing Policy</span>
              </button>
              <button
                type="button"
                onClick={() => setPolicyModalTab("ordering-instructions")}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                <span>Order Instructions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Accordion Tabs */}
      {product.specifications && (
        <section className="border-t border-border pt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Technical Specifications & Provenance</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-bold text-foreground">{key}</span>
                <span className="sm:col-span-2 text-muted-foreground mt-0.5 sm:mt-0">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="border-t border-border pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Customer Reviews ({product.reviews?.length || 0})</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Verified purchaser testimonials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews?.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">{rev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

              <div className="pt-2 text-[11px] flex items-center justify-between">
                <span className="font-semibold text-foreground">{rev.author}</span>
                {rev.verifiedPurchase && (
                  <span className="text-emerald-600 font-medium">Verified Purchase</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products: 2 rows x 4 columns on desktop (2*4 = 8), 2 rows x 2 columns on mobile (2*2 = 4) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-10 sm:pt-14 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-foreground">You May Also Appreciate</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Matching waterproof & anti-tarnish everyday jewelry pieces.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid: 2*2 on Mobile (first 4 items), 2*4 on Desktop (8 items) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {relatedProducts.map((p, idx) => (
              <div key={p.id} className={idx >= 4 ? "hidden md:block" : "block"}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="pt-2 sm:pt-4 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-98"
            >
              <span>View More Jewelry ({effectiveProducts.length} Pieces)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Mobile Sticky Floating Purchase Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-background/95 backdrop-blur-md border-t border-border p-3 flex items-center gap-2 shadow-2xl">
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-bold text-foreground truncate">{product.title}</p>
          <p className="text-sm font-black text-primary">
            {formatPrice(product.salePrice || product.price, selectedCurrency)}
          </p>
        </div>
        {(() => {
          const maxStock = product.inStock !== false ? Math.max(0, product.stockCount !== undefined ? product.stockCount : 10) : 0;
          const isOutOfStock = maxStock <= 0;
          return (
            <>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-card border-2 border-primary text-primary"
                }`}
              >
                {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{isAdded ? "Added!" : isOutOfStock ? "Out of Stock" : "Bag"}</span>
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleDirectWhatsAppOrder}
                className="py-2.5 px-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{isOutOfStock ? "Sold Out" : "WhatsApp"}</span>
              </button>
            </>
          );
        })()}
      </div>

      {/* Interactive Policy & Size Guide Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "size-guide"}
      />
    </div>
  );
}
