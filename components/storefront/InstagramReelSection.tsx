"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Instagram,
  Play,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import initialReviewData from "@/data/clientReviews.json";

export interface InstagramVideoItem {
  id: string | number;
  title: string;
  handle?: string;
  caption?: string;
  videoUrl: string;
  embedUrl?: string;
  poster?: string;
  views?: string;
  instagramLink?: string;
}

const defaultInstagramVideos: InstagramVideoItem[] = (initialReviewData.instagramVideos || []) as InstagramVideoItem[];

function AutoPlayingInstaCard({
  vid,
  onClick,
}: {
  vid: InstagramVideoItem;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    video.play().catch(() => {});

    return () => {
      observer.disconnect();
    };
  }, [vid.videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isDirectVideo =
    vid.videoUrl &&
    (vid.videoUrl.includes(".mp4") ||
      vid.videoUrl.includes(".webm") ||
      vid.videoUrl.includes("blob.vercel-storage.com") ||
      vid.videoUrl.startsWith("/uploads/") ||
      vid.videoUrl.startsWith("data:video") ||
      vid.videoUrl.includes("assets.mixkit.co"));

  return (
    <div
      onClick={onClick}
      className="group relative w-[240px] sm:w-[270px] md:w-[290px] shrink-0 snap-start aspect-[9/15] rounded-2xl overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer border border-[#EADBBE]"
    >
      {/* Active playing video directly in card */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          src={vid.videoUrl}
          poster={
            vid.poster && !vid.poster.startsWith("data:image/webp")
              ? vid.poster
              : "/uploads/images/charm-bangles-poster.jpg"
          }
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={
            vid.poster && !vid.poster.startsWith("data:image/webp")
              ? vid.poster
              : "/uploads/images/charm-bangles-poster.jpg"
          }
          alt={vid.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/noomis-brand-card.png";
          }}
        />
      )}

      {/* Gradient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 flex flex-col justify-between p-3.5 sm:p-4 text-white pointer-events-none">
        {/* Top Badges (View count removed) */}
        <div className="flex items-center justify-end text-xs pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {isDirectVideo && (
              <button
                type="button"
                onClick={toggleSound}
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur flex items-center justify-center text-white transition-all shadow"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
              <Instagram className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Center Hover Action */}
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-xl group-hover:scale-110">
          <Maximize2 className="w-4 h-4 text-[#1C1917]" />
        </div>

        {/* Bottom Details */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1 leading-snug drop-shadow-sm">
            {vid.title}
          </p>
          <p className="text-[11px] text-white/85 line-clamp-1 font-light drop-shadow-sm">
            {vid.caption?.replace(/alnaya\.in/gi, "noomiscouture.com").replace(/alnaya/gi, "Noomi's Couture")}
          </p>
          <span className="inline-block text-[10px] text-[#F3DFB0] font-mono tracking-wider">
            {vid.handle && !vid.handle.toLowerCase().includes("alnaya") && !vid.handle.toLowerCase().includes("gleam") ? vid.handle : "@noomi_s_couture"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Auto-purge obsolete Instagram cache keys from browser storage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("noomis_instagram_reels");
    localStorage.removeItem("noomis_instagram_reels_v2");
    sessionStorage.removeItem("noomis_instagram_reels");
    sessionStorage.removeItem("noomis_instagram_reels_v2");
  } catch (e) {}
}

const INSTA_STORAGE_KEY = "noomis_instagram_reels_v3";

