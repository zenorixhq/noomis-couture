const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  {
    "id": "cat-bangles",
    "slug": "bangles",
    "name": "Bangles",
    "description": "Rigid luxury bangles, open-cuff kadas, and screw-lock everyday bangles in 304 & 316L steel.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/bangles-kada-1793372909246.jpg",
    "productCount": 12
  },
  {
    "id": "cat-bracelets",
    "slug": "bracelets",
    "name": "Bracelets",
    "description": "Waterproof clover bracelets, paperclip chains, and link cuffs.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/bracelets-1793372908945.jpg",
    "productCount": 19
  },
  {
    "id": "cat-charm-necklace",
    "slug": "charm-necklace",
    "name": "Charm Necklace",
    "description": "Interchangeable charm necklaces, dainty lockets, and radiant everyday pieces.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/charms-1793372909349.jpg",
    "productCount": 33
  },
  {
    "id": "cat-pendants",
    "slug": "pendants",
    "name": "Pendants",
    "description": "Solitaire stones, clover medallions, and minimal layering pendants.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/necklaces-and-chains-1793372908704.jpg",
    "productCount": 12
  },
  {
    "id": "cat-watches",
    "slug": "watches",
    "name": "Watches",
    "description": "Refined minimalist luxury timepieces with stainless steel waterproof mesh and link bracelets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/watches-1793372909299.jpg",
    "productCount": 0
  },
  {
    "id": "cat-rings",
    "slug": "rings",
    "name": "Rings",
    "description": "Waterproof adjustable rings, statement bands, and stackable sets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/rings-1793372908809.jpg",
    "productCount": 11
  },
  {
    "id": "cat-hand-chains",
    "slug": "hand-chains",
    "name": "Hand Chains",
    "description": "Delicate ring-to-wrist hand harness chains in radiant 18K mirror gold finish.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/hip-chains-1793372909411.jpg",
    "productCount": 0
  },
  {
    "id": "cat-anklets",
    "slug": "anklets",
    "name": "Anklets",
    "description": "Boho bead anklets, butterfly charms, and shimmering multi-diamond anklets.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/anklets-1793372909460.jpg",
    "productCount": 0
  },
  {
    "id": "cat-earrings",
    "slug": "earrings",
    "name": "Earrings",
    "description": "Hypoallergenic hoops, contemporary drop earrings, and dainty daily studs.",
    "image": "https://8chqcadpyfsk8arj.public.blob.vercel-storage.com/categories/earrings-1793372908889.jpg",
    "productCount": 9
  },
  {
    "id": "cat-mangalsutra",
    "slug": "mangalsutra",
    "name": "Mangalsutra",
    "description": "Modern minimalist mangalsutra designs in waterproof 304 steel with auspicious black beads.",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    "productCount": 0
  }
];

async function main() {
  const jsonStr = JSON.stringify(categories);
  await prisma.siteContent.upsert({
    where: { key: "site_categories" },
    update: { value: jsonStr },
    create: { key: "site_categories", value: jsonStr },
  });
  console.log("Successfully seeded 10 categories into database siteContent!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
