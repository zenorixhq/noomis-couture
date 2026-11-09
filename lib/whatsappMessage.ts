import { Order, CartItem } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";

export type WhatsAppMessageType = "confirmed" | "shipped" | "delivered";

export interface WhatsAppMessageOptions {
  type?: WhatsAppMessageType;
  courierName?: string;
  trackingNumber?: string;
  customNote?: string;
}

/**
 * Clean phone number to standard international format without +, spaces or hyphens.
 * Defaults to Indian country code 91 if a 10-digit number is provided.
 */
export function cleanWhatsAppNumber(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Formats order items into an elegant, readable list for WhatsApp.
 */
function formatOrderItemsForWhatsApp(items: any[]): string {
  if (!items || items.length === 0) return "• 1x Luxury Jewelry Selection";

  return items
    .map((item, idx) => {
      const qty = item.quantity || 1;
      const title = item.title || item.name || "Jewelry Piece";
      const price = item.price ? ` — ${formatPrice(item.price * qty)}` : "";

      // Check variant options
      let variantText = "";
      if (item.selectedVariant?.options) {
        const entries = Object.entries(item.selectedVariant.options);
        if (entries.length > 0) {
          variantText = `\n    _(${entries.map(([k, v]) => `${k}: ${v}`).join(", ")})_`;
        }
      } else if (item.variantName) {
        variantText = `\n    _(${item.variantName})_`;
      }

      return `${idx + 1}. *${title}* x${qty}${price}${variantText}`;
    })
    .join("\n");
}

/**
 * Generates an ultra-luxury, beautifully formatted WhatsApp message
 * for confirmed, shipped, or delivered customer orders.
 */
export function generateWhatsAppOrderMessage(
  order: Order | any,
  options: WhatsAppMessageOptions = {}
): string {
  const type = options.type || "confirmed";
  const customerName =
    order.customer?.fullName ||
    order.customer?.name ||
    order.customerName ||
    "Valued Patron";

  const customerPhone =
    order.customer?.phone ||
    order.customerPhone ||
    "";

  // Address assembly
  const street =
    order.customer?.address?.street ||
    order.customer?.shippingAddress?.line1 ||
    order.shippingAddress ||
    "";
  const city =
    order.customer?.address?.city ||
    order.customer?.shippingAddress?.city ||
    order.city ||
    "";
  const state =
    order.customer?.address?.state ||
    order.customer?.shippingAddress?.state ||
    order.state ||
    "";
  const postalCode =
    order.customer?.address?.postalCode ||
    order.customer?.shippingAddress?.postalCode ||
    order.postalCode ||
    "";
  const country =
    order.customer?.address?.country ||
    order.customer?.shippingAddress?.country ||
    order.country ||
    "India";

  const addressLines = [street, city, state ? `${state} - ${postalCode}` : postalCode, country]
    .filter(Boolean)
    .join(", ");

  const orderNumber = order.orderNumber || order.id || "NC-LIVE";
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const itemsList = formatOrderItemsForWhatsApp(order.items || []);
  const grandTotal = formatPrice(order.grandTotal || 0);
  const subtotal = formatPrice(order.subtotal || order.grandTotal || 0);
  const shipping = order.shippingFee === 0 || !order.shippingFee ? "FREE (VIP Express)" : formatPrice(order.shippingFee);

  const discountVal = order.discountTotal || order.discount || 0;
  const discountLine =
    discountVal > 0
      ? `• *1st Purchase Special (5% OFF):* -${formatPrice(discountVal)}\n`
      : "";

  const courier = options.courierName || "DTDC Express / India Post";
  const trackingNumber =
    options.trackingNumber ||
    order.trackingNumber ||
    `DTDC-IN-${orderNumber.replace(/\D/g, "") || "94821"}`;

  // 1. Order Confirmed & In Preparation
  if (type === "confirmed") {
    return `━━━━━━━━━━━━━━━━━━━━━
✨ *N O O M I ' S  C O U T U R E* ✨
_Wear Your Confidence • Everyday Luxury_
━━━━━━━━━━━━━━━━━━━━━

Dear *${customerName}*,

Thank you for choosing *Noomi's Couture*! We are delighted to confirm that your order *#${orderNumber}* has been verified and is now being lovingly prepared by our boutique atelier. 💍✨

📦 *ORDER SPECIFICATIONS*
• *Order Reference:* *#${orderNumber}*
• *Order Date:* ${orderDate}
• *Payment Status:* ✅ *Payment Verified*
• *Packaging:* Signature Velvet Box & Dust Pouch

💎 *CURATED PIECES*
${itemsList}

💰 *PRICE BREAKDOWN*
• *Subtotal:* ${subtotal}
${discountLine}• *Express Shipping:* ${shipping}
• *Grand Total:* *${grandTotal}*

📍 *DISPATCH DESTINATION*
*${customerName}*
${addressLines}
${customerPhone ? `📞 Contact: +${cleanWhatsAppNumber(customerPhone)}\n` : ""}
⏱️ *DISPATCH & LOGISTICS TIMELINE*
Your jewelry will be hand-inspected under magnification and dispatched within *24 to 48 business hours*. Tracking details will be shared the moment your parcel leaves our fulfillment center. 🚚

🛡️ *OUR EVERYDAY LUXURY PROMISE*
• *100% Waterproof & Anti-Tarnish:* Crafted in premium surgical-grade 304 & 316L stainless steel with 18K mirror gold finish. Shower, swim, and wear daily with zero fading! 💧
• *360° Unboxing Video:* Kindly record a continuous 360° unboxing video without cuts when opening your parcel for seamless transit guarantee. 📹
${options.customNote ? `\n💬 *Note from Atelier:*\n_${options.customNote}_\n` : ""}
If you have any questions or custom requests, simply reply to this WhatsApp message!

With warm regards,
*Noomi's Couture Atelier*
_Wear Your Confidence Daily_ 💖
━━━━━━━━━━━━━━━━━━━━━`;
  }

  // 2. Dispatched with Tracking
  if (type === "shipped") {
    return `━━━━━━━━━━━━━━━━━━━━━
✨ *N O O M I ' S  C O U T U R E* ✨
_Wear Your Confidence • Everyday Luxury_
━━━━━━━━━━━━━━━━━━━━━

Dear *${customerName}*,

Wonderful news! Your jewelry parcel for Order *#${orderNumber}* has been hand-inspected, safely sealed in our signature packaging, and dispatched! 🚚✨

📦 *COURIER & TRACKING DETAILS*
• *Carrier Partner:* *${courier}*
• *Tracking AWB:* *${trackingNumber}*
• *Status:* 🚀 *In Transit*
• *Estimated Delivery:* 3 – 5 Business Days

💍 *ITEMS IN THIS SHIPMENT*
${itemsList}

📍 *DELIVERING TO*
*${customerName}*
${addressLines}

📹 *360° UNBOXING VIDEO REMINDER*
Please remember to record an uninterrupted, continuous 360° video while opening your parcel (from inspecting the sealed outer envelope to unboxing the jewelry) to activate your complete transit guarantee.

Thank you for trusting *Noomi's Couture* to elevate your daily style! 💍

Warm regards,
*Noomi's Couture Concierge*
_WhatsApp: +91 96339 56222_ 💖
━━━━━━━━━━━━━━━━━━━━━`;
  }

  // 3. Delivered & Care Guide
  return `━━━━━━━━━━━━━━━━━━━━━
✨ *N O O M I ' S  C O U T U R E* ✨
_Wear Your Confidence • Everyday Luxury_
━━━━━━━━━━━━━━━━━━━━━

Dear *${customerName}*,

According to our delivery partner, your *Noomi's Couture* parcel *#${orderNumber}* has been delivered! 🎉💍

We hope you fall in love with your new anti-tarnish jewelry piece the moment you wear it!

💎 *JEWELRY CARE ADVISORY*
• Your pieces are 100% waterproof, sweatproof, and hypoallergenic.
• To maintain their lustrous 18K mirror gold shine, simply wipe occasionally with a soft microfiber cloth.
• Store in your Noomi's velvet pouch when not in daily use.

📸 *FLAUNT & EARN VIP REWARDS*
Tag us on Instagram *@noomiscouture* with *#WearYourConfidence* to be featured on our feed and receive an exclusive VIP discount on your next collection order! ✨

Have any questions? Simply reply to this chat!

With love,
*Team Noomi's Couture* 💖
━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Generates direct WhatsApp click-to-chat URL.
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  const clean = cleanWhatsAppNumber(phone);
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${clean}?text=${encoded}`;
}