export function InstagramReelSection() {
  const [videos, setVideos] = useState<InstagramVideoItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(INSTA_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (
            Array.isArray(parsed) &&
            !parsed.some((v: any) =>
              String(v.id || "").startsWith("fth-panel-") ||
              v.id === "insta-1" ||
              v.id === "insta-2" ||
              v.handle?.toLowerCase().includes("alnaya") ||
              v.caption?.toLowerCase().includes("alnaya") ||
              v.poster?.startsWith("data:image/webp") ||
              v.poster?.includes("photo-1611591475806-039775089201")
            )
          ) {
            return parsed;
          } else {
            localStorage.removeItem(INSTA_STORAGE_KEY);
          }
        }
      } catch (e) {}
    }
    return defaultInstagramVideos;
  });
  const [activeVideo, setActiveVideo] = useState<InstagramVideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeVideo) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  useEffect(() => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.instagramVideos)) {
          const cleanVideos = data.instagramVideos
            .filter((v: any) => !String(v.id || "").startsWith("fth-panel-") && v.id !== "insta-1" && v.id !== "insta-2")
            .map((v: any) => ({
              ...v,
              handle: (v.handle && !v.handle.toLowerCase().includes("alnaya") && !v.handle.toLowerCase().includes("gleam")) ? v.handle : "@noomi_s_couture",
              caption: (v.caption || "").replace(/alnaya\.in/gi, "noomiscouture.com").replace(/alnaya/gi, "Noomi's Couture").replace(/@noomiscouture(\.in)?/gi, "@noomi_s_couture"),
              instagramLink: (v.instagramLink && !v.instagramLink.toLowerCase().includes("alnaya") && !v.instagramLink.toLowerCase().includes("gleam"))
                ? v.instagramLink
                : "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr",
              poster: (v.poster?.startsWith("data:image/webp")
                ? "/uploads/images/charm-bangles-poster.jpg"
                : v.poster?.includes("photo-1611591475806-039775089201")
                ? "/images/noomis-brand-card.png"
                : v.poster) || "/images/noomis-brand-card.png",
            }));
          setVideos(cleanVideos);
          try {
            localStorage.setItem(INSTA_STORAGE_KEY, JSON.stringify(cleanVideos));
          } catch (e) {}
        }
      })
      .catch((e) => console.error("Error fetching Instagram videos:", e));
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeVideo) {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideo]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF7F2] py-10 sm:py-14 md:py-16 border-t border-[#EADBBE]/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8F7234] font-medium block">
              FOLLOW THE HOUSE
            </span>
          </div>

          <a
            href="https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-editorial text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1C1917] hover:text-[#C5A059] transition-colors"
          >
            <span>@noomi_s_couture</span>
            <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-[#C5A059]" />
          </a>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto">
            Swipe through our latest styling reels, water tests, and styling inspiration.
          </p>
        </div>

        {/* Video Reels Horizontal Carousel */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#1C1917] shadow-xl border border-[#EADBBE] flex items-center justify-center hover:bg-[#1C1917] hover:text-white transition-all active:scale-95"
              aria-label="Previous reels"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#1C1917] shadow-xl border border-[#EADBBE] flex items-center justify-center hover:bg-[#1C1917] hover:text-white transition-all active:scale-95"
              aria-label="Next reels"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1 scroll-smooth"
          >
            {videos.map((vid) => (
              <AutoPlayingInstaCard
                key={vid.id}
                vid={vid}
                onClick={() => setActiveVideo(vid)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA to Instagram Profile */}
        <div className="text-center pt-2">
          <a
            href="https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @noomi_s_couture on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Video Modal Player (Expanded View with Audio) */}
      {mounted && activeVideo && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[360px] sm:max-w-[400px] bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 animate-in zoom-in-95 duration-200 flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate max-w-[180px] sm:max-w-[220px]">{activeVideo.title}</h4>
                  <p className="text-[10px] text-stone-400 truncate">{activeVideo.handle && !activeVideo.handle.toLowerCase().includes("alnaya") && !activeVideo.handle.toLowerCase().includes("gleam") ? activeVideo.handle : "@noomi_s_couture"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative flex-1 min-h-0 max-h-[58vh] sm:max-h-[64vh] bg-black flex items-center justify-center overflow-hidden">
              {activeVideo.embedUrl ? (
                <iframe
                  src={activeVideo.embedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoPlayerRef}
                  src={activeVideo.videoUrl}
                  poster={
                    activeVideo.poster && !activeVideo.poster.startsWith("data:image/webp")
                      ? activeVideo.poster
                      : undefined
                  }
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full max-h-[58vh] sm:max-h-[64vh] object-contain"
                />
              )}
            </div>

            {/* Caption & Instagram CTA Bar */}
            <div className="flex-shrink-0 p-3.5 sm:p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3 text-white">
              <div className="space-y-0.5 min-w-0 max-w-[65%]">
                <p className="text-xs font-semibold truncate">{activeVideo.title}</p>
                <p className="text-[11px] text-stone-400 line-clamp-1">{activeVideo.caption?.replace(/alnaya\.in/gi, "noomiscouture.com").replace(/alnaya/gi, "Noomi's Couture")}</p>
              </div>

              {activeVideo.instagramLink && (
                <a
                  href={activeVideo.instagramLink?.replace(/alnaya\.in/gi, "noomiscouture.com").replace(/alnaya/gi, "noomiscouture") || "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#E1306C] text-white text-xs font-semibold hover:bg-[#C1275B] transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>View Post</span>
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
