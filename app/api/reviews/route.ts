import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dataFilePath = path.join(process.cwd(), "data", "clientReviews.json");

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function getInitialData() {
  return {
    reviews: [],
    videoReels: [],
    feedbackScreenshots: [],
    instagramVideos: [],
  };
}

function sanitizeData(parsed: any) {
  if (!parsed || typeof parsed !== "object") return { sanitized: getInitialData(), wasDirty: false };
  if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
  if (!Array.isArray(parsed.videoReels)) parsed.videoReels = [];
  if (!Array.isArray(parsed.feedbackScreenshots)) parsed.feedbackScreenshots = [];
  if (!Array.isArray(parsed.instagramVideos)) parsed.instagramVideos = [];

  let wasDirty = false;

  // 1. Sanitize Screenshots: Ensure valid image URLs
  parsed.feedbackScreenshots = parsed.feedbackScreenshots.map((item: any) => {
    let img = (item.imageUrl || "").trim();
    if (!img || img.includes("photo-1611591475806-039775089201")) {
      wasDirty = true;
      img = "/uploads/screenshots/customer-review-whatsapp-1.jpg";
    }
    return { ...item, imageUrl: img };
  });

  // 2. Sanitize Video Reels:
  parsed.videoReels = parsed.videoReels.map((item: any) => {
    let poster = (item.poster || "").trim();
    if (poster.startsWith("data:image/webp") || poster.includes("photo-1611591475806-039775089201") || !poster) {
      wasDirty = true;
      poster = "/images/noomis-brand-card.png";
    }
    let handle = (item.handle || "").trim();
    if (!handle || handle.toLowerCase().includes("alnaya") || handle.toLowerCase().includes("gleam")) {
      handle = "@noomi_s_couture";
      wasDirty = true;
    }
    let influencer = (item.influencer || "").trim();
    if (influencer.toLowerCase().includes("alnaya") || influencer.toLowerCase().includes("gleam")) {
      influencer = "noomi_s_couture";
      wasDirty = true;
    }
    return { ...item, poster, handle, influencer };
  });

  // 3. Sanitize Instagram Videos: Purge obsolete placeholder panels and enforce @noomi_s_couture
  const initialInstaCount = parsed.instagramVideos.length;
  parsed.instagramVideos = parsed.instagramVideos.filter((item: any) => {
    const id = String(item.id || "");
    if (id.startsWith("fth-panel-") || id === "insta-1" || id === "insta-2") {
      wasDirty = true;
      return false;
    }
    return true;
  });

  if (parsed.instagramVideos.length !== initialInstaCount) {
    wasDirty = true;
  }

  parsed.instagramVideos = parsed.instagramVideos.map((item: any) => {
    let poster = (item.poster || "").trim();
    if (poster.startsWith("data:image/webp")) {
      wasDirty = true;
      poster = "/uploads/images/charm-bangles-poster.jpg";
    } else if (poster.includes("photo-1611591475806-039775089201") || !poster) {
      wasDirty = true;
      poster = "/images/noomis-brand-card.png";
    }

    let handle = (item.handle || "").trim();
    if (!handle || handle.toLowerCase().includes("alnaya") || handle.toLowerCase().includes("gleam") || handle === "@noomis.in" || handle === "@noomiscouture") {
      handle = "@noomi_s_couture";
      wasDirty = true;
    }

    let caption = item.caption || "";
    if (caption.toLowerCase().includes("alnaya") || caption.toLowerCase().includes("gleam") || caption.includes("@noomiscouture") || caption.includes("@noomis.in")) {
      caption = caption
        .replace(/alnaya\.in/gi, "noomi_s_couture")
        .replace(/gleamnest/gi, "noomi_s_couture")
        .replace(/@noomiscouture/gi, "@noomi_s_couture")
        .replace(/@noomis\.in/gi, "@noomi_s_couture")
        .replace(/alnaya/gi, "Noomi's Couture");
      wasDirty = true;
    }

    let instagramLink = item.instagramLink || "";
    if (instagramLink.toLowerCase().includes("alnaya") || instagramLink.toLowerCase().includes("gleam") || instagramLink.includes("noomis.in")) {
      instagramLink = "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr";
      wasDirty = true;
    }

    return { ...item, poster, handle, caption, instagramLink };
  });

  return { sanitized: parsed, wasDirty };
}

