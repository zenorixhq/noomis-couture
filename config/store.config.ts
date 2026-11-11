export interface StoreConfig {
  meta: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    favicon: string;
  };
  brand: {
    logo: {
      text: string;
      subtext?: string;
      imageUrl?: string;
    };
    theme: {
      primary: string;         // HSL
      primaryHover: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
      borderRadius: string;
      fontHeading: string;
      fontSans: string;
    };
    contact: {
      email: string;
      phone: string;
      whatsappNumber: string; // WhatsApp ordering phone without + or spaces
      address: string;
      hours: string;
    };
    socials: {
      instagram?: string;
      whatsapp?: string;
      facebook?: string;
    };
  };
  commerce: {
    defaultCurrency: "INR";
    supportedCurrencies: { code: string; symbol: string; name?: string; flag?: string; rate: number }[];
    freeShippingThreshold: number;
    flatShippingFee: number;
    shippingRates: {
      kerala: number;
      outsideKerala: number;
    };
    taxRatePercent: number;
    taxInclusive: boolean;
    checkoutMode: "whatsapp" | "gateway"; // 'whatsapp' directed ordering
    activeCoupons: {
      code: string;
      discountType: "percentage" | "fixed";
      amount: number;
      minSpend?: number;
      description: string;
      firstPurchaseOnly?: boolean;
    }[];
  };
  features: {
    enableWishlist: boolean;
    enableReviews: boolean;
    enableQuickView: boolean;
    enableStockBadges: boolean;
    enableAnnouncementBar: boolean;
    announcementText: string;
    enableWhatsAppFloat: boolean;
    enableCurrencySwitcher: boolean;
  };
}

export const storeConfig: StoreConfig = {
  meta: {
    name: "Noomi's Couture",
    tagline: "Wear Your Confidence",
    description: "Waterproof & Anti-Tarnish Everyday Luxury Jewellery by Noomi's Couture. Crafted in Premium 304 & 306 Grade Stainless Steel with enduring mirror gold finish. Wear your confidence daily, anywhere.",
    url: "https://noomiscouture.com",
    favicon: "/favicon.ico",
  },
  brand: {
    logo: {
      text: "Noomi's Couture",
      subtext: "WEAR YOUR CONFIDENCE",
      imageUrl: "/images/noomis-logo-banner-transparent.png",
    },
    theme: {
      // Signature Burgundy Maroon & Warm Champagne Gold Palette from Logo
      primary: "354 53% 19%",       // Royal Burgundy Wine #4A171C
      primaryHover: "354 58% 14%",  // Deep Velvet Wine #380F13
      primaryForeground: "45 40% 96%",
      accent: "39 60% 50%",         // Warm Shimmering Gold #D4AF37
      accentForeground: "354 53% 19%",
      borderRadius: "0.75rem",
      fontHeading: "var(--font-heading)",
      fontSans: "var(--font-sans)",
    },
    contact: {
      email: "concierge@noomiscouture.com",
      phone: "+91 70255 87032",
      whatsappNumber: "917025587032",
      address: "Noomi's Couture • Pan-India & Global Express Delivery",
      hours: "Mon – Sat: 9:30 AM – 8:00 PM IST",
    },
    socials: {
      instagram: "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr",
      whatsapp: "https://wa.me/917025587032",
      facebook: "https://www.facebook.com/noomiscouture",
    },
  },
  commerce: {
    defaultCurrency: "INR",
    supportedCurrencies: [
      { code: "INR", symbol: "₹", name: "India (₹)", flag: "🇮🇳", rate: 1.0 },
    ],
    freeShippingThreshold: 999,
    flatShippingFee: 50,
    shippingRates: {
      kerala: 50,
      outsideKerala: 70,
    },
    taxRatePercent: 0,
    taxInclusive: true,
    checkoutMode: "gateway",
    activeCoupons: [
      {
        code: "NOOMI5",
        discountType: "percentage",
        amount: 5,
        firstPurchaseOnly: true,
        description: "5% off your 1st purchase (new customers only)",
      },
      {
        code: "CONFIDENCE10",
        discountType: "percentage",
        amount: 10,
        firstPurchaseOnly: false,
        description: "10% off for orders above ₹1499",
      },
      {
        code: "WELCOME5",
        discountType: "percentage",
        amount: 5,
        firstPurchaseOnly: true,
        description: "5% off your 1st purchase (new customers only)",
      },
    ],
  },
  features: {
    enableWishlist: true,
    enableReviews: true,
    enableQuickView: true,
    enableStockBadges: true,
    enableAnnouncementBar: true,
    announcementText: "✨ Noomi's Couture • Free Shipping Above ₹999 • 5% OFF On 1st Order with Code NOOMI5 • 100% Anti-Tarnish & Waterproof",
    enableWhatsAppFloat: true,
    enableCurrencySwitcher: false,
  },
};
