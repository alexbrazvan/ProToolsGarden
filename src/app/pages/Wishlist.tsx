import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/app/hooks/useWishlist';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard';
import { formatPrice, getFirstImage } from '@/app/services/products';

export function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { wishlistProducts, isLoading, clearWishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart() as any;

  const totalValue = wishlistProducts.reduce((sum, p) => sum + p.price_cents / 100, 0);
  const totalSavings = wishlistProducts.reduce((sum, p) => {
    if (p.compare_at_price_cents && p.compare_at_price_cents > p.price_cents) {
      return sum + (p.compare_at_price_cents - p.price_cents) / 100;
    }
    return sum;
  }, 0);

  const handleAddAllToCart = async () => {
    for (const product of wishlistProducts) {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price_cents / 100,
        image: getFirstImage(product),
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Lista mea de dorințe</h1>
              <p className="text-xl opacity-90">
                {isLoading ? '...' : `${wishlistProducts.length} ${wishlistProducts.length === 1 ? 'produs salvat' : 'produse salvate'}`}
              </p>
            </div>
            <Heart size={64} className="hidden md:block opacity-20" fill="currentColor" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">

        {/* Neautentificat */}
        {!isAuthenticated && (
          <div className="bg-white rounded-xl border border-border p-16 text-center">
            <Heart size={56} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Trebuie să fii autentificat</h2>
            <p className="text-muted-foreground mb-6">Loghează-te pentru a salva produse în lista de dorințe.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Intră în cont <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Autentificat */}
        {isAuthenticated && (
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Produse */}
            <div className="lg:col-span-3">
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              )}

              {!isLoading && wishlistProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-border p-16 text-center"
                >
                  <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">Lista ta de dorințe e goală</h2>
                  <p className="text-muted-foreground mb-6">Salvează produse pe care vrei să le cumperi mai târziu.</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 transition-colors"
                  >
                    Explorează produse <ArrowRight size={18} />
                  </Link>
                </motion.div>
              )}

              {!isLoading && wishlistProducts.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="relative"
                      >
                        <ProductCard product={product} index={i} />
                        {/* Buton remove */}
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors group"
                          title="Șterge din wishlist"
                        >
                          <Heart size={16} className="fill-red-500 text-red-500 group-hover:fill-red-600" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Sidebar summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl border border-border p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold mb-6">Sumar</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Total produse</span>
                    <span className="font-bold">{wishlistProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Valoare totală</span>
                    <span className="font-bold">{totalValue.toFixed(2)} EUR</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Economii totale</span>
                      <span className="font-bold text-green-600">-{totalSavings.toFixed(2)} EUR</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddAllToCart}
                  disabled={wishlistProducts.length === 0}
                  className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  Adaugă tot în coș
                </button>

                <button
                  onClick={clearWishlist}
                  disabled={wishlistProducts.length === 0}
                  className="w-full px-4 py-3 bg-white text-red-600 border-2 border-red-200 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={20} />
                  Golește lista
                </button>

                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-center">
                    <span className="font-bold text-accent">Sfat:</span> Prețurile se pot modifica. Cumpără acum pentru a beneficia de reduceri!
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
