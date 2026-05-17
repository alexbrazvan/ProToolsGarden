import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/app/lib/supabase';
import { formatPrice, getFirstImage, type Product } from '@/app/services/products';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onClose?: () => void; // pentru mobile
}

export function SearchBar({
  placeholder = 'Caută scule, echipamente, accesorii...',
  className = '',
  inputClassName = '',
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Caută în Supabase ─────────────────────────────────────────────────────
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (id, image_url, alt_text, sort_order),
          categories (id, name, slug)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
        .limit(6);

      if (error) throw error;

      const products = (data || []).map((p: any) => ({
        ...p,
        product_images: (p.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      }));

      setResults(products);
      setIsOpen(true);
    } catch (err) {
      console.error('[SearchBar] search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Debounce ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      search(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  // ── Click în afara dropdown-ului ──────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── ESC închide dropdown-ul ───────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Navighează la produs ──────────────────────────────────────────────────
  const handleSelectProduct = (product: Product) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onClose?.();
    navigate(`/product/${product.id}`);
  };

  // ── Caută toate rezultatele ───────────────────────────────────────────────
  const handleSearchAll = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearchAll();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full h-12 pl-12 pr-10 rounded-lg border-2 border-border bg-input-background focus:border-primary focus:outline-none transition-colors ${inputClassName}`}
        />
        {/* Clear sau Loader */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 size={18} className="text-muted-foreground animate-spin" />
          ) : query ? (
            <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown rezultate */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden"
          >
            {results.length === 0 && !isLoading && query.length >= 2 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nu am găsit produse pentru „{query}"
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="p-2">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      {/* Imagine */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary/50 shrink-0">
                        <img
                          src={getFirstImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=No'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {product.brand && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
                        )}
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(product.price_cents, product.currency)}
                        </p>
                      </div>

                      {/* Categorie */}
                      {product.categories && (
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full shrink-0">
                          {product.categories.name}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer — vezi toate */}
                <div className="border-t border-border px-4 py-3">
                  <button
                    onClick={handleSearchAll}
                    className="w-full text-sm text-accent hover:text-accent/80 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Search size={14} />
                    Vezi toate rezultatele pentru „{query}"
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
