import { motion } from 'motion/react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

const wishlistItems = [
  {
    id: 1,
    name: 'Professional Cordless Drill 20V Max',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 324,
    discount: 28,
    inStock: true
  },
  {
    id: 6,
    name: 'Rotary Hammer Drill SDS-Plus',
    price: 279.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 289,
    discount: 20,
    inStock: true
  },
  {
    id: 8,
    name: 'Excavator Mini Compact',
    price: 12499.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 45,
    inStock: false
  },
  {
    id: 20,
    name: 'Lawn Mower Self-Propelled 21"',
    price: 449.99,
    originalPrice: 549.99,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 287,
    discount: 18,
    inStock: true
  },
  {
    id: 34,
    name: 'Tile Saw 10" Professional',
    price: 429.99,
    originalPrice: 529.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 134,
    discount: 19,
    inStock: true
  },
  {
    id: 40,
    name: 'Drill Bit Set Titanium 100-Piece',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 345,
    discount: 25,
    inStock: true
  }
];

export function Wishlist() {
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Wishlist</h1>
              <p className="text-xl opacity-90">{wishlistItems.length} items saved for later</p>
            </div>
            <Heart size={64} className="hidden md:block opacity-20" fill="currentColor" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {wishlistItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-16 text-center border border-border"
              >
                <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">Save items you love for later</p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 transition-colors"
                >
                  Start Shopping
                </a>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard {...item} delay={0} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-6 border border-border sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6">Wishlist Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-bold">{wishlistItems.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-bold">${totalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Total Savings</span>
                  <span className="font-bold text-green-600">${totalSavings.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 mb-3">
                <ShoppingCart size={20} />
                Add All to Cart
              </button>

              <button className="w-full px-4 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={20} />
                Clear Wishlist
              </button>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-center">
                  <span className="font-bold text-accent">Pro Tip:</span> Items in your wishlist may change price. Buy soon to lock in savings!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
