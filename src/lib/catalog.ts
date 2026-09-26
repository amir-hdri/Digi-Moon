/**
 * MoonMarket — Catalog Query Layer
 *
 * Single source of truth for category resolution, filtering, sorting and brand
 * discovery. Previously this logic was copy-pasted across HomeClient, the category
 * page, the search page, CategoryDrawer and MegaMenu, which is how they drifted
 * (e.g. subcategory links like `/category/oil` silently fell back to the whole catalog).
 *
 * Location: src/lib/catalog.ts
 */
import type { Product } from '@/types';
import { normalizePersian } from '@/lib/persian';
import {
  allStoreProducts,
  mockCategories,
  moonMarketCategories,
  type MoonMarketCategory,
} from '@/data/mock-data';

export type { MoonMarketCategory };

/** A category *or* a subcategory, flattened into one shape. */
export interface CategoryNode {
  /** Unique across the whole tree — subcategory ids are namespaced with their parent. */
  id: string;
  slug: string;
  title: string;
  icon: string;
  badge?: string;
  /** Ids this node's products may carry: its own id, plus every child id when it is a parent. */
  matchIds: string[];
  isParent: boolean;
  parentId?: string;
  parentSlug?: string;
  /** Children, only present on parent nodes. */
  children?: CategoryNode[];
}

export type SortKey = 'popular' | 'cheapest' | 'expensive' | 'newest';

export interface CatalogFilters {
  query?: string;
  categoryId?: string | null;
  brand?: string | null;
  sort?: SortKey;
}

export const SORT_OPTIONS: Array<{ id: SortKey; label: string }> = [
  { id: 'popular', label: 'پرفروش‌ترین' },
  { id: 'cheapest', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
  { id: 'newest', label: 'جدیدترین' },
];

/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                     */
/* -------------------------------------------------------------------------- */

function toNode(category: MoonMarketCategory): CategoryNode {
  return {
    id: category.id,
    slug: category.slug,
    title: category.title,
    icon: category.icon,
    badge: category.badge,
    matchIds: [category.id],
    isParent: true,
    children: category.children.map((child) => ({
      id: child.id,
      slug: child.slug,
      title: child.title,
      icon: category.icon,
      matchIds: [child.id],
      isParent: false,
      parentId: category.id,
      parentSlug: category.slug,
    })),
  };
}

const legacyNodes: CategoryNode[] = mockCategories
  // `moonMarketCategories` is the live taxonomy; skip legacy rows it already covers.
  .filter((legacy) => !moonMarketCategories.some((c) => c.id === legacy.id))
  .map((legacy) => ({
    id: String(legacy.id),
    slug: legacy.slug,
    title: legacy.title,
    icon: legacy.icon ?? 'ShoppingBag',
    matchIds: [String(legacy.id)],
    isParent: true,
  }));

/** Every category (parent + subcategory) in one flat, ordered list. */
export const categoryTree: CategoryNode[] = [...moonMarketCategories.map(toNode), ...legacyNodes];

/** The 8 top-level category tiles shown on the home grid. */
export const topLevelCategories: CategoryNode[] = categoryTree.filter((node) => node.isParent);

const byId = new Map<string, CategoryNode>();
const bySlug = new Map<string, CategoryNode>();
for (const node of categoryTree) {
  byId.set(node.id, node);
  bySlug.set(node.slug, node);
  for (const child of node.children ?? []) {
    byId.set(child.id, child);
    bySlug.set(child.slug, child);
  }
}

/**
 * Resolves a category or subcategory from a URL segment. Accepts ids and slugs at
 * either level and is case/whitespace tolerant. Returns `null` for unknown input so
 * callers can render a real "not found" state instead of dumping the whole catalog.
 */
export function resolveCategory(slugOrId: string | null | undefined): CategoryNode | null {
  if (!slugOrId) return null;
  const key = normalizePersian(slugOrId);
  if (!key) return null;
  return bySlug.get(key) ?? byId.get(key) ?? null;
}

/** Human-readable product-count for a node, computed from real data (never decorative). */
export function countProductsForNode(node: CategoryNode | null): number {
  if (!node) return 0;
  return allStoreProducts.filter((product) => matchesNode(product, node)).length;
}

/* -------------------------------------------------------------------------- */
/* Brands                                                                       */
/* -------------------------------------------------------------------------- */

export interface BrandFacet {
  id: string;
  label: string;
  count: number;
}

/**
 * Brand chips are derived from the catalog itself, so tapping a chip can never land
 * on an empty grid (the old hardcoded list did — 6 of 7 chips returned nothing).
 */
export function getBrandFacets(): BrandFacet[] {
  const facets = new Map<string, BrandFacet>();
  for (const product of allStoreProducts) {
    if (!product.brand) continue;
    const existing = facets.get(product.brand);
    if (existing) {
      existing.count += 1;
      continue;
    }
    facets.set(product.brand, {
      id: product.brand,
      label: product.brandLabel ?? product.brand,
      count: 1,
    });
  }
  return [...facets.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fa'));
}

/* -------------------------------------------------------------------------- */
/* Filtering & sorting                                                          */
/* -------------------------------------------------------------------------- */

function matchesNode(product: Product, node: CategoryNode): boolean {
  if (node.matchIds.includes(String(product.categoryId))) return true;
  if (product.subCategoryId && node.matchIds.includes(String(product.subCategoryId))) return true;
  return false;
}

/** Text match across title, description, brand, category and specs — keyboard-layout tolerant. */
function matchesQuery(product: Product, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const haystack = [
    product.title,
    product.description,
    product.brandLabel,
    product.brand,
    product.categoryTitle,
    product.subCategoryTitle,
    ...Object.values(product.specs ?? {}),
  ]
    .filter(Boolean)
    .join(' ');
  return normalizePersian(haystack).includes(normalizedQuery);
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case 'cheapest':
      return sorted.sort((a, b) => a.price - b.price);
    case 'expensive':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      // Surfaces festival/featured items first, then discount depth, then rating.
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.isSpecial)) - Number(Boolean(a.isSpecial)) ||
          discountOf(b) - discountOf(a) ||
          (b.rating ?? 0) - (a.rating ?? 0)
      );
    case 'popular':
    default:
      return sorted.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0)
      );
  }
}

export function discountOf(product: Product): number {
  if (product.discountPercent) return product.discountPercent;
  if (product.oldPrice && product.oldPrice > product.price) {
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }
  return 0;
}

/** The one filter pipeline every surface (home, category, search) now shares. */
export function filterCatalog({ query = '', categoryId = null, brand = null, sort = 'popular' }: CatalogFilters): Product[] {
  const normalizedQuery = normalizePersian(query);
  const node = resolveCategory(categoryId);

  const list = allStoreProducts.filter((product) => {
    if (node && !matchesNode(product, node)) return false;
    if (brand && product.brand !== brand) return false;
    return matchesQuery(product, normalizedQuery);
  });

  return sortProducts(list, sort);
}

export function searchCatalog(query: string, sort: SortKey = 'popular'): Product[] {
  return filterCatalog({ query, sort });
}
