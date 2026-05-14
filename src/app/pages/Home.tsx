import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { useProducts } from '@/app/hooks/useProducts';
import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard';

const categories = [
  { name: 'Power Tools', slug: 'power-tools', icon: '🔧', description: 'Scule electrice profesionale' },
  { name: 'Garden Tools', slug: 'garden-tools', icon: '🌿', description: 'Unelte pentru grădină' },
  { name: 'Construction Equipment', slug: 'construction-equipment', icon: '🏗️', description: 'Echipamente grele' },
  { name: 'Accessories', slug: 'accessories', icon: '🔩', description: 'Accesorii și consumabile' },
];

const features = [
  { icon: Zap, title: 'Livrare rapidă', description: 'Livrare în 24-48h în toată țara' },
  { icon: Shield, title: 'Garanție 2 ani', description: 'Toate produsele au garanție legală' },
  { icon: Truck, title: 'Retur gratuit', description: '30 de zile pentru retur fără întrebări' },
];

export function Home() {
  const { products: featuredProducts, loading } = useProducts({ featured: true, limit: 8 });

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Tools<br />
              <span className="text-accent">for Every Project</span>
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Power, precision, and reliability for professionals and DIY enthusiasts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/power-tools" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/promotions" className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold transition-colors">
                View Offers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/${cat.slug}`}
                className="block bg-white border border-border rounded-xl p-6 text-center hover:border-accent hover:shadow-md transition-all group"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <p className="font-bold mb-1">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Vezi produse <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Top picks for professionals</p>
            </div>
            <Link to="/power-tools" className="flex items-center gap-1 text-accent hover:text-accent/80 font-medium text-sm transition-colors">
              Vezi toate <ArrowRight size={16} />
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nu există produse featured momentan.</p>
            </div>
          )}

          {!loading && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
