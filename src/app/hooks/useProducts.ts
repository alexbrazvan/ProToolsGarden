import { useState, useEffect } from 'react';
import { getProducts, getProductById, type Product } from '@/app/services/products';

// ─── useProducts — listă de produse ──────────────────────────────────────────
export function useProducts(filters?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProducts(filters).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.categorySlug, filters?.featured, filters?.limit]);

  return { products, loading, error };
}

// ─── useProduct — un singur produs ───────────────────────────────────────────
export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    getProductById(id).then((data) => {
      if (!cancelled) {
        setProduct(data);
        setLoading(false);
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
}
