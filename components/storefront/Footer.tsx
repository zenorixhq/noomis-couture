"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import {
  MessageCircle,
  Instagram,
  Facebook,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { BrandLogo } from "@/components/storefront/BrandLogo";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#180507] text-[#FAF7F2] border-t border-[#4A171C]/70 mt-16 sm:mt-24 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main 4-Column Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Atelier Essence (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="full" showTagline={true} theme="dark" />
            
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-sm">
              Fine jewellery for the skin, not the vault. Handcrafted in 304 & 306 surgical-grade stainless steel with mirror gold finish. 100% waterproof and anti-tarnish. Wear your confidence.
            </p>

            {/* Social & WhatsApp Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={storeConfig.brand.socials.instagram || "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#C5A059] hover:border-[#C5A059]/60 hover:bg-[#C5A059]/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#25D366] hover:border-[#25D366]/60 hover:bg-[#25D366]/10 transition-all"
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={storeConfig.brand.socials.facebook || "https://www.facebook.com/share/1DXg9Puzkj/"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-[#1877F2] hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              Collections
            </h5>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-400">
              <li>
                <Link href="/products?category=bangles" className="hover:text-white transition-colors">
                  Bangles & Kada
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="hover:text-white transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products?category=charm-necklace" className="hover:text-white transition-colors">
                  Charm Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products?category=rings" className="hover:text-white transition-colors">
                  Rings & Bands
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="hover:text-white transition-colors">
                  Earrings & Hoops
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#C5A059] hover:underline transition-colors flex items-center gap-1 pt-1 font-medium">
                  <span>All Collections</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors text-left block">
                  Our Purpose &amp; Story
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("size-guide")}
                  className="hover:text-white transition-colors text-left"
                >
                  Bangle & Ring Size Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("care-guide")}
                  className="hover:text-white transition-colors text-left"
                >
                  Jewelry Care (304 & 306 Steel)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("shipping")}
                  className="hover:text-white transition-colors text-left"
                >
                  Shipping via DTDC & India Post
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("return-refund")}
                  className="hover:text-white transition-colors text-left"
                >
                  360° Unboxing & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("ordering-instructions")}
                  className="hover:text-white transition-colors text-left"
                >
                  Pre-Order Instructions
                </button>
              </li>
              <li className="pt-0.5">
                <Link href="/account" className="hover:text-white transition-colors text-stone-300">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Stay Informed (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              Stay in Touch
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Receive private previews, secret seasonal catalogs, and 5% off your first purchase.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-[#FAF7F2] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span>Thank you! Your 5% first purchase voucher (NOOMI5) has been sent.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center pt-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-light"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#C5A059] text-[#1C1917] hover:bg-[#D5B069] transition-all flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}

            <p className="text-[10px] text-stone-500 pt-1">
              WhatsApp Support: +{storeConfig.brand.contact.whatsappNumber}
            </p>
          </div>
        </div>

        {/* Bottom Legal & Minimal Trust Cues */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {storeConfig.meta.name}. Wear Your Confidence. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>304 & 306 Grade Steel</span>
            <span className="text-stone-700">•</span>
            <span>100% Anti-Tarnish</span>
            <span className="text-stone-700">•</span>
            <span>Free Shipping Over ₹799</span>
          </div>
        </div>
      </div>

      {/* Interactive Policy & Size Guide Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "size-guide"}
      />
    </footer>
  );
}
