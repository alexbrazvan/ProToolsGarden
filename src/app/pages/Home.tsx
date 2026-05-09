import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Drill,
  Shovel,
  HardHat,
  Wrench,
  Truck,
  Shield,
  RotateCcw,
  CreditCard
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { supabase } from '../lib/supabase';

type ProductImage = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  product_images: ProductImage[];
  categories: Category | null;
};

const fallbackProductImage =
  'https://images.unsplash.com/photo-1546827209-a218e99fdbe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const fallbackCategoryImage =
  'https://images.unsplash.com/photo-1774963711952-713bb7a52c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';

const categoryIcons = [Drill, Shovel, HardHat, Wrench];

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              slug,
              description,
              image_url,
              sort_order
            ),
            product_images (
              id,
              image_url,
              alt_text,
              sort_order
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8),

        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(4)
      ]);

      if (!productsResponse.error && productsResponse.data) {
        setProducts(productsResponse.data as Product[]);
      }

      if (!categoriesResponse.error && categoriesResponse.data) {
        setCategories(categoriesResponse.data as Category[]);
      }

      setLoadingProducts(false);
      setLoadingCategories(false);
    }

    loadHomeData();
  }, []);

  const mappedProducts = useMemo(() => {
    return products.map((product) => {
      const sortedImages = [...(product.product_images || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      );

      const mainImage = sortedImages[0]?.image_url || fallbackProductImage;

      const price = product.price_cents / 100;

      const originalPrice = product.compare_at_price_cents
        ? product.compare_at_price_cents / 100
        : undefined;

      const discount =
        originalPrice && originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : undefined;

      return {
        id: product.id,
        name: product.name,
        price,
        originalPrice,
        image: mainImage,
        rating: Number(product.rating || 0),
        reviews: product.review_count || 0,
        discount
      };
    });
  }, [products]);

  const mappedCategories = useMemo(() => {
    return categories.map((category, index) => ({
      name: category.name,
      icon: categoryIcons[index] || Wrench,
      image: category.image_url || fallbackCategoryImage,
      path: `/${category.slug}`
    }));
  }, [categories]);

  return (
    <div>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1766096847418-9a2ae64c9621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)'
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

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
            Shop by Category
          </h2>
        </motion.div>

        {loadingCategories ? (
          <p className="text-muted-foreground">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {mappedCategories.map((category, index) => (
              <CategoryCard
                key={category.name}
                {...category}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </section>

      <section
        id="featured"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 bg-secondary/30"
      >
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground">Top picks for professionals</p>
          </motion.div>

          {loadingProducts ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : mappedProducts.length === 0 ? (
            <p className="text-muted-foreground">
              No products available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mappedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="promotions" className="bg-accent text-accent-foreground py-16 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Spring Sale
              </h2>

              <p className="text-xl mb-6">
                Up to 40% off power tools and accessories
              </p>

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

              <p className="text-muted-foreground text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}