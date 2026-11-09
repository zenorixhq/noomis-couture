"use client";

import Link from "next/link";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative w-full py-10 sm:py-12 md:py-12 lg:py-14 bg-[#FAF6EF] text-[#1C1917] overflow-hidden border-b border-[#EADBBE]/80 select-none scroll-mt-20"
    >
      {/* Background Topographic Wave Contours (Whisper-Light Ambient Motif, Non-Intrusive) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.016] pointer-events-none animate-pulse-soft"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 800"
      >
        <path d="M-100,160 Q200,40 450,220 T900,80 T1200,260" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,200 Q200,80 450,260 T900,120 T1200,300" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,240 Q200,120 450,300 T900,160 T1200,340" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,280 Q200,160 450,340 T900,200 T1200,380" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,560 Q300,420 600,620 T1200,480" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,600 Q300,460 600,660 T1200,520" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,640 Q300,500 600,700 T1200,560" fill="none" stroke="#C5A059" strokeWidth="1" />
        <path d="M-100,680 Q300,540 600,740 T1200,600" fill="none" stroke="#C5A059" strokeWidth="1" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center relative z-10 space-y-6 sm:space-y-8">
        
        {/* 1. Header: ABOUT US + Elegant Manifesto Paragraph */}
        <div className="text-center shrink-0 max-w-xl mx-auto space-y-1.5">
          <div className="relative inline-block">
            <span className="absolute -top-2.5 -left-5 text-[#C5A059] text-[10px] sm:text-xs animate-float-gentle">✦</span>
            <span className="absolute -bottom-1 -right-5 text-[#C5A059] text-[10px] sm:text-xs animate-float-gentle">✦</span>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.25em] uppercase text-[#1C1917]">
              ABOUT US
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light max-w-lg mx-auto px-2">
            Noomi&apos;s Couture designs modern, everyday luxury jewellery pieces handcrafted from premium 304 & 306 grade stainless steel. We empower you to wear your confidence daily.
          </p>
        </div>

        {/* 2. Main Two-Column Editorial Spread (Fits Single Desktop Window Cleanly with ZERO Overflow & No Mobile Voids) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Number 03 + Enlarged Landscape Photo on Desktop + Story + Oval Pill Button */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-3.5 sm:space-y-4">
            <div>
              <span className="font-editorial text-xs italic text-[#8F7842] block mb-1.5 tracking-wider">
                03
              </span>
              <div className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] aspect-[16/10] rounded-sm overflow-hidden shadow-sm md:shadow-md border border-[#E2D5BE] bg-[#F0E6D2]">
                <img
                  src="/images/about-model-landscape.jpg"
                  alt="Noomi's Couture Waterproof Necklace & Ring Lifestyle Landscape"
                  className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-md lg:max-w-lg">
              <p className="text-xs sm:text-sm text-[#5C5346] leading-relaxed font-light">
                Our mission is to create pieces that are made for life. At Noomi&apos;s Couture, we believe jewellery should be an effortless extension of your spirit—empowering you to wear your confidence every single day.
              </p>

              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2 md:px-6 rounded-full border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white text-xs md:text-sm font-medium tracking-wide transition-all shadow-sm active:scale-95 group"
                >
                  <span>More Information</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Number 04 + Enlarged Portrait Photo on Desktop (Right-aligned on mobile & desktop) */}
          <div className="md:col-span-6 flex flex-col justify-center items-end">
            <div className="flex flex-col items-start w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[400px] ml-auto">
              <span className="font-editorial text-xs italic text-[#8F7842] block mb-1.5 tracking-wider">
                04
              </span>
              <div className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-md md:shadow-xl border border-[#E2D5BE] bg-[#F0E6D2]">
                <img
                  src="/images/about-model-portrait.jpg"
                  alt="Noomi's Couture Fine Jewelry Portrait"
                  className="w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Subtle Accent Line */}
        <div className="shrink-0 pt-2 flex justify-center">
          <div className="w-12 h-[1px] bg-[#C5A059]/40" />
        </div>
      </div>
    </section>
  );
}
