import { Link } from 'react-router';
import { Search, User, Heart, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState } from 'react';

const categories = [
  { name: 'Power Tools', path: '/power-tools' },
  { name: 'Garden Tools', path: '/garden-tools' },
  { name: 'Construction Equipment', path: '/construction-equipment' },
  { name: 'Accessories', path: '/accessories' },
  { name: 'Promotions', path: '/promotions' }
];

export function Header() {
  const { totalItems } = useCart();
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerHeight = useTransform(scrollY, [0, 100], [120, 80]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  return (
    <motion.header
      style={{ height: headerHeight }}
      className="sticky top-0 z-50 bg-white border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between gap-4 mb-3">
          <motion.div style={{ scale: logoScale }}>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">PT</span>
              </div>
              <span className="font-bold text-xl text-primary hidden sm:block">ProTools</span>
            </Link>
          </motion.div>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search for tools, equipment, accessories..."
                className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-border bg-input-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/account" className="hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <User size={24} />
              <span className="hidden lg:inline text-sm">Account</span>
            </Link>
            <Link to="/wishlist" className="hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Heart size={24} />
              <span className="hidden lg:inline text-sm">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors relative">
              <ShoppingCart size={24} />
              <span className="hidden lg:inline text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 border-t border-border pt-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border pt-3 pb-2">
            <div className="mb-3">
              <Search className="absolute left-8 top-[130px] text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-input-background"
              />
            </div>
            <nav className="flex flex-col gap-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-sm font-medium text-foreground hover:text-accent py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
