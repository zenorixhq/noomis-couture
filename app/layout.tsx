import type { Metadata } from "next";
import "./globals.css";
import { storeConfig } from "@/config/store.config";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat";
import { FloatingOfferPill } from "@/components/storefront/FloatingOfferPill";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://noomiscouture.com"),
  title: {
    default: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    template: `%s | ${storeConfig.meta.name}`,
  },
  description: storeConfig.meta.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://noomiscouture.com",
    siteName: "Noomi's Couture",
    title: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    description: storeConfig.meta.description,
    images: [
      {
        url: "/images/noomis-couture-square.png",
        width: 426,
        height: 421,
        alt: "Noomi's Couture Luxury Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    description: storeConfig.meta.description,
    images: ["/images/noomis-couture-square.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = storeConfig.brand;

  const dynamicThemeStyles = {
    "--primary": theme.primary,
    "--primary-hover": theme.primaryHover,
    "--primary-foreground": theme.primaryForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--radius": theme.borderRadius,
  } as React.CSSProperties;

  return (
    <html lang="en" style={dynamicThemeStyles}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Global Slide-overs & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <WhatsAppFloat />
          <FloatingOfferPill />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
