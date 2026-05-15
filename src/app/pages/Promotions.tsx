import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Package } from 'lucide-react';
import { getPromotions, type Product } from '@/app/services/products';
import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard';

export function Promotions() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromotions().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-accent text-accent-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Promoții</h1>
              <p className="text-xl opacity-90">Cele mai bune oferte — prețuri reduse, stoc limitat</p>
              {!loading && (
                <p className="text-sm opacity-70 mt-2">
                  {products.length} {products.length === 1 ? 'produs în promoție' : 'produse în promoție'}
                </p>
              )}
            </div>
            <Tag size={64} className="hidden md:block opacity-20" />
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <Package size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nu există promoții active momentan</h3>
            <p className="text-muted-foreground">Revino curând — adăugăm oferte noi în permanență.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}