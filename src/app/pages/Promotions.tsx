import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { Tag, Percent, Gift, Clock } from 'lucide-react';

const promotionalProducts = [
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
    id: 40,
    name: 'Drill Bit Set Titanium 100-Piece',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 345,
    discount: 25
  }
];

const promoCategories = [
  {
    icon: Tag,
    title: 'Clearance Sale',
    description: 'Up to 40% off',
    color: 'bg-red-500'
  },
  {
    icon: Percent,
    title: 'Daily Deals',
    description: 'Limited time offers',
    color: 'bg-blue-500'
  },
  {
    icon: Gift,
    title: 'Buy More Save More',
    description: 'Bundle discounts',
    color: 'bg-green-500'
  },
  {
    icon: Clock,
    title: 'Flash Sales',
    description: 'Ending soon',
    color: 'bg-orange-500'
  }
];

export function Promotions() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-accent via-accent to-accent/80 text-accent-foreground py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Promotions</h1>
            <p className="text-xl opacity-90">Limited time offers and exclusive deals</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {promoCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} text-white rounded-full mb-4`}>
                <category.icon size={32} />
              </div>
              <h3 className="font-bold text-lg mb-1">{category.title}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-primary mb-2">Featured Deals</h2>
          <p className="text-muted-foreground">Save big on top-rated products</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotionalProducts.map((product, index) => (
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
