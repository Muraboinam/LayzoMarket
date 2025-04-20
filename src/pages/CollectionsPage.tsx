import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from '../components/ui/Link';

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  templateCount: number;
  category: string;
}

const collections: Collection[] = [
  {
    id: '1',
    title: 'Modern Business Templates',
    description: 'Professional and sleek templates perfect for modern businesses',
    image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 24,
    category: 'Business'
  },
  {
    id: '2',
    title: 'Creative Portfolio Themes',
    description: 'Showcase your work with these stunning portfolio templates',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 18,
    category: 'Portfolio'
  },
  {
    id: '3',
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce templates with modern shopping features',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 15,
    category: 'E-commerce'
  },
  {
    id: '4',
    title: 'Restaurant & Food',
    description: 'Beautiful templates for restaurants, cafes, and food businesses',
    image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 12,
    category: 'Food & Beverage'
  },
  {
    id: '5',
    title: 'Education & Learning',
    description: 'Templates for educational institutions and online courses',
    image: 'https://images.pexels.com/photos/5428147/pexels-photo-5428147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 20,
    category: 'Education'
  },
  {
    id: '6',
    title: 'Health & Wellness',
    description: 'Templates for fitness, healthcare, and wellness businesses',
    image: 'https://images.pexels.com/photos/4325478/pexels-photo-4325478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    templateCount: 16,
    category: 'Health'
  }
];

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4">
            Template Collections
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our curated collections of premium templates designed for specific industries and purposes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 mb-4">
                  {collection.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {collection.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {collection.templateCount} templates
                  </span>
                  <Link
                    href={`/templates?collection=${collection.id}`}
                    className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    View Collection
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;