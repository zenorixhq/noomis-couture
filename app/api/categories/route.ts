import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categories as defaultCategories } from "@/data/mockData";
import { Category } from "@/types/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
};

let memoryCachedCategories: Category[] | null = null;
let lastCategoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 60 * 1000;

function sortCategories(list: Category[]): Category[] {
  return [...list].sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : 999;
    const orderB = typeof b.order === "number" ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name || "").localeCompare(b.name || "");
  });
}

async function getStoredCategories(forceFresh = false): Promise<Category[]> {
  if (!forceFresh && memoryCachedCategories && Date.now() - lastCategoriesCacheTime < CATEGORIES_CACHE_TTL) {
    return memoryCachedCategories;
  }
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: "site_categories" },
    });
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = sortCategories(parsed);
        memoryCachedCategories = sorted;
        lastCategoriesCacheTime = Date.now();
        return sorted;
      }
    }
  } catch (err) {
    console.warn("Error reading site_categories from DB:", err);
  }
  const defaultSorted = sortCategories(defaultCategories);
  memoryCachedCategories = defaultSorted;
  lastCategoriesCacheTime = Date.now();
  return defaultSorted;
}

async function saveCategories(categoriesList: Category[]): Promise<boolean> {
  try {
    memoryCachedCategories = null;
    lastCategoriesCacheTime = 0;
    const sorted = sortCategories(categoriesList);
    const jsonStr = JSON.stringify(sorted);
    await prisma.siteContent.upsert({
      where: { key: "site_categories" },
      update: { value: jsonStr },
      create: { key: "site_categories", value: jsonStr },
    });
    memoryCachedCategories = sorted;
    lastCategoriesCacheTime = Date.now();
    return true;
  } catch (err) {
    console.error("Error saving site_categories to DB:", err);
    return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const forceFresh = url.searchParams.get("fresh") === "true";
  const categoriesList = await getStoredCategories(forceFresh);
  return NextResponse.json(categoriesList, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If whole list is passed: { categories: [...] }
    if (Array.isArray(body.categories)) {
      const success = await saveCategories(body.categories);
      if (!success) {
        return NextResponse.json({ error: "Failed to persist categories to database" }, { status: 500 });
      }
      return NextResponse.json({ success: true, categories: body.categories }, { headers: NO_CACHE_HEADERS });
    }

    // Adding a single new category
    const currentList = await getStoredCategories(true);
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const parsedOrder = typeof body.order === "number" ? body.order : (body.order ? parseInt(body.order, 10) : undefined);
    const newCategory: Category = {
      id: body.id || `cat-${Date.now()}`,
      slug,
      name: body.name || "New Collection",
      description: body.description || "",
      image: body.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      productCount: typeof body.productCount === "number" ? body.productCount : 0,
      order: parsedOrder,
    };

    const existingIdx = currentList.findIndex((c) => c.slug === slug || (body.id && c.id === body.id));
    let updated: Category[];
    if (existingIdx >= 0) {
      updated = [...currentList];
      updated[existingIdx] = { ...updated[existingIdx], ...newCategory };
    } else {
      updated = [...currentList, newCategory];
    }

    await saveCategories(updated);
    const sortedResult = sortCategories(updated);
    return NextResponse.json({ success: true, item: newCategory, categories: sortedResult }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in POST /api/categories:", err);
    return NextResponse.json({ error: err.message || "Failed to update category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, image, name, description, slug, order } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const currentList = await getStoredCategories(true);
    let found = false;

    const updated = currentList.map((cat) => {
      if (cat.id === id || cat.slug === slug || cat.slug === id) {
        found = true;
        return {
          ...cat,
          image: image !== undefined ? image : cat.image,
          name: name !== undefined ? name : cat.name,
          description: description !== undefined ? description : cat.description,
          slug: slug !== undefined ? slug : cat.slug,
          order: order !== undefined ? (order === "" || order === null ? undefined : Number(order)) : cat.order,
        };
      }
      return cat;
    });

    if (!found) {
      // If not in default list yet, add it
      updated.push({
        id,
        slug: slug || id,
        name: name || id,
        description: description || "",
        image: image || "",
        productCount: 0,
        order: order !== undefined && order !== "" ? Number(order) : undefined,
      });
    }

    const success = await saveCategories(updated);
    if (!success) {
      return NextResponse.json({ error: "Failed to update category in database" }, { status: 500 });
    }

    const sortedResult = sortCategories(updated);
    return NextResponse.json({ success: true, categories: sortedResult }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in PUT /api/categories:", err);
    return NextResponse.json({ error: err.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const currentList = await getStoredCategories(true);
    const updated = currentList.filter((cat) => cat.id !== id && cat.slug !== id);

    await saveCategories(updated);
    return NextResponse.json({ success: true, categories: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("Error in DELETE /api/categories:", err);
    return NextResponse.json({ error: err.message || "Failed to delete category" }, { status: 500 });
  }
}
