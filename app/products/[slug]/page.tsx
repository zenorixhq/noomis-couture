import { Metadata } from "next";
import { getAllProductsServer, getProductBySlugServer } from "@/lib/productServer";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";
import { storeConfig } from "@/config/store.config";

/**
 * Static Generation (SSG) with Incremental Static Regeneration (ISR).
 * - Pre-renders all catalog products at build time for instant 0ms edge loading.
 * - dynamicParams = true allows newly created products in the admin panel to be
 *   generated and cached statically on-demand without redeploying.
 * - revalidate = 300 ensures price, stock, and descriptions stay fresh.
 */
export const dynamicParams = true;
export const revalidate = 300;

/**
 * Build-time static path generation:
 * Next.js statically renders all product detail pages into pre-built static HTML files.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const products = await getAllProductsServer();
    const uniqueSlugs = Array.from(
      new Set(
        products
          .map((p) => p.slug?.trim())
          .filter((slug): slug is string => Boolean(slug && slug.length > 0))
      )
    );

    return uniqueSlugs.map((slug) => ({
      slug,
    }));
  } catch (err) {
    console.error("Error in generateStaticParams for /products/[slug]:", err);
    return [];
  }
}

/**
 * Dynamic OpenGraph & SEO Metadata for each pre-rendered product page.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlugServer(params.slug);

  if (!product) {
    return {
      title: `Piece Not Found | ${storeConfig.meta.name}`,
      description: storeConfig.meta.description,
    };
  }

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/noomis-couture-square.png";

  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    storeConfig.meta.description;

  const url = `${storeConfig.meta.url}/products/${product.slug}`;

  return {
    title: `${product.title} | ${storeConfig.meta.name}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: storeConfig.meta.name,
      title: `${product.title} | ${storeConfig.meta.name}`,
      description,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ${storeConfig.meta.name}`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, allProducts] = await Promise.all([
    getProductBySlugServer(params.slug),
    getAllProductsServer(),
  ]);

  return (
    <ProductDetailClient
      initialProduct={product}
      allProducts={allProducts}
      rawSlug={params.slug}
    />
  );
}
