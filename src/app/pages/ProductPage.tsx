import { useParams, Link } from 'react-router';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

const products = [
  {
    id: 1,
    name: 'Professional Cordless Drill 20V Max',
    price: 129.99,
    originalPrice: 179.99,
    images: [
      'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      'https://images.unsplash.com/photo-1598726935360-7a5e2464e22d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
    ],
    rating: 4.8,
    reviews: 324,
    discount: 28,
    description: 'High-performance 20V Max cordless drill with brushless motor, 2-speed transmission, and LED work light. Includes 2 batteries, charger, and carrying case.',
    specs: [
      { label: 'Voltage', value: '20V Max' },
      { label: 'Chuck Size', value: '1/2 inch' },
      { label: 'Max Torque', value: '650 in-lbs' },
      { label: 'Speed Range', value: '0-450/0-1,500 RPM' },
      { label: 'Battery Type', value: 'Lithium-Ion' },
      { label: 'Weight', value: '3.4 lbs' }
    ],
    inStock: true,
    category: 'Power Tools'
  }
];

const relatedProducts = [
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
  }
];

export function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === Number(id)) || products[0];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={16} />
            <a href="#" className="hover:text-accent transition-colors">{product.category}</a>
            <ChevronRight size={16} />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full font-bold text-sm">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 border-x border-border font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>

              <button className="p-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                <Heart size={20} />
              </button>
              <button className="p-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border mb-8">
              <div className="text-center">
                <Truck className="mx-auto mb-2 text-accent" size={24} />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-accent" size={24} />
                <p className="text-xs text-muted-foreground">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto mb-2 text-accent" size={24} />
                <p className="text-xs text-muted-foreground">30 Day Returns</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <div className="space-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-primary mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
