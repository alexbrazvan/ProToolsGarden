import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export function OrderSuccess() {
  const { clearCart } = useCart();

  // Golim coșul după plată reușită
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} className="text-green-600" />
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground mb-3">Comandă plasată!</h1>
        <p className="text-muted-foreground mb-2">
          Îți mulțumim pentru comandă. Vei primi un email de confirmare în curând.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Poți urmări statusul comenzii din secțiunea <strong>Contul meu → Comenzi</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag size={18} />
            Vezi comenzile mele
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-bold hover:bg-secondary transition-colors"
          >
            Continuă cumpărăturile
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
