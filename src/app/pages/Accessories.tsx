import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

const accessories = [
  {
    id: 4,
    name: 'Professional Tool Set 180 Pieces',
    price: 249.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1546827209-a218e99fdbe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 267,
    discount: 17
  },
  {
    id: 40,
    name: 'Drill Bit Set Titanium 100-Piece',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 345,
    discount: 25
  },
  {
    id: 41,
    name: 'Work Gloves Heavy Duty (3-Pack)',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 478
  },
  {
    id: 42,
    name: 'Safety Glasses Anti-Fog (5-Pack)',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 289,
    discount: 25
  },
  {
    id: 43,
    name: 'Tool Belt Professional Leather',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 234
  },
  {
    id: 44,
    name: 'Extension Cord 50ft 12-Gauge',
    price: 44.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 456,
    discount: 25
  },
  {
    id: 45,
    name: 'Measuring Tape Set 3-Pack',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 312
  },
  {
    id: 46,
    name: 'LED Work Light Rechargeable 2-Pack',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 267,
    discount: 22
  }
];

export function Accessories() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessories</h1>
            <p className="text-xl opacity-90">Essential accessories and safety gear</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map((product, index) => (
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
