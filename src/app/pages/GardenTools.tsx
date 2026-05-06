import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

const gardenTools = [
  {
    id: 7,
    name: 'Garden Pruning Shears Premium',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1774647001686-314f877fb9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.5,
    reviews: 143
  },
  {
    id: 20,
    name: 'Lawn Mower Self-Propelled 21"',
    price: 449.99,
    originalPrice: 549.99,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 287,
    discount: 18
  },
  {
    id: 21,
    name: 'Electric Hedge Trimmer 24"',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1774647001686-314f877fb9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 156
  },
  {
    id: 22,
    name: 'Garden Hose 100ft Heavy Duty',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 234,
    discount: 25
  },
  {
    id: 23,
    name: 'Leaf Blower Cordless 40V',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1774647001686-314f877fb9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.5,
    reviews: 198
  },
  {
    id: 24,
    name: 'Wheelbarrow Heavy Duty 6 Cu Ft',
    price: 119.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 145,
    discount: 20
  },
  {
    id: 25,
    name: 'Garden Tool Set 10-Piece',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1774647001686-314f877fb9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 267
  },
  {
    id: 26,
    name: 'Pressure Washer 2000 PSI',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 312,
    discount: 20
  }
];

export function GardenTools() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Garden Tools</h1>
            <p className="text-xl opacity-90">Everything you need for a beautiful garden</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gardenTools.map((product, index) => (
            <ProductCard
              key={product.id}
              {...product}
              delay={index * 0.05}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
