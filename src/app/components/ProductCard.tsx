import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { type Product, formatPrice, getFirstImage, getDiscount } from '@/app/services/products';
import { useCart } from '@/app/context/CartContext';
import { WishlistButton } from '@/app/components/WishlistButton';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart() as any;
  
  if (!product) return null;  // ← adaugă această linie
  
  const discount = getDiscount(product);
  const imageUrl = getFirstImage(product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-accent/40 transition-all group flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-secondary/30">
  <img
    src={imageUrl}
    alt={product.product_images?.[0]?.alt_text || product.name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image'; }}
  />
  <div className="absolute top-3 right-3">
    <WishlistButton productId={product.id} />
  </div>
  {discount && (
    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">
      -{discount}%
    </span>
  )}
  {product.stock_quantity === 0 && (
    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
      <span className="bg-white border border-border text-sm font-medium px-4 py-2 rounded-full">Stoc epuizat</span>
    </div>
  )}
</Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{product.brand}</p>
        )}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm leading-snug hover:text-accent transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
{!!product.rating && product.rating > 0 && (
  <div className="flex items-center gap-1 mb-3">
    <Star size={13} className="fill-yellow-400 text-yellow-400" />
    <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
    {!!product.review_count && product.review_count > 0 && (
      <span className="text-xs text-muted-foreground">({product.review_count})</span>
    )}
  </div>
)}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price_cents, product.currency)}
          </span>
          {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price_cents, product.currency)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem?.({ id: product.id, name: product.name, price: product.price_cents / 100, image: imageUrl })}
          disabled={product.stock_quantity === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          {product.stock_quantity === 0 ? 'Stoc epuizat' : 'Adaugă în coș'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-secondary/50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-secondary rounded w-1/3" />
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-1/2" />
        <div className="h-6 bg-secondary rounded w-1/3" />
        <div className="h-10 bg-secondary rounded" />
      </div>
    </div>
  );
}
