import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { SearchBar } from '@/app/components/SearchBar';


const categories = [
  { name: 'Power Tools', path: '/power-tools' },
  { name: 'Garden Tools', path: '/garden-tools' },
  { name: 'Construction Equipment', path: '/construction-equipment' },
  { name: 'Accessories', path: '/accessories' },
  { name: 'Promotions', path: '/promotions' },
];

export function Header() {
  const { totalItems } = useCart();
  const { profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const headerHeight = useTransform(scrollY, [0, 100], [120, 80]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  // Închide dropdown-ul când se dă click în afara lui
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  // Numele afișat în header — prenumele sau emailul înainte de @
  const displayName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : profile?.email?.split('@')[0];

  return (
    <motion.header
      style={{ height: headerHeight }}
      className="sticky top-0 z-50 bg-white border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between gap-4 mb-3">

          {/* ── Logo ── */}
          <motion.div style={{ scale: logoScale }}>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">PT</span>
              </div>
              <span className="font-bold text-xl text-primary hidden sm:block">ProTools</span>
            </Link>
          </motion.div>

          {/* ── Search ── */}
          <div className="flex-1 max-w-2xl hidden md:block">
  <SearchBar />
</div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-4">

            {/* Account — logat sau nelogat */}
            {isAuthenticated ? (
              /* ── Dropdown utilizator autentificat ── */
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{displayName}</span>
                  <ChevronDown
                    size={16}
                    className={`hidden lg:inline transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-border shadow-lg overflow-hidden"
                    >
                      {/* Info utilizator */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs text-muted-foreground">Conectat ca</p>
                        <p className="text-sm font-medium text-foreground truncate">{profile?.email}</p>
                      </div>

                      {/* Link cont */}
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <User size={16} />
                        Contul meu
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-border"
                      >
                        <LogOut size={16} />
                        Deconectează-te
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Buton Login (neautentificat) ── */
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <User size={24} />
                <span className="hidden lg:inline text-sm">Login</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Heart size={24} />
              <span className="hidden lg:inline text-sm">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors relative">
              <ShoppingCart size={24} />
              <span className="hidden lg:inline text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* ── Desktop nav ── */}
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

        {/* ── Mobile menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border pt-3 pb-2">
            <div className="mb-3 relative">
              <SearchBar
  placeholder="Caută..."
  onClose={() => setMobileMenuOpen(false)}
/>
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
              {/* Login/Account în mobile menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="text-sm font-medium text-foreground hover:text-accent py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contul meu ({displayName})
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="text-left text-sm font-medium text-red-600 hover:text-red-700 py-1"
                  >
                    Deconectează-te
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground hover:text-accent py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
