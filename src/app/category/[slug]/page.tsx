import { notFound } from 'next/navigation';
import { CategoryView } from '@/components/catalog/CategoryView';
import { resolveCategory } from '@/lib/catalog';

/**
 * Server Component shell for the category route.
 *
 * Two reasons this is a Server Component rather than `'use client'`:
 *
 * 1. `notFound()` has to run on the server to produce a real HTTP 404. From a Client
 *    Component the not-found UI paints but the status stays 200, so crawlers index a 200
 *    for every bogus `/category/*` URL.
 * 2. The drawer's deep links use `/category/<sub>?q=<term>`. Reading that from the page
 *    props here (instead of `useSearchParams` in the view) keeps the product grid fully
 *    server-rendered — with `useSearchParams` the grid fell back to a Suspense shell and
 *    shipped no catalog HTML to crawlers or slow connections.
 *
 * The old resolver invented a `{ id: slug, title: 'دسته‌بندی محصولات' }` placeholder for
 * unknown segments, and mapped subcategory slugs onto their *parent* id — which is why
 * every subcategory page showed the whole parent category. `resolveCategory` fixes both.
 */
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const node = resolveCategory(slug);

  if (!node) notFound();

  const rawTerm = query.q;
  const term = (Array.isArray(rawTerm) ? rawTerm[0] : rawTerm)?.trim() ?? '';

  return <CategoryView node={node} initialTerm={term} />;
}
