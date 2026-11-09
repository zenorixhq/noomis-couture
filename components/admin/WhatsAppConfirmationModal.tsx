"use client";

import { useState, useEffect, useMemo } from "react";
import { Order, OrderStatus } from "@/types/store";
import {
  generateWhatsAppOrderMessage,
  cleanWhatsAppNumber,
  getWhatsAppUrl,
  WhatsAppMessageType,
} from "@/lib/whatsappMessage";
import {
  X,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Send,
  Truck,
  CheckCircle2,
  Sparkles,
  Phone,
  Package,
} from "lucide-react";

interface WhatsAppConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export function WhatsAppConfirmationModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: WhatsAppConfirmationModalProps) {
  const [messageType, setMessageType] = useState<WhatsAppMessageType>("confirmed");
  const [phone, setPhone] = useState("");
  const [courierName, setCourierName] = useState("DTDC Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);

  // Initialize data when modal opens with an order
  useEffect(() => {
    if (order) {
      const initialPhone =
        order.customer?.phone ||
        (order as any).customerPhone ||
        "";
      setPhone(cleanWhatsAppNumber(initialPhone));

      const defaultTracking =
        order.trackingNumber ||
        `DTDC-IN-${(order.orderNumber || order.id || "84920").replace(/\D/g, "") || "94821"}`;
      setTrackingNumber(defaultTracking);

      // Preselect tab based on order status
      if (order.status === "shipped") {
        setMessageType("shipped");
      } else if (order.status === "delivered") {
        setMessageType("delivered");
      } else {
        setMessageType("confirmed");
      }
    }
  }, [order]);

  const beautifiedMessage = useMemo(() => {
    if (!order) return "";
    return generateWhatsAppOrderMessage(order, {
      type: messageType,
      courierName,
      trackingNumber,
      customNote,
    });
  }, [order, messageType, courierName, trackingNumber, customNote]);

  if (!isOpen || !order) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(beautifiedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleSendWhatsApp = () => {
    if (!phone) {
      alert("Please provide a valid customer phone number for WhatsApp.");
      return;
    }

    // Auto-update order status when sending dispatch message
    if (messageType === "shipped" && order.status !== "shipped" && onUpdateStatus) {
      onUpdateStatus(order.id, "shipped");
    } else if (messageType === "confirmed" && order.status === "pending" && onUpdateStatus) {
      onUpdateStatus(order.id, "processing");
    } else if (messageType === "delivered" && order.status !== "delivered" && onUpdateStatus) {
      onUpdateStatus(order.id, "delivered");
    }

    const waUrl = getWhatsAppUrl(phone, beautifiedMessage);
    window.open(waUrl, "_blank");
  };

  const orderNum = order.orderNumber || order.id;
  const customerName =
    order.customer?.fullName ||
    (order.customer as any)?.name ||
    (order as any).customerName ||
    "Customer";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with WhatsApp Emerald Accent */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#075E54] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm">
              <MessageSquare className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                WhatsApp Order Confirmation
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                {orderNum} • {customerName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. Message Template Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              Confirmation Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMessageType("confirmed")}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  messageType === "confirmed"
                    ? "bg-[#25D366]/15 border-[#25D366] text-[#075E54] dark:text-[#25D366] shadow-xs"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">1. Order Confirmed</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType("shipped")}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  messageType === "shipped"
                    ? "bg-[#25D366]/15 border-[#25D366] text-[#075E54] dark:text-[#25D366] shadow-xs"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">2. Dispatched (AWB)</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType("delivered")}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  messageType === "delivered"
                    ? "bg-[#25D366]/15 border-[#25D366] text-[#075E54] dark:text-[#25D366] shadow-xs"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">3. Delivered & Care</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Phone & Delivery Variables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-primary" />
                <span>Recipient WhatsApp Phone</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground font-mono text-xs focus:ring-1 focus:ring-[#25D366]"
                />
              </div>
            </div>

            {messageType === "shipped" ? (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3 h-3 text-primary" />
                  <span>Courier &amp; Tracking AWB</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-1/2 px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs"
                  >
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="India Post Speed Post">India Post</option>
                    <option value="BlueDart Express">BlueDart</option>
                    <option value="Delhivery Express">Delhivery</option>
                    <option value="Express Courier">Express Courier</option>
                  </select>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="AWB Number"
                    className="w-1/2 px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground font-mono text-xs focus:ring-1 focus:ring-[#25D366]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Optional Note / Instructions
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Ring sized to 2.4 Kada per request."
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs focus:ring-1 focus:ring-[#25D366]"
                />
              </div>
            )}
          </div>

          {/* 3. Live Beautified WhatsApp Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Beautified Message Preview</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
              </button>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="relative rounded-xl border border-[#25D366]/30 bg-[#ECE5DD] dark:bg-[#0B141B] p-3.5 sm:p-4 font-sans shadow-inner max-h-64 overflow-y-auto">
              <div className="bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] rounded-xl p-3 sm:p-3.5 shadow-sm text-[11px] leading-relaxed whitespace-pre-wrap font-sans border border-black/5 dark:border-white/5 selection:bg-[#25D366]/30">
                {beautifiedMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-muted/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            Sends directly via official WhatsApp Web / Mobile to <strong className="text-foreground">+{phone || "number"}</strong>
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Send on WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
