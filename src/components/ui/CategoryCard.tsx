import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../data/categories';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, className = '' }) => {
  const { name, description, icon, count } = category;
  
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as Record<string, React.FC<{ size?: number }>>)[
    icon.charAt(0).toUpperCase() + icon.slice(1)
  ] || LucideIcons.File;

  return (
    <motion.div 
      className={`block bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100 ${className}`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-4">
        <motion.div 
          className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center text-primary mr-4"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <IconComponent size={24} />
        </motion.div>
        <div>
          <motion.h3 
            className="text-lg font-medium text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {name}
          </motion.h3>
          <motion.span 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {count} items
          </motion.span>
        </div>
      </div>
      <motion.p 
        className="text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};