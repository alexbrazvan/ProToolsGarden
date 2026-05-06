import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Drill, Shovel, HardHat, Wrench, Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';

const featuredProducts = [
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
    id: 7,
    name: 'Garden Pruning Shears Premium',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1774647001686-314f877fb9c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.5,
    reviews: 143
  },
  {
    id: 8,
    name: 'Excavator Mini Compact',
    price: 12499.99,
    image: 'https://images.unsplash.com/photo-1772430364048-87343eea8fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    rating: 4.8,
    reviews: 45
  }
];

const categories = [
  {
    name: 'Power Tools',
    icon: Drill,
    image: 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    path: '/power-tools'
  },
  {
    name: 'Garden Tools',
    icon: Shovel,
    image: 'https://images.unsplash.com/photo-1763844597656-eddb0836065f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    path: '/garden-tools'
  },
  {
    name: 'Construction Equipment',
    icon: HardHat,
    image: 'https://images.unsplash.com/photo-1759745125627-333e78bc1edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    path: '/construction-equipment'
  },
  {
    name: 'Accessories',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    path: '/accessories'
  }
];

const benefits = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $99'
  },
  {
    icon: Shield,
    title: 'Extended Warranty',
    description: 'Up to 5 years on select products'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day money back guarantee'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple payment options available'
  }
];

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1766096847418-9a2ae64c9621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)'
          }}
        />

        <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Professional Tools<br />for Every Project
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Power, precision, and reliability for professionals and DIY enthusiasts
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/power-tools">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-bold hover:bg-accent/90 transition-colors"
                  >
                    Shop Now
                  </motion.button>
                </Link>
                <Link to="/promotions">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold hover:bg-white/20 transition-colors"
                  >
                    View Offers
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              {...category}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 bg-secondary/30">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Top picks for professionals</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section id="promotions" className="bg-accent text-accent-foreground py-16 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Spring Sale</h2>
              <p className="text-xl mb-6">Up to 40% off power tools and accessories</p>
              <Link to="/promotions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-4 bg-white text-accent rounded-lg font-bold hover:bg-white/90 transition-colors"
                >
                  Shop Deals
                </motion.button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-64 md:h-80 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1683115099247-7e33663f91cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Tools promotion"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-4">
                <benefit.icon size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
