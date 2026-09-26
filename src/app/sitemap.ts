import type { MetadataRoute } from 'next';
import { allStoreProducts, moonMarketCategories } from '@/data/mock-data';

const SITE_URL = 'https://moonmarket.ir';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_URL}/cart`, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${SITE_URL}/profile`, changeFrequency: 'monthly', priority: 0.3 },
      { url: `${SITE_URL}/branches`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/support`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${SITE_URL}/messages`, changeFrequency: 'monthly', priority: 0.4 },
    ] as const
  ).map((entry) => ({ ...entry, lastModified: now }));

  const categoryRoutes: MetadataRoute.Sitemap = moonMarketCategories
    .flatMap((category) => [
      { url: `${SITE_URL}/category/${category.slug}`, priority: 0.8 },
      ...category.children.map((child) => ({
        url: `${SITE_URL}/category/${child.slug}`,
        priority: 0.6,
      })),
    ])
    .map((entry) => ({ ...entry, changeFrequency: 'weekly' as const, lastModified: now }));

  const productRoutes: MetadataRoute.Sitemap = allStoreProducts.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
    lastModified: now,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
