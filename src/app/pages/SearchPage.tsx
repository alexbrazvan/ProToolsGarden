import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Package } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { type Product } from '@/app/services/products';
import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard';
import { SearchBar } from '@/app/components/SearchBar';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (id, image_url, alt_text, sort_order),
            categories (id, name, slug)
          `)
          .eq('is_active', true)
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%,short_description.ilike.%${query}%,description.ilike.%${query}%`)
          .order('is_featured', { ascending: false });

        if (error) throw error;

        setProducts((data || []).map((p: any) => ({
          ...p,
          product_images: (p.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
        })));
      } catch (err) {
        console.error('[SearchPage]', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-4">
              {query ? `Rezultate pentru „${query}"` : 'Caută produse'}
            </h1>
            {/* Search bar în pagina de rezultate */}
            <div className="max-w-2xl">
              <SearchBar
                placeholder="Caută din nou..."
                inputClassName="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {!isLoading && query && products.length === 0 && (
          <div className="text-center py-20">
            <Package size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Niciun rezultat găsit</h3>
            <p className="text-muted-foreground">
              Nu am găsit produse pentru „{query}". Încearcă un alt termen.
            </p>
          </div>
        )}

        {!isLoading && !query && (
          <div className="text-center py-20">
            <Search size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ce cauți azi?</h3>
            <p className="text-muted-foreground">Introdu un termen de căutare mai sus.</p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {products.length} {products.length === 1 ? 'produs găsit' : 'produse găsite'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
