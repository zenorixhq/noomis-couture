"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";

export function Header() {
  const pathname = usePathname();

  // Hide storefront header completely on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const products = useProductStore((s) => s.products);
  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const openCart = useCartStore((s) => s.openCart);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isHomepage = pathname === "/";
  // On homepage when not scrolled: crystal glass floating over hero
  // When scrolled ("Navbar enabled only on scroll") or on any inner page: enabled frosted luxury glass
  const isTransparent = isHomepage && !isScrolled;

  // Track scroll position for sticky glass header styling & warm up product catalog silently
  useEffect(() => {
    setMounted(true);
    useProductStore.getState().fetchProducts();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const leftNavLinks = [
    { label: "Shop", href: "/products" },
    { label: "Collections", href: "/#categories" },
    {
      label: "Contact",
      href: `https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=Hi%20Noomi%27s%20Couture%2C%20I%20have%20an%20inquiry`,
      external: true,
    },
  ];

  const allNavLinks = [
    { label: "Shop All Jewelry", href: "/products" },
    { label: "Bangles", href: "/products?category=bangles" },
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Charm Necklace", href: "/products?category=charm-necklace" },
    { label: "Pendants", href: "/products?category=pendants" },
    { label: "Watches", href: "/products?category=watches" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Hand Chains", href: "/products?category=hand-chains" },
    { label: "Anklets", href: "/products?category=anklets" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Mangalsutra", href: "/products?category=mangalsutra" },
  ];

  return (
    <>
      {/* Fixed Persistent Glass Navbar (Give navbar all times) */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-black/20 backdrop-blur-md border-b border-white/15 text-white shadow-[0_4px_30px_rgba(0,0,0,0.12)]"
            : "bg-[#FAF7F2]/85 backdrop-blur-xl border-b border-[#EADBBE]/80 shadow-md text-[#240A0D]"
        }`}
      >
        <AnnouncementBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 sm:h-20">
            {/* 1. LEFT SEGMENT: Navigation Links on Desktop, Hamburger + Search on Mobile */}
            <div className="flex items-center gap-1 sm:gap-2 z-10">
              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 -ml-2 rounded-md transition-colors ${
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-[#240A0D] hover:bg-[#F0E6D2]"
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Mobile Search Button (Placed beside hamburger so center logo has ample breathing room) */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`lg:hidden p-2 rounded-md transition-colors ${
                  isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#240A0D]/80 hover:text-[#4A171C] hover:bg-[#F0E6D2]"
                }`}
                aria-label="Search products"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Desktop Left Nav Links */}
              <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
                {leftNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`text-xs xl:text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                      isTransparent
                        ? "text-white/85 hover:text-white"
                        : "text-[#240A0D]/80 hover:text-[#4A171C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 2. CENTER SEGMENT: Center-Aligned Logo (Name smoothly hides on scroll, only medallion stays in center) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-auto">
              <Link
                href="/"
                className="flex items-center group select-none transition-all duration-300"
                aria-label="Noomi's Couture Home"
              >
                <img
                  src="/images/noomis-medallion.png"
                  alt="Noomi's Couture Medallion"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
                />
                <span
                  className={`font-editorial tracking-[0.1em] xs:tracking-[0.14em] sm:tracking-[0.2em] md:tracking-[0.24em] uppercase font-medium transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                    isScrolled
                      ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none ml-0"
                      : "max-w-[200px] xs:max-w-[240px] sm:max-w-[420px] opacity-100 translate-x-0 ml-2 sm:ml-2.5"
                  } ${
                    isTransparent
                      ? "text-white drop-shadow-sm group-hover:text-amber-100"
                      : "text-[#4A171C] group-hover:text-[#6B1B24]"
                  } text-xs xs:text-sm sm:text-lg md:text-xl lg:text-[1.65rem]`}
                >
                  NOOMI&apos;S COUTURE
                </span>
              </Link>
            </div>

            {/* 3. RIGHT SEGMENT: User Account, Wishlist Heart, and Cart Pill (Count) */}
            <div className="flex items-center gap-2 sm:gap-3.5 z-10">
              {/* Currency Selector (Subtle) */}
              {storeConfig.features.enableCurrencySwitcher && (
                <div className="relative group hidden md:flex items-center">
                  <div
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      isTransparent
                        ? "border-white/25 text-white/90 hover:bg-white/10"
                        : "border-[#EADBBE] text-[#240A0D] hover:bg-[#F0E6D2]"
                    }`}
                  >
                    <span>{selectedCurrency === "INR" ? "🇮🇳 INR" : selectedCurrency}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </div>
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#FFFDF9] border border-[#EADBBE] shadow-xl rounded-xl py-1.5 hidden group-hover:block z-50 animate-in fade-in-0 zoom-in-95">
                    {storeConfig.commerce.supportedCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center hover:bg-[#FAF7F2] transition-colors ${
                          selectedCurrency === c.code
                            ? "font-bold text-[#4A171C] bg-[#F7EFE1]"
                            : "text-[#240A0D]"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{c.flag || "🇮🇳"}</span>
                          <span>{c.code}</span>
                        </span>
                        <span className="text-[11px] text-stone-500">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop Search Trigger Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-9 h-9 rounded-full hidden lg:flex items-center justify-center transition-colors ${
                  isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#240A0D]/80 hover:text-[#4A171C] hover:bg-[#F0E6D2]"
                }`}
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Account / User Icon (Directly matching reference) */}
              <Link
                href="/account"
                className={`w-9 h-9 rounded-full hidden sm:flex items-center justify-center transition-colors ${
                  isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#240A0D]/80 hover:text-[#4A171C] hover:bg-[#F0E6D2]"
                }`}
                aria-label="My Account"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist Heart Icon (Directly matching reference) */}
              {storeConfig.features.enableWishlist && (
                <Link
                  href="/account?tab=wishlist"
                  className={`w-9 h-9 rounded-full flex items-center justify-center relative transition-colors ${
                    isTransparent
                      ? "text-white/85 hover:text-white hover:bg-white/10"
                      : "text-[#240A0D]/80 hover:text-[#4A171C] hover:bg-[#F0E6D2]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Shopping Bag Pill with Count: [ ☖ (count) ] (Directly matching reference) */}
              <button
                onClick={openCart}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  isTransparent
                    ? "border-white/30 hover:border-white/70 bg-white/10 hover:bg-white/20 text-white shadow-sm"
                    : "border-[#4A171C]/30 hover:border-[#4A171C] bg-[#4A171C]/5 hover:bg-[#4A171C]/10 text-[#4A171C]"
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold tracking-tight">
                  ({mounted ? itemCount : 0})
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offset spacer on inner pages so content is not obscured by fixed navbar */}
      {!isHomepage && <div className="h-16 sm:h-20 w-full" aria-hidden="true" />}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] text-[#240A0D] shadow-2xl flex flex-col p-6 z-10 animate-in slide-in-from-left duration-300 border-r border-[#EADBBE]">
            <div className="flex items-center justify-between pb-5 border-b border-[#EADBBE]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src="/images/noomis-medallion.png"
                  alt="Noomi's Couture Medallion"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-editorial text-lg tracking-[0.2em] uppercase font-semibold text-[#4A171C]">
                  NOOMI&apos;S COUTURE
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-[#F0E6D2] text-[#240A0D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav data-lenis-prevent className="flex-1 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
              <div className="pb-3 border-b border-[#EADBBE] space-y-1">
                {leftNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="block text-base font-medium text-[#240A0D] hover:text-[#4A171C] py-1.5 px-2 rounded-lg hover:bg-[#F0E6D2]/60"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-2 space-y-1">
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider px-2 py-1">
                  Jewelry Collections
                </p>
                {allNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-stone-700 hover:text-[#4A171C] py-1 px-2 rounded-lg hover:bg-[#F0E6D2]/60"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EADBBE] space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider px-2 py-1">
                  Guides &amp; Policies
                </p>
                <Link
                  href="/policies?tab=size-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-stone-600 hover:text-[#4A171C] py-1.5 px-2 rounded-lg hover:bg-[#F0E6D2]/40"
                >
                  📐 Bangle &amp; Ring Size Guide
                </Link>
                <Link
                  href="/policies?tab=care-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-stone-600 hover:text-[#4A171C] py-1.5 px-2 rounded-lg hover:bg-[#F0E6D2]/40"
                >
                  ✨ Jewelry Care (304 &amp; 316L Steel)
                </Link>
                <Link
                  href="/policies?tab=shipping"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-stone-600 hover:text-[#4A171C] py-1.5 px-2 rounded-lg hover:bg-[#F0E6D2]/40"
                >
                  🚚 Shipping via DTDC &amp; India Post
                </Link>
                <Link
                  href="/policies?tab=return-refund"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-stone-600 hover:text-[#4A171C] py-1.5 px-2 rounded-lg hover:bg-[#F0E6D2]/40"
                >
                  🔄 360° Unboxing &amp; Return Policy
                </Link>
              </div>

              <div className="pt-3 border-t border-[#EADBBE]">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#4A171C] hover:underline py-2 px-2"
                >
                  Customer Account &amp; Orders →
                </Link>
              </div>
            </nav>

              <div className="pt-3 border-t border-[#EADBBE] text-center">
                <span className="text-[11px] font-medium text-stone-500">
                  🇮🇳 Pan-India Express Delivery • Free Above ₹999
                </span>
              </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
          <div className="relative w-full max-w-2xl bg-[#FFFDF9] border border-[#EADBBE] shadow-2xl rounded-xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center px-4 py-3 border-b border-[#EADBBE]">
              <Search className="w-5 h-5 text-stone-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search clover necklaces, croissant hoops, anti-tarnish rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#240A0D] placeholder:text-stone-400 outline-none text-base"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 rounded-md hover:bg-[#F0E6D2] text-stone-500 hover:text-[#240A0D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Live Results */}
            {searchQuery.trim() && (
              <div data-lenis-prevent className="p-4 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Matching Products ({searchResults.length})
                    </p>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-[#FAF7F2] transition-colors group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-md flex-shrink-0 border border-[#EADBBE]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#240A0D] group-hover:text-[#4A171C] truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-stone-500 capitalize">
                            {product.category}
                          </p>
                          <p className="text-xs font-bold text-[#4A171C] mt-0.5">
                            {formatPrice(
                              product.salePrice || product.price,
                              selectedCurrency
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-2 text-center">
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="text-xs font-semibold text-[#4A171C] hover:underline"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-stone-500 text-sm">
                    No products found matching &ldquo;{searchQuery}&rdquo;. Try another term.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
