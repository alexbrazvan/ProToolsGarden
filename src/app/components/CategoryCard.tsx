import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  image: string;
  delay?: number;
  path?: string;
}

export function CategoryCard({ name, icon: Icon, image, delay = 0, path = '#' }: CategoryCardProps) {
  return (
    <Link to={path} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ scale: 1.05 }}
        className="group"
      >
        <div className="bg-white border-2 border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-lg">
          <div className="relative aspect-square bg-secondary overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Icon size={32} className="mb-2" />
              <h3 className="font-bold text-lg">{name}</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
