import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

const constructionEquipment = [
  {
    id: 8,
    name: 'Excavator Mini Compact',
    price: 12499.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 45
  },
  {
    id: 30,
    name: 'Concrete Mixer 5 Cu Ft',
    price: 349.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1759745125627-333e78bc1edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 89,
    discount: 22
  },
  {
    id: 31,
    name: 'Scaffolding Set 6ft x 5ft',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1759745125627-333e78bc1edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.6,
    reviews: 67
  },
  {
    id: 32,
    name: 'Plate Compactor Vibratory',
    price: 799.99,
    originalPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 54,
    discount: 20
  },
  {
    id: 33,
    name: 'Electric Jackhammer 65lb',
    price: 549.99,
    image: 'https://images.unsplash.com/photo-1759745125627-333e78bc1edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 78
  },
  {
    id: 34,
    name: 'Tile Saw 10" Professional',
    price: 429.99,
    originalPrice: 529.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.9,
    reviews: 134,
    discount: 19
  },
  {
    id: 35,
    name: 'Laser Level Rotary Self-Leveling',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1759745125627-333e78bc1edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 36,
    name: 'Generator 7500W Portable',
    price: 899.99,
    originalPrice: 1099.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.7,
    reviews: 201,
    discount: 18
  }
];

export function ConstructionEquipment() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Construction Equipment</h1>
            <p className="text-xl opacity-90">Heavy-duty equipment for professional contractors</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {constructionEquipment.map((product, index) => (
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
