const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { category: true, title: true } });
  const counts = {};
  products.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  console.log("DB Product Categories count:", counts);

  const siteCat = await prisma.siteContent.findUnique({ where: { key: "site_categories" } });
  console.log("Site Categories in DB:", siteCat ? JSON.parse(siteCat.value).map(c => c.name + " (" + c.slug + ")") : "NONE");
}

main().finally(() => prisma.$disconnect());
