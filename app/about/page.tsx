import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Droplets, Award, MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store.config";

export const metadata: Metadata = {
  title: "About Us | Our Story & Purpose | Noomi's Couture",
  description:
    "Discover the craftsmanship, ethical intention, and everyday luxury behind Noomi's Couture. Handcrafted in 304 & 316L stainless steel with radiant 18K gold finish.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1C1917]">
      
      {/* 1. Refined Minimalist Breadcrumb & Page Header */}
      <section className="border-b border-[#EADBBE]/60 bg-[#FAF7F2] py-10 sm:py-14 md:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8F7234] mb-3">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1C1917] font-semibold">About Us</span>
          </nav>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1917] leading-tight">
            Where Every Piece Tells a Story
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
            Everyday fine jewelry handcrafted in premium 304 &amp; 316L stainless steel with radiant 18K gold finish. Made for the skin, not the vault.
          </p>
        </div>
      </section>

      {/* 2. Main "OUR PURPOSE" Section (Noomi's Couture Signature Palette) */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#FAF5EB] border-b border-[#EADBBE] overflow-hidden">
        {/* Subtle ambient gold & burgundy aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4A171C]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-stretch">
            
            {/* Left Column: Heading, Manifesto, Learn More CTA, 2 Feature Cards */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
              
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#8F7234] font-medium">
                    THE NOOMI&apos;S MANIFESTO
                  </span>
                </div>

                <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-normal tracking-[0.18em] uppercase text-[#2D080E] leading-none">
                  OUR PURPOSE
                </h2>

                <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-[13px] font-light text-[#4A3D31] tracking-[0.05em] leading-relaxed uppercase">
                  <p>
                    FROM RESPONSIBLE SOURCING TO METICULOUS CRAFTSMANSHIP, WE BELIEVE FINE JEWELRY SHOULD REFLECT NOT ONLY BEAUTY, BUT INTENTION. EVERY PIECE WE CREATE IS DESIGNED WITH CLARITY, CARE, AND RESPECT — FOR THE MATERIALS, THE MAKERS, AND THE MOMENTS THEY REPRESENT.
                  </p>
                  <p>
                    WE&apos;RE REDEFINING WHAT IT MEANS TO DESIGN AND EXPERIENCE JEWELRY THAT LASTS — IN FORM, IN FEELING, AND IN VALUE.
                  </p>
                </div>

                <div className="pt-1 sm:pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#4A171C] pb-1 border-b-2 border-[#4A171C] hover:text-[#C5A059] hover:border-[#C5A059] transition-all group"
                  >
                    <span>EXPLORE THE COLLECTION</span>
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Two Feature Cards Side-by-Side */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-6">
                
                {/* Card 1: SIGNATURE CREATIONS */}
                <Link href="/products" className="group block space-y-2">
                  <div className="aspect-square w-full overflow-hidden bg-[#FAF5EB] rounded-xl shadow-[0_6px_24px_rgba(74,23,28,0.06)] border border-[#EADBBE] group-hover:border-[#C5A059] group-hover:shadow-[0_10px_30px_rgba(74,23,28,0.12)] transition-all duration-500">
                    <img
                      src="/images/about-signature-creations.jpg"
                      alt="Signature Creations - Fine Jewelry Stack"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#2D080E] group-hover:text-[#8F7234] transition-colors pt-1">
                    SIGNATURE CREATIONS
                  </p>
                </Link>

                {/* Card 2: CRAFTED WITH CARE */}
                <div className="group block space-y-2">
                  <div className="aspect-square w-full overflow-hidden bg-[#FAF5EB] rounded-xl shadow-[0_6px_24px_rgba(74,23,28,0.06)] border border-[#EADBBE] group-hover:border-[#C5A059] group-hover:shadow-[0_10px_30px_rgba(74,23,28,0.12)] transition-all duration-500">
                    <img
                      src="/images/about-crafted-care.jpg"
                      alt="Crafted with Care - Artisan Jewelry Craftsmanship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#2D080E] group-hover:text-[#8F7234] transition-colors pt-1">
                    CRAFTED WITH CARE
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Image 3 - Model Editorial Photograph with Noomi's Luxury Palette Frame */}
            <div className="lg:col-span-6 flex items-stretch">
              <div className="w-full h-full min-h-[380px] sm:min-h-[480px] md:min-h-[540px] aspect-[4/5] lg:aspect-auto overflow-hidden rounded-2xl bg-[#FAF5EB] shadow-[0_16px_40px_rgba(74,23,28,0.1)] border border-[#EADBBE] group relative">
                <img
                  src="/images/about-model-purpose.jpg"
                  alt="Noomi's Couture - Our Purpose Editorial Portrait with Luxury Watch and Gold Jewelry"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-[#EADBBE]/60 rounded-2xl pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Pillars of Noomi's Couture Craftsmanship */}
      <section className="py-14 sm:py-18 md:py-20 bg-[#FAF7F2] border-b border-[#EADBBE]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
              OUR STANDARDS
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#1C1917] tracking-tight">
              Built for Modern Life, Designed for Eternity
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Why traditional jewelry tarnishes while Noomi&apos;s Couture stays radiant day after day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADBBE]/80 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#EADBBE] flex items-center justify-center text-[#8F7234]">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg sm:text-xl text-[#1C1917]">
                100% Waterproof &amp; Sweatproof
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Engineered with high-density 304 &amp; 316L surgical stainless steel. Wear your pieces in the shower, at the gym, swimming in the sea, or applying lotions without ever having to take them off.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADBBE]/80 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#EADBBE] flex items-center justify-center text-[#8F7234]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg sm:text-xl text-[#1C1917]">
                18K Gold Vacuum PVD Coating
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Utilizing state-of-the-art Physical Vapor Deposition (PVD) that bonds 18K gold at a molecular level—up to 10x thicker and more durable than conventional flash electroplating.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-8 bg-white border border-[#EADBBE]/80 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#EADBBE] flex items-center justify-center text-[#8F7234]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-lg sm:text-xl text-[#1C1917]">
                Hypoallergenic &amp; Sensitive Skin Safe
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                100% nickel-free and lead-free. Zero skin discoloration, zero allergic reactions, zero green residue. Pure comfort from the moment you put it on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Value Badges Grid */}
      <section className="py-12 sm:py-14 bg-white border-b border-[#EADBBE]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1.5 p-4">
              <Award className="w-6 h-6 text-[#8F7234] mx-auto" />
              <h5 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1C1917]">Anti-Tarnish Guaranteed</h5>
              <p className="text-[11px] text-stone-500 font-light">Laboratory-tested for everyday wear</p>
            </div>
            <div className="space-y-1.5 p-4">
              <ShieldCheck className="w-6 h-6 text-[#8F7234] mx-auto" />
              <h5 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1C1917]">Surgical Steel Base</h5>
              <p className="text-[11px] text-stone-500 font-light">Corrosion-resistant 304 &amp; 316L</p>
            </div>
            <div className="space-y-1.5 p-4">
              <Sparkles className="w-6 h-6 text-[#8F7234] mx-auto" />
              <h5 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1C1917]">First Order 5% Off</h5>
              <p className="text-[11px] text-stone-500 font-light">Applied automatically at checkout</p>
            </div>
            <div className="space-y-1.5 p-4">
              <MessageCircle className="w-6 h-6 text-[#25D366] mx-auto" />
              <h5 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#1C1917]">Direct Concierge</h5>
              <p className="text-[11px] text-stone-500 font-light">Instant WhatsApp styling assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Luxury Discovery CTA Banner */}
      <section className="py-16 sm:py-20 bg-[#20050A] text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#EADBBE] font-medium block">
            NOOMI&apos;S COUTURE
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
            Wear Your Confidence Every Single Day
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/85 font-light leading-relaxed max-w-lg mx-auto">
            Explore our curated catalog of bangles, charm necklaces, bracelets, pendants, watches, rings, hand chains, anklets, and earrings.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#184E44] hover:bg-[#133F37] text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg transition-all group border border-emerald-300/25"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=Hi%20Noomi's%20Couture,%20I%20would%20like%20to%20know%20more%20about%20your%20pieces!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm tracking-wide transition-all border border-white/20"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Chat with Concierge</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
