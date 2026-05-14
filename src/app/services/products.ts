import { supabase } from '@/app/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  sort_order: number
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  brand?: string
  sku?: string
  price_cents: number
  compare_at_price_cents?: number
  currency: string
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  rating?: number
  review_count?: number
  specifications?: Record<string, string>
  created_at: string
  // joined
  product_images?: ProductImage[]
  categories?: { id: string; name: string; slug: string }
}

export interface Category {
  id: string
  name: string
  slug: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatPrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function getFirstImage(product: Product): string {
  if (!product?.product_images?.length) return 'https://placehold.co/400x400?text=No+Image';
  return product.product_images[0]?.image_url ?? 'https://placehold.co/400x400?text=No+Image';
}

export function getDiscount(product: Product): number | null {
  if (!product?.compare_at_price_cents || product.compare_at_price_cents <= product.price_cents) return null;
  return Math.round((1 - product.price_cents / product.compare_at_price_cents) * 100);
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Toate produsele active cu prima imagine */
export async function getProducts(filters?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
}): Promise<Product[]> {
  let categoryId: string | null = null;

  if (filters?.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.categorySlug)
      .single();
    categoryId = cat?.id ?? null;
    if (!categoryId) return [];
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (id, image_url, alt_text, sort_order),
      categories (id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (categoryId) query = query.eq('category_id', categoryId);
  if (filters?.featured) query = query.eq('is_featured', true);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) { console.error('[getProducts]', error.message); return []; }

  // sortează imaginile după sort_order
  return (data || []).map((p) => ({
    ...p,
    product_images: (p.product_images || []).sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order),
  }));
}

/** Un singur produs după id */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, image_url, alt_text, sort_order),
      categories (id, name, slug)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) { console.error('[getProductById]', error.message); return null; }
  return {
    ...data,
    product_images: (data.product_images || []).sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order),
  };
}

/** Toate categoriile */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name, slug');
  if (error) { console.error('[getCategories]', error.message); return []; }
  return data || [];
}
