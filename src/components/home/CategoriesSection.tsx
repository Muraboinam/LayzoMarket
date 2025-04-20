import React from 'react';
import { ArrowRight, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryCard } from '../ui/CategoryCard';
import { getCategories } from '../../data/categories';
import { Link } from '../ui/Link';
import { Button } from '../ui/Button';
import { isAuthenticated } from '../../data/admin';

const CategoriesSection: React.FC = () => {
  // Get featured categories
  const categories = getCategories();
  const featuredCategories = categories.filter(category => category.featured);
  const isAdmin = isAuthenticated();

  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/templates?category=${encodeURIComponent(categoryName)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-600 mt-2">
              Find the perfect template for your specific needs
            </p>
          </div>
          
          <Link 
            href="/templates" 
            className="hidden md:flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all categories
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {featuredCategories.map(category => (
            <motion.div 
              key={category.id} 
              className="relative group"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                onClick={() => handleCategoryClick(category.name)} 
                className="cursor-pointer transform transition-transform duration-300 hover:shadow-xl"
              >
                <CategoryCard category={category} />
              </div>
              {isAdmin && (
                <Button
                  variant="primary"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  leftIcon={<Edit size={16} />}
                  onClick={() => window.location.href = `/admin/category/edit/${category.id}`}
                >
                  Edit
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            href="/templates" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all categories
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;