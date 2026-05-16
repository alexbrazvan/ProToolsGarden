import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import type { Product } from '@/app/services/products';

export function useWishlist() {
  const { profile, isAuthenticated } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // ── Încarcă wishlist-ul ───────────────────────────────────────────────────
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated || !profile?.id) {
      setWishlistProducts([]);
      setWishlistIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          product_id,
          products (
            *,
            product_images (id, image_url, alt_text, sort_order),
            categories (id, name, slug)
          )
        `)
        .eq('user_id', profile.id);

      if (error) throw error;

      const products = (data || [])
        .map((row: any) => row.products)
        .filter(Boolean)
        .map((p: any) => ({
          ...p,
          product_images: (p.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
        }));

      setWishlistProducts(products);
      setWishlistIds(new Set(products.map((p: Product) => p.id)));
    } catch (err) {
      console.error('[useWishlist] loadWishlist error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, profile?.id]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // ── Adaugă la wishlist ────────────────────────────────────────────────────
  const addToWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated || !profile?.id) return;

    try {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: profile.id, product_id: productId });

      setWishlistIds((prev) => new Set([...prev, productId]));
      await loadWishlist();
    } catch (err) {
      console.error('[useWishlist] addToWishlist error:', err);
    }
  }, [isAuthenticated, profile?.id, loadWishlist]);

  // ── Șterge din wishlist ───────────────────────────────────────────────────
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated || !profile?.id) return;

    try {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', profile.id)
        .eq('product_id', productId);

      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('[useWishlist] removeFromWishlist error:', err);
    }
  }, [isAuthenticated, profile?.id]);

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback(async (productId: string) => {
    if (wishlistIds.has(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [wishlistIds, addToWishlist, removeFromWishlist]);

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated || !profile?.id) return;

    try {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', profile.id);

      setWishlistProducts([]);
      setWishlistIds(new Set());
    } catch (err) {
      console.error('[useWishlist] clearWishlist error:', err);
    }
  }, [isAuthenticated, profile?.id]);

  return {
    wishlistProducts,
    wishlistIds,
    isLoading,
    isInWishlist: (productId: string) => wishlistIds.has(productId),
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };
}
