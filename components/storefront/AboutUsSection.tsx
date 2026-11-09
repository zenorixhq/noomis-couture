"use client";

import Link from "next/link";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-white text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/70 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-stretch">
          
          {/* Left Column: Heading, Purpose Manifesto, Learn More CTA, and 2 Bottom Feature Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
            
            {/* Top Text Segment */}
            <div className="space-y-4 sm:space-y-5">
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-normal tracking-[0.18em] uppercase text-[#1C1917] leading-none">
                OUR PURPOSE
              </h2>

              <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-[13px] font-light text-[#4A4036] tracking-[0.05em] leading-relaxed uppercase">
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
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#1C1917] pb-1 border-b-2 border-[#1C1917] hover:text-[#C5A059] hover:border-[#C5A059] transition-all group"
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
                <div className="aspect-square w-full overflow-hidden bg-[#FAF6F0] shadow-sm border border-[#EADBBE]/80">
                  <img
                    src="/images/about-signature-creations.jpg"
                    alt="Signature Creations - Fine Jewelry Stack"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#1C1917] group-hover:text-[#C5A059] transition-colors pt-1">
                  SIGNATURE CREATIONS
                </p>
              </Link>

              {/* Card 2: CRAFTED WITH CARE */}
              <Link href="/about" className="group block space-y-2">
                <div className="aspect-square w-full overflow-hidden bg-[#FAF6F0] shadow-sm border border-[#EADBBE]/80">
                  <img
                    src="/images/about-crafted-care.jpg"
                    alt="Crafted with Care - Artisan Jewelry Craftsmanship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                <p className="text-center text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#1C1917] group-hover:text-[#C5A059] transition-colors pt-1">
                  CRAFTED WITH CARE
                </p>
              </Link>
            </div>
          </div>

          {/* Right Column: Full-Height Model Editorial Photograph */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="w-full h-full min-h-[380px] sm:min-h-[480px] md:min-h-[520px] aspect-[4/5] lg:aspect-auto overflow-hidden bg-[#FAF6F0] shadow-sm border border-[#EADBBE]/80 group">
              <img
                src="/images/about-model-purpose.jpg"
                alt="Noomi's Couture - Our Purpose Editorial Portrait"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
