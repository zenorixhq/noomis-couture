"use client";

import { useState, useEffect } from "react";
import {
  X,
  Ruler,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Truck,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Video,
  FileText,
  Maximize2,
} from "lucide-react";
import { storeConfig } from "@/config/store.config";

export type PolicyTab =
  | "size-guide"
  | "return-refund"
  | "ordering-instructions"
  | "care-guide"
  | "shipping";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export function PolicyModal({
  isOpen,
  onClose,
  initialTab = "size-guide",
}: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [sizeSubTab, setSizeSubTab] = useState<"ring" | "bangle">("ring");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Listen to escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedImage) {
          setZoomedImage(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, zoomedImage, onClose]);

  if (!isOpen) return null;

  const tabs: { id: PolicyTab; label: string; icon: typeof Ruler; badge?: string }[] = [
    { id: "size-guide", label: "Size Guide", icon: Ruler, badge: "Bangles & Rings" },
    { id: "return-refund", label: "Return & Refund", icon: RotateCcw, badge: "Important" },
    { id: "ordering-instructions", label: "Before Ordering", icon: AlertCircle, badge: "Must Read" },
    { id: "care-guide", label: "Jewelry Care", icon: Sparkles, badge: "304 & 306 Steel" },
    { id: "shipping", label: "Shipping Policy", icon: Truck, badge: "DTDC & India Post" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (zoomedImage) setZoomedImage(null);
          else onClose();
        }}
      />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Noomi&apos;s Couture Customer Care &amp; Policy Guide
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Official specifications, sizing charts, and store policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b border-border bg-card overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content Body */}
        <div data-lenis-prevent className="p-5 sm:p-8 overflow-y-auto max-h-[calc(92vh-140px)] space-y-6 text-foreground">
          {/* ======================================================== */}
          {/* TAB 1: SIZE GUIDE                                        */}
          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* TAB 1: SIZE GUIDE                                        */}
          {/* ======================================================== */}
          {activeTab === "size-guide" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Ring & Bangle Size Guide
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official Noomi&apos;s Couture size charts and easy measurement instructions.
                  </p>
                </div>

                {/* Sub-toggle: Ring vs Bangle */}
                <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setSizeSubTab("ring")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      sizeSubTab === "ring"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Ring Size Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeSubTab("bangle")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      sizeSubTab === "bangle"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Bangle Size Guide
                  </button>
                </div>
              </div>

              {/* ================= RING SIZE GUIDE ================= */}
              {sizeSubTab === "ring" && (
                <div className="space-y-6 animate-in fade-in-50">
                  {/* 1. SIZE CHART */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        <span>Official Ring Measurement Chart</span>
                      </h5>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Adjustable bands fit sizes 5–10
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                          <tr>
                            <th className="p-3">Ring Size</th>
                            <th className="p-3">Finger Circumference (cm)</th>
                            <th className="p-3">Circumference (mm)</th>
                            <th className="p-3">Suggested Finger / Fit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 5</td>
                            <td className="p-3 font-mono font-bold">5.0 cm</td>
                            <td className="p-3 font-mono">50 mm</td>
                            <td className="p-3 text-muted-foreground">Petite / Pinky Finger</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 6</td>
                            <td className="p-3 font-mono font-bold">5.5 cm</td>
                            <td className="p-3 font-mono">55 mm</td>
                            <td className="p-3 text-muted-foreground">Petite Ring Finger</td>
                          </tr>
                          <tr className="bg-primary/5 hover:bg-primary/10">
                            <td className="p-3 font-bold text-primary flex items-center gap-1.5">
                              <span>Size 7</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary text-primary-foreground">
                                Most Popular
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-foreground">6.0 cm</td>
                            <td className="p-3 font-mono font-bold text-foreground">60 mm</td>
                            <td className="p-3 font-semibold text-foreground">Standard Ring Finger</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 8</td>
                            <td className="p-3 font-mono font-bold">6.5 cm</td>
                            <td className="p-3 font-mono">65 mm</td>
                            <td className="p-3 text-muted-foreground">Medium / Middle Finger</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 9</td>
                            <td className="p-3 font-mono font-bold">7.0 cm</td>
                            <td className="p-3 font-mono">70 mm</td>
                            <td className="p-3 text-muted-foreground">Middle / Index Finger</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 10</td>
                            <td className="p-3 font-mono font-bold">7.5 cm</td>
                            <td className="p-3 font-mono">75 mm</td>
                            <td className="p-3 text-muted-foreground">Index / Thumb Ring</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 11</td>
                            <td className="p-3 font-mono font-bold">8.0 cm</td>
                            <td className="p-3 font-mono">80 mm</td>
                            <td className="p-3 text-muted-foreground">Thumb / Statement Ring</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 12</td>
                            <td className="p-3 font-mono font-bold">8.5 cm</td>
                            <td className="p-3 font-mono">85 mm</td>
                            <td className="p-3 text-muted-foreground">Statement / Large Fit</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 13</td>
                            <td className="p-3 font-mono font-bold">9.0 cm</td>
                            <td className="p-3 font-mono">90 mm</td>
                            <td className="p-3 text-muted-foreground">Extra Large Fit</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 14</td>
                            <td className="p-3 font-mono font-bold">9.5 cm</td>
                            <td className="p-3 font-mono">95 mm</td>
                            <td className="p-3 text-muted-foreground">Extra Large / Thumb Fit</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>
                        <strong>Adjustable Comfort Bands:</strong> Rings labeled <em>Adjustable / Free Size</em> feature an open comfort band that effortlessly adjusts to fit sizes 5 through 10 without needing tools.
                      </span>
                    </div>
                  </div>

                  {/* 2. HOW TO MEASURE */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      How to Measure Your Ring Size (Simple 4-Step Method)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 1: Wrap Paper or String</span>
                        <p className="text-muted-foreground">
                          Cut a thin strip of paper or string. Wrap it snugly around the base of the finger you plan to wear your ring on.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 2: Mark the Overlap</span>
                        <p className="text-muted-foreground">
                          With a pen, mark the exact spot where the paper strip meets and completes a full loop around your finger.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 3: Measure Length in CM</span>
                        <p className="text-muted-foreground">
                          Lay the paper flat against a standard ruler and note the length in centimeters (e.g., 6.0 cm = Size 7).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 4: Check Knuckle Fit</span>
                        <p className="text-muted-foreground">
                          If your knuckle is larger than the base of your finger, measure your knuckle too. If in-between two sizes, always pick the larger size.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= BANGLE SIZE GUIDE ================= */}
              {sizeSubTab === "bangle" && (
                <div className="space-y-6 animate-in fade-in-50">
                  {/* 1. SIZE CHART FIRST */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      <span>Official Bangle Size Chart</span>
                    </h5>
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                          <tr>
                            <th className="p-3">Bangle Size</th>
                            <th className="p-3">Inside Diameter (Inches)</th>
                            <th className="p-3">Inside Diameter (cm)</th>
                            <th className="p-3">Fit Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 2.2</td>
                            <td className="p-3">2.125 in (2 1/8&quot;)</td>
                            <td className="p-3 font-mono">5.40 cm</td>
                            <td className="p-3 text-muted-foreground">Petite / Small wrist fit</td>
                          </tr>
                          <tr className="bg-primary/5 hover:bg-primary/10">
                            <td className="p-3 font-bold text-primary flex items-center gap-1.5">
                              <span>Size 2.6</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary text-primary-foreground">
                                Most Popular
                              </span>
                            </td>
                            <td className="p-3 font-semibold">2.375 in (2 3/8&quot;)</td>
                            <td className="p-3 font-mono font-semibold">6.03 cm</td>
                            <td className="p-3 font-semibold text-foreground">Standard Medium wrist fit</td>
                          </tr>
                          <tr className="hover:bg-muted/20">
                            <td className="p-3 font-bold text-primary">Size 2.8</td>
                            <td className="p-3">2.500 in (2 1/2&quot;)</td>
                            <td className="p-3 font-mono">6.35 cm</td>
                            <td className="p-3 text-muted-foreground">Large wrist fit</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. HOW TO MEASURE SECOND */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      How to Measure Your Bangle Size (5 Easy Steps)
                    </h5>

                    {/* Graphic Banner & Diagram */}
                    <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/20">
                      <img
                        src="/images/bangle-size-guide.jpg"
                        alt="Noomi's Couture Official Bangle Size Guide & Hand Measurement Steps"
                        className="w-full h-auto max-h-[360px] object-contain mx-auto"
                      />
                      <button
                        onClick={() => setZoomedImage("/images/bangle-size-guide.jpg")}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur border border-border shadow text-xs font-semibold flex items-center gap-1.5 text-foreground hover:bg-background"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Click to Enlarge Diagram</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 1: Fold Hand</span>
                        <p className="text-muted-foreground">
                          Fold your thumb and little finger together towards the center of your palm, as if you are slipping on a bangle.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 2: Wrap Tape or Paper</span>
                        <p className="text-muted-foreground">
                          Use a flexible measuring tape or strip of paper. Wrap it around the widest part of your hand across knuckles and thumb base.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 3: Mark & Measure</span>
                        <p className="text-muted-foreground">
                          Mark where the tape or paper overlaps with a pen. Lay it flat against a ruler and measure the length in centimeters (cm) or inches.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
                        <span className="font-bold text-primary">Step 4: Compare with Chart</span>
                        <p className="text-muted-foreground">
                          Match your measurement to our official Bangle Size Chart above to identify your size (2.2 to 2.8).
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>
                        <strong>Pro Fit Tip (Step 5):</strong> If you prefer a loose, playful fit, choose one size up. For a snug, sleek everyday fit, select the exact diameter.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: RETURN & REFUND POLICY                           */}
          {/* ======================================================== */}
          {activeTab === "return-refund" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Return, Refund & Replacement Policy
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Clear guidelines to protect both our valued customers and brand authenticity.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Strict Unboxing Video Required
                </span>
              </div>

              {/* Graphic Banner */}
              <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/20">
                <img
                  src="/images/return-refund-policy.jpg"
                  alt="Noomi's Couture Official Return, Refund and Damage Replacement Policy"
                  className="w-full h-auto max-h-[380px] object-contain mx-auto"
                />
                <button
                  onClick={() => setZoomedImage("/images/return-refund-policy.jpg")}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur border border-border shadow text-xs font-semibold flex items-center gap-1.5 text-foreground hover:bg-background"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge Policy</span>
                </button>
              </div>

              {/* Policy Key Points */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 space-y-2">
                  <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>No Cancellations, Returns or Refunds</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once an order has been confirmed and placed with Noomi&apos;s Couture, cancellations, returns, or refunds are strictly NOT accepted under any conditions. Please review your selected jewelry pieces, sizing, and shipping address carefully prior to confirming your order.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Replacements for Damaged Pieces Only</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We stand firmly behind the quality of our craftsmanship. If you receive a damaged piece during transit, we provide an immediate, free replacement piece.
                  </p>
                </div>

                {/* 360 Video Requirements Box */}
                <div className="p-5 rounded-xl bg-card border-2 border-primary/40 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Video className="w-5 h-5 flex-shrink-0" />
                    <span>Mandatory Continuous 360° Unboxing Video</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    To be eligible for a replacement, a continuous, unedited 360-degree unboxing video is <strong>strictly mandatory</strong>:
                  </p>

                  <ul className="space-y-2 text-xs text-muted-foreground pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Start Before Opening:</strong> The recording must start before the sealed courier package is opened.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Clear 360° View of Parcel:</strong> Show all sides of the parcel, clearly displaying the shipping label, recipient details, and courier tracking barcode.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>No Cuts or Edits:</strong> The video must be continuous and uninterrupted without any cuts, pauses, or edits.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Open on Camera:</strong> Open the package on camera and inspect the damaged item under clear lighting.
                      </span>
                    </li>
                  </ul>

                  <div className="pt-2 text-xs text-destructive font-medium border-t border-border/80">
                    ⚠️ Notice: Without a clear, continuous unboxing video starting from the sealed outer package, replacement claims cannot be entertained under any circumstances.
                  </div>
                </div>

                {/* Reporting Window */}
                <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Damage Reporting Window
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Must be reported within <strong>24 hours of delivery</strong> with video & Order ID.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}?text=${encodeURIComponent(
                        "Hello Noomi's Couture! I would like to report transit damage on my order. Here is my Order ID and unboxing video."
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#20bd5a] transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Report via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: IMPORTANT INSTRUCTIONS BEFORE ORDERING            */}
          {/* ======================================================== */}
          {activeTab === "ordering-instructions" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Important Instructions Before Ordering
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Essential information to ensure smooth courier delivery and perfect fulfillment.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Pre-Order Checklist
                </span>
              </div>


              {/* Instructions Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Point 1 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Phone className="w-4 h-4" />
                      <span>1. Provide 2 Active Contact Numbers</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Please provide 2 active contact numbers (preferably WhatsApp) when placing your order. This allows our courier partners (DTDC / India Post) to coordinate delivery seamlessly and prevents delivery delays or returns.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <FileText className="w-4 h-4" />
                      <span>2. Photo Confirmation Before Dispatch</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We share real product photos and packaging confirmation directly on WhatsApp prior to courier handover. You see exactly what is being sent to you with complete peace of mind.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>3. Surprise & Gift Orders</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      If your order is a gift or surprise, please mention it in the order notes or message us on WhatsApp so we can provide special luxury packaging and exclude price tags from the invoice package.
                    </p>
                  </div>

                  {/* Point 4 */}
                  <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>4. 100% Prepaid Orders (No COD)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      To facilitate instant courier dispatch via DTDC Express & India Post, all orders are 100% prepaid via UPI (GPay, PhonePe, Paytm, QR Code) or Bank Transfer. Cash on Delivery (COD) is not available.
                    </p>
                  </div>
                </div>

                {/* Point 5 Banner */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <strong>5. Verify Address & PIN Code:</strong> Please ensure your complete door/flat number, building name, street, nearest landmark, and correct 6-digit postal PIN code are accurately entered at checkout.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: JEWELRY CARE GUIDE                               */}
          {/* ======================================================== */}
          {activeTab === "care-guide" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Jewelry Care Guide (304 & 306 Grade Steel)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How to care for your anti-tarnish, waterproof everyday luxury pieces.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  100% Waterproof Certified
                </span>
              </div>

              {/* Steel Specs Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Base Material</span>
                  <p className="text-sm font-black text-foreground">304 & 306 Stainless Steel</p>
                  <p className="text-[11px] text-muted-foreground">Surgical grade & non-corrosive</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Gold Coating</span>
                  <p className="text-sm font-black text-foreground">Real 18K PVD Gold</p>
                  <p className="text-[11px] text-muted-foreground">10x more durable than electroplate</p>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-1">
                  <span className="text-xs font-bold text-primary uppercase">Skin Safety</span>
                  <p className="text-sm font-black text-foreground">100% Hypoallergenic</p>
                  <p className="text-[11px] text-muted-foreground">Nickel-free & lead-free</p>
                </div>
              </div>

              {/* Care Tips */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Simple Care Instructions
                </h5>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Waterproof & Shower Safe:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        You can wear your Noomi&apos;s Couture pieces freely in the shower, gym, pool, ocean, or while washing hands. They will not rust, fade, or tarnish.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Perfumes & Lotions:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        While 304 and 306 steel does not oxidize, harsh chemicals in perfumes or body mists can leave a dull film over high-polish gold. We recommend applying cosmetics first, allowing them to dry, then putting on your jewelry.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Gentle Cleaning:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        Wipe your pieces occasionally with a soft microfiber cloth or rinse with mild soapy warm water and pat dry to maintain instant mirror shine.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">Proper Storage:</strong>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        When not in use, store each piece separately in your complimentary Noomi&apos;s Couture zip pouch to prevent friction against hard surfaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SHIPPING POLICY (DTDC & INDIA POST)              */}
          {/* ======================================================== */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    Shipping Policy (DTDC & India Post)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fast, secure Pan-India delivery with live SMS & WhatsApp tracking.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Free Over ₹999 • Kerala ₹50 • Outside ₹70
                </span>
              </div>

              {/* Courier Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                    DTDC
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">DTDC Express Courier</h5>
                    <p className="text-xs text-muted-foreground">
                      Air & Surface Express with direct doorstep courier dispatch.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                    SPEED
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground">India Post (Speed Post)</h5>
                    <p className="text-xs text-muted-foreground">
                      100% Pan-India PIN code coverage reaching every city, town & village.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rates & Timelines */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Shipping Rates & Delivery Timelines
                </h5>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 text-foreground font-bold border-b border-border">
                      <tr>
                        <th className="p-3">Destination / Order Value</th>
                        <th className="p-3">Courier Fee</th>
                        <th className="p-3">Estimated Transit Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Kerala Orders (Below ₹999)</td>
                        <td className="p-3 font-bold text-primary">₹50</td>
                        <td className="p-3 text-muted-foreground">2 – 3 Business Days</td>
                      </tr>
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Outside Kerala / Rest of India (Below ₹999)</td>
                        <td className="p-3 font-bold text-primary">₹70</td>
                        <td className="p-3 text-muted-foreground">3 – 5 Business Days</td>
                      </tr>
                      <tr className="bg-primary/5 hover:bg-primary/10">
                        <td className="p-3 font-bold text-primary">All Orders ₹999 and Above</td>
                        <td className="p-3 font-bold text-emerald-600">FREE Delivery</td>
                        <td className="p-3 font-semibold text-foreground">2 – 5 Business Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Tracking Information */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Live Tracking & Order Updates</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As soon as your parcel is packed and handed over to DTDC or India Post, you will receive an automated tracking link with consignment details directly via WhatsApp and SMS. You can follow your package in real-time until it safely arrives at your doorstep.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-border bg-muted/20 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-3.5 h-3.5 text-primary" />
            <span>Need assistance? WhatsApp +91 96339 56222</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>

      {/* Fullscreen Image Zoom Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in-0"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl my-auto max-h-[90vh] overflow-hidden flex items-center justify-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
              aria-label="Close enlarged preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Enlarged policy guide"
              className="w-auto h-auto max-w-full max-h-[85vh] rounded-xl object-contain mx-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