async function readData() {
  let fileData = getInitialData();
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      const { sanitized } = sanitizeData(JSON.parse(content));
      fileData = sanitized;
    }
  } catch (e) {
    console.error("Error reading fallback clientReviews.json:", e);
  }

  // 1. Try reading from Neon PostgreSQL database
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: "client_reviews" },
    });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      const { sanitized, wasDirty } = sanitizeData(parsed);
      if (!Array.isArray(sanitized.videoReels)) {
        sanitized.videoReels = fileData.videoReels || [];
      }
      if (!Array.isArray(sanitized.instagramVideos)) {
        sanitized.instagramVideos = fileData.instagramVideos || [];
      }
      if (!Array.isArray(sanitized.feedbackScreenshots)) {
        sanitized.feedbackScreenshots = fileData.feedbackScreenshots || [];
      }
      if (!Array.isArray(sanitized.reviews)) {
        sanitized.reviews = fileData.reviews || [];
      }
      // If corrupted webp base64 or broken URLs were found in database, permanently clean the DB row
      if (wasDirty) {
        try {
          await prisma.siteContent.upsert({
            where: { key: "client_reviews" },
            update: { value: JSON.stringify(sanitized) },
            create: { key: "client_reviews", value: JSON.stringify(sanitized) },
          });
          console.log("Auto-sanitized and updated client_reviews in database.");
        } catch (dbErr) {
          console.warn("Could not auto-save sanitized reviews to database:", dbErr);
        }
      }
      return sanitized;
    }
  } catch (e) {
    console.warn("Database read for client_reviews unavailable, checking fallback file:", e);
  }

  return fileData;
}

