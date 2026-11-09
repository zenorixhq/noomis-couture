"use client";

import Link from "next/link";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#FAF5EB] text-[#1C1917] overflow-hidden border-b border-[#EADBBE] scroll-mt-20"
    >
      {/* Delicate ambient gold watermark ornament */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4A171C]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-stretch">
          
          {/* Left Column: Heading, Purpose Manifesto, Learn More CTA, and 2 Bottom Feature Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
            
            {/* Top Text Segment */}
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
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#4A171C] pb-1 border-b-2 border-[#4A171C] hover:text-[#C5A059] hover:border-[#C5A059] transition-all group"
                >
                  <span>LEARN MORE</span>
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
                    loading="lazy"
                  />
                </div>
                <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#2D080E] group-hover:text-[#8F7234] transition-colors pt-1">
                  SIGNATURE CREATIONS
                </p>
              </Link>

              {/* Card 2: CRAFTED WITH CARE */}
              <Link href="/about" className="group block space-y-2">
                <div className="aspect-square w-full overflow-hidden bg-[#FAF5EB] rounded-xl shadow-[0_6px_24px_rgba(74,23,28,0.06)] border border-[#EADBBE] group-hover:border-[#C5A059] group-hover:shadow-[0_10px_30px_rgba(74,23,28,0.12)] transition-all duration-500">
                  <img
                    src="/images/about-crafted-care.jpg"
                    alt="Crafted with Care - Artisan Jewelry Craftsmanship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#2D080E] group-hover:text-[#8F7234] transition-colors pt-1">
                  CRAFTED WITH CARE
                </p>
              </Link>
            </div>
          </div>

          {/* Right Column: Image 3 - Model Editorial Photograph with Noomi's Luxury Palette Frame */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="w-full h-full min-h-[380px] sm:min-h-[480px] md:min-h-[540px] aspect-[4/5] lg:aspect-auto overflow-hidden rounded-2xl bg-[#FAF5EB] shadow-[0_16px_40px_rgba(74,23,28,0.1)] border border-[#EADBBE] group relative">
              <img
                src="/images/about-model-purpose.jpg"
                alt="Noomi's Couture - Our Purpose Editorial Portrait wearing timepiece and gold jewelry"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-[#EADBBE]/60 rounded-2xl pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
