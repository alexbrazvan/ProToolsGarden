import { supabase } from '../lib/supabase';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductsByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(*),
      images:product_images(*)
    `)
    .eq('is_active', true)
    .eq('category.slug', categorySlug)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}