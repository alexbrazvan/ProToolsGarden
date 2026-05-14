import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;       // product_id
  name: string;
  price: number;    // în unități întregi (ex: 89.99)
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>; // alias
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'protools_cart';

// ─── Helpers localStorage ─────────────────────────────────────────────────────
function getLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage poate fi blocat în unele browsere
  }
}

function clearLocalCart() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const { profile, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Încarcă coșul ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      loadSupabaseCart(profile.id);
    } else {
      // Utilizator neautentificat — citim din localStorage
      setItems(getLocalCart());
      setIsLoading(false);
    }
  }, [isAuthenticated, profile?.id]);

  // ── La login: migrează coșul din localStorage în Supabase ────────────────
  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      migrateLocalCartToSupabase(profile.id);
    }
  }, [isAuthenticated, profile?.id]);

  // ── Load din Supabase ─────────────────────────────────────────────────────
  const loadSupabaseCart = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            id,
            name,
            price_cents,
            currency,
            product_images (image_url, sort_order)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((row: any) => {
        const product = row.products;
        const images = (product?.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
        return {
          id: row.product_id,
          name: product?.name || 'Produs',
          price: (product?.price_cents || 0) / 100,
          image: images[0]?.image_url || '',
          quantity: row.quantity,
        };
      });

      setItems(cartItems);
    } catch (err) {
      console.error('[CartContext] loadSupabaseCart error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Migrare localStorage → Supabase ──────────────────────────────────────
  const migrateLocalCartToSupabase = async (userId: string) => {
    const localItems = getLocalCart();
    if (localItems.length === 0) return;

    try {
      for (const item of localItems) {
        await upsertSupabaseItem(userId, item.id, item.quantity);
      }
      clearLocalCart();
      await loadSupabaseCart(userId);
    } catch (err) {
      console.error('[CartContext] migrateLocalCart error:', err);
    }
  };

  // ── Upsert în Supabase (insert sau update dacă există) ────────────────────
  const upsertSupabaseItem = async (userId: string, productId: string, quantity: number) => {
    // Verifică dacă există deja
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity });
    }
  };

  // ── addItem ───────────────────────────────────────────────────────────────
  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    if (isAuthenticated && profile?.id) {
      // Supabase
      await upsertSupabaseItem(profile.id, item.id, 1);
      await loadSupabaseCart(profile.id);
    } else {
      // localStorage
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        const updated = existing
          ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { ...item, quantity: 1 }];
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, profile?.id]);

  // ── removeFromCart ────────────────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId: string) => {
    if (isAuthenticated && profile?.id) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', profile.id)
        .eq('product_id', productId);
      setItems((prev) => prev.filter((i) => i.id !== productId));
    } else {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== productId);
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, profile?.id]);

  // ── updateQuantity ────────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated && profile?.id) {
      await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('user_id', profile.id)
        .eq('product_id', productId);
      setItems((prev) => prev.map((i) => i.id === productId ? { ...i, quantity } : i));
    } else {
      setItems((prev) => {
        const updated = prev.map((i) => i.id === productId ? { ...i, quantity } : i);
        saveLocalCart(updated);
        return updated;
      });
    }
  }, [isAuthenticated, profile?.id, removeFromCart]);

  // ── clearCart ─────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isAuthenticated && profile?.id) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', profile.id);
    } else {
      clearLocalCart();
    }
    setItems([]);
  }, [isAuthenticated, profile?.id]);

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      addToCart: addItem, // alias pentru compatibilitate
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