async function writeData(data: any) {
  const jsonStr = JSON.stringify(data);
  let dbSuccess = false;

  // 1. Save to Neon PostgreSQL
  try {
    await prisma.siteContent.upsert({
      where: { key: "client_reviews" },
      update: { value: jsonStr },
      create: { key: "client_reviews", value: jsonStr },
    });
    dbSuccess = true;
  } catch (e) {
    console.error("Database write error for client_reviews:", e);
  }

  // 2. Also try writing to local disk (for local development persistence)
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    if (!dbSuccess) {
      console.warn("File write skipped on read-only filesystem and DB write was unsuccessful.");
    }
  }
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await readData();

    if (body.type === "screenshot") {
      const imageUrl = (body.imageUrl || "").trim();
      if (!imageUrl) {
        return NextResponse.json({ error: "Screenshot image is required" }, { status: 400 });
      }

      const newScreenshot = {
        id: `fb-${Date.now()}`,
        title: body.title || "WhatsApp / DM Customer Review",
        customerName: body.customerName || "Verified Buyer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        imageUrl: imageUrl,
        caption: body.caption || "",
        date: body.date || "Verified Recent Buyer",
      };

      if (!data.feedbackScreenshots) data.feedbackScreenshots = [];
      data.feedbackScreenshots.unshift(newScreenshot);
      await writeData(data);

      return NextResponse.json({ success: true, item: newScreenshot }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "instagramVideo") {
      let videoUrl = (body.videoUrl || "").trim();
      let instagramLink = (body.instagramLink || "").trim();

      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or Instagram link is required" }, { status: 400 });
      }

      // Add https protocol if missing and not a relative upload path or data url
      if (
        !videoUrl.startsWith("http://") &&
        !videoUrl.startsWith("https://") &&
        !videoUrl.startsWith("/") &&
        !videoUrl.startsWith("data:")
      ) {
        videoUrl = `https://${videoUrl}`;
      }
      if (
        instagramLink &&
        !instagramLink.startsWith("http://") &&
        !instagramLink.startsWith("https://") &&
        !instagramLink.startsWith("/")
      ) {
        instagramLink = `https://${instagramLink}`;
      }

      let embedUrl = "";
      const instaMatch = videoUrl.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
      if (instaMatch && instaMatch[1]) {
        embedUrl = `https://www.instagram.com/reel/${instaMatch[1]}/embed`;
        if (!instagramLink) {
          instagramLink = `https://www.instagram.com/reel/${instaMatch[1]}/`;
        }
      } else if (!instagramLink && videoUrl.includes("instagram.com")) {
        instagramLink = videoUrl;
      }

      const newInstaVideo = {
        id: `insta-${Date.now()}`,
        title: body.title || "Jewelry Styling Reel",
        handle: body.handle || "@noomi_s_couture",
        caption: body.caption || "Everyday luxury waterproof jewelry in 316L steel",
        videoUrl: videoUrl,
        embedUrl: embedUrl,
        poster: body.poster || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
        views: body.views || "15.2K",
        instagramLink: instagramLink || "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr",
      };

      if (!data.instagramVideos) data.instagramVideos = [];
      data.instagramVideos.unshift(newInstaVideo);
      await writeData(data);

      return NextResponse.json({ success: true, item: newInstaVideo }, { headers: NO_CACHE_HEADERS });
    } else if (body.type === "video") {
      let videoUrl = (body.videoUrl || "").trim();
      if (!videoUrl) {
        return NextResponse.json({ error: "Video URL or uploaded video is required" }, { status: 400 });
      }

      if (
        !videoUrl.startsWith("http://") &&
        !videoUrl.startsWith("https://") &&
        !videoUrl.startsWith("/") &&
        !videoUrl.startsWith("data:")
      ) {
        videoUrl = `https://${videoUrl}`;
      }

      const newVideo = {
        id: `vid-${Date.now()}`,
        influencer: body.influencer || "Noomi's Couture Client",
        handle: body.handle || "@noomi_s_couture",
        title: body.title || "Jewelry Styling Reel",
        poster: body.poster || "/images/noomis-brand-card.png",
        videoUrl: videoUrl,
        views: body.views || "1.2K views",
        productTitle: body.productTitle || "Noomi's Couture Jewelry",
        productSlug: body.productSlug || "all",
        productPrice: Number(body.productPrice) || 150,
      };

      if (!data.videoReels) data.videoReels = [];
      data.videoReels.unshift(newVideo);
      await writeData(data);

      return NextResponse.json({ success: true, item: newVideo }, { headers: NO_CACHE_HEADERS });
    } else {
      const newReview = {
        id: `rev-${Date.now()}`,
        author: body.author || "Verified Customer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        rating: Number(body.rating) || 5,
        quote: body.quote || "",
      };

      if (!data.reviews) data.reviews = [];
      data.reviews.unshift(newReview);
      await writeData(data);

      return NextResponse.json({ success: true, item: newReview }, { headers: NO_CACHE_HEADERS });
    }
  } catch (err: any) {
    console.error("Error in POST /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to add item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const data = await readData();
    const targetId = String(id).trim();

    if (type === "instagramVideo" || !type) {
      let found = false;
      data.instagramVideos = (data.instagramVideos || []).map((v: any) => {
        if (String(v.id).trim() === targetId) {
          found = true;
          return {
            ...v,
            ...(body.videoUrl !== undefined ? { videoUrl: body.videoUrl } : {}),
            ...(body.poster !== undefined ? { poster: body.poster } : {}),
            ...(body.title !== undefined ? { title: body.title } : {}),
            ...(body.caption !== undefined ? { caption: body.caption } : {}),
            ...(body.handle !== undefined ? { handle: body.handle } : {}),
            ...(body.views !== undefined ? { views: body.views } : {}),
            ...(body.instagramLink !== undefined ? { instagramLink: body.instagramLink } : {}),
          };
        }
        return v;
      });

      if (!found && body.videoUrl) {
        data.instagramVideos.push({
          id: targetId,
          title: body.title || "Jewelry Styling Reel",
          handle: body.handle || "@noomi_s_couture",
          caption: body.caption || "",
          videoUrl: body.videoUrl,
          poster: body.poster || "",
          views: body.views || "25K",
          instagramLink: body.instagramLink || "https://www.instagram.com/noomi_s_couture?cplk=eDEwdmJhdDBzZ3Q1&utm_source=qr",
        });
      }
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).map((v: any) => {
        if (String(v.id).trim() === targetId) {
          return { ...v, ...body };
        }
        return v;
      });
    } else if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).map((s: any) => {
        if (String(s.id).trim() === targetId) {
          return { ...s, ...body };
        }
        return s;
      });
    } else {
      data.reviews = (data.reviews || []).map((r: any) => {
        if (String(r.id).trim() === targetId) {
          return { ...r, ...body };
        }
        return r;
      });
    }

    await writeData(data);
    return NextResponse.json({ success: true, data }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in PUT /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "review", "video", "screenshot", "instagramVideo"

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const data = await readData();
    const targetId = String(id).trim();

    if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).filter((s: any) => String(s.id).trim() !== targetId);
    } else if (type === "instagramVideo") {
      data.instagramVideos = (data.instagramVideos || []).filter((v: any) => String(v.id).trim() !== targetId);
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).filter((v: any) => String(v.id).trim() !== targetId);
    } else {
      data.reviews = (data.reviews || []).filter((r: any) => String(r.id).trim() !== targetId);
    }

    await writeData(data);
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete item" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
