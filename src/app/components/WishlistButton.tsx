import { Heart } from 'lucide-react';
import { useWishlist } from '@/app/hooks/useWishlist';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const inWishlist = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    await toggleWishlist(productId);
  };

  return (
    <button
      onClick={handleClick}
      title={inWishlist ? 'Șterge din wishlist' : 'Adaugă la wishlist'}
      className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 ${className}`}
    >
      <Heart
        size={18}
        className={inWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-400'}
      />
    </button>
  );
}
