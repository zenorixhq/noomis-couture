import { Metadata } from "next";
import { getAllProductsServer, getProductBySlugServer } from "@/lib/productServer";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";
import { storeConfig } from "@/config/store.config";

/**
 * Dynamic Server Rendering (SSR).
 * - Queries Neon PostgreSQL directly on every request to ensure 100% real-time accuracy
 *   for price, stock, color options, and newly added/updated products.
 * - ZERO ISR Writes: eliminates Vercel Hobby 200k ISR write quota limits completely.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
