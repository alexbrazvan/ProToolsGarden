import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

const powerTools = [
  {
    id: 1,
    name: 'Professional Cordless Drill 20V Max',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 324,
    discount: 28
  },
  {
    id: 2,
    name: 'Heavy Duty Angle Grinder with Case',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 198,
    discount: 25
  },
  {
    id: 3,
    name: 'Impact Driver Kit with Battery',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1598726935360-7a5e2464e22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 412
  },
  {
    id: 5,
    name: 'Circular Saw with Laser Guide',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1603138519910-9a3813cc0ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 6,
    name: 'Rotary Hammer Drill SDS-Plus',
    price: 279.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 289,
    discount: 20
  },
  {
    id: 9,
    name: 'Jigsaw Variable Speed 800W',
    price: 94.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 212,
    discount: 27
  },
  {
    id: 10,
    name: 'Orbital Sander 450W Professional',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1766096847418-9a2ae64c9621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.5,
    reviews: 178
  },
  {
    id: 11,
    name: 'Router Kit with Variable Speed',
    price: 189.99,
    originalPrice: 239.99,
    image: 'https://images.unsplash.com/photo-1683115099247-7e33663f91cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 156,
    discount: 21
  }
];

export function PowerTools() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Power Tools</h1>
            <p className="text-xl opacity-90">Professional-grade power tools for every job</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {powerTools.map((product, index) => (
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
