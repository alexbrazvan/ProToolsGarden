import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, ArrowLeft, Star, Package, ChevronRight, Minus, Plus } from 'lucide-react';
import { useProduct } from '@/app/hooks/useProducts';
import { formatPrice, getDiscount } from '@/app/services/products';
import { useCart } from '@/app/context/CartContext';
import { ProductCardSkeleton } from '@/app/components/ProductCard';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart() as any;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addItem?.({
      id: product.id,
      name: product.name,
      price: product.price_cents / 100,
      image: product.product_images?.[selectedImageIndex]?.image_url || '',
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary/30 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24 text-center">
        <Package size={56} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Produsul nu a fost găsit</h2>
        <p className="text-muted-foreground mb-6">Produsul pe care îl cauți nu există sau a fost retras.</p>
        <button onClick={() => navigate(-1)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Înapoi
        </button>
      </div>
    );
  }

  const discount = getDiscount(product);
  const images = product.product_images || [];
  const currentImage = images[selectedImageIndex]?.image_url || 'https://placehold.co/600x600?text=No+Image';

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Acasă</Link>
          <ChevronRight size={14} />
          {product.categories && (
            <>
              <Link to={`/${product.categories.slug}`} className="hover:text-foreground transition-colors">
                {product.categories.name}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/20 border border-border"
            >
              <img src={currentImage} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image'; }} />
              {discount && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded-full">-{discount}%</span>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === selectedImageIndex ? 'border-accent' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <img src={img.image_url} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.brand && <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">{product.brand}</p>}

            <h1 className="text-3xl font-bold text-foreground leading-snug">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-border'} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                {product.review_count && <span className="text-sm text-muted-foreground">({product.review_count} recenzii)</span>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">{formatPrice(product.price_cents, product.currency)}</span>
              {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents && (
                <span className="text-xl text-muted-foreground line-through mb-1">{formatPrice(product.compare_at_price_cents, product.currency)}</span>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-muted-foreground leading-relaxed">{product.short_description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {product.stock_quantity > 0 ? `${product.stock_quantity} bucăți în stoc` : 'Stoc epuizat'}
              </span>
            </div>

            {/* Quantity + Cart */}
            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Cantitate:</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-secondary transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-3 py-2 hover:bg-secondary transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                      addedToCart ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {addedToCart ? 'Adăugat în coș!' : 'Adaugă în coș'}
                  </motion.button>
                  <button className="p-3 border border-border rounded-xl hover:bg-secondary transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* SKU */}
            {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-lg mb-4">Specificații tehnice</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex gap-4 py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground min-w-[140px] shrink-0">{key}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full description */}
            {product.description && (
              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-lg mb-3">Descriere</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
