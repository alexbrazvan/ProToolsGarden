import { motion } from 'motion/react';
import { Package } from 'lucide-react';
import { useProducts } from '@/app/hooks/useProducts';
import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard';

interface CategoryPageProps {
  title: string
  description: string
  categorySlug: string
  heroColor?: string
}

export function CategoryPage({ title, description, categorySlug, heroColor = 'bg-primary' }: CategoryPageProps) {
  const { products, loading, error } = useProducts({ categorySlug });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`${heroColor} text-primary-foreground py-16`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-xl opacity-90">{description}</p>
            {!loading && (
              <p className="text-sm opacity-70 mt-2">
                {products.length} {products.length === 1 ? 'produs găsit' : 'produse găsite'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Eroare la încărcarea produselor. Încearcă din nou.</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <Package size={56} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nu există produse în această categorie</h3>
            <p className="text-muted-foreground">Revino curând — adăugăm produse noi în permanență.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
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
