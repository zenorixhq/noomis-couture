"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reset scroll to top on route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Smooth anchor scrolling (e.g., #categories, #about, #reviews)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          const yOffset = -80; // Account for fixed glass header
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    // Clean up any stale overflow lock on mount
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
    if (document.documentElement.style.overflow === "hidden") {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
