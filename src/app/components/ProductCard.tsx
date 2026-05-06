import { Link } from 'react-router';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  delay?: number;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  discount,
  delay = 0
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, name, price, image });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <Link
        to={`/product/${id}`}
        className="block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative aspect-square bg-secondary overflow-hidden">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
            />
            {discount && (
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full font-bold text-sm">
                -{discount}%
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 right-3"
            >
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </motion.div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {name}
            </h3>

            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary">${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
