import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield } from 'lucide-react';

const LuxurySection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-6">
            Luxury & Elegant Templates
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our collection of premium templates crafted with sophistication and elegance in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Premium Quality</h3>
            <p className="text-gray-400">
              Each template is meticulously crafted with attention to detail and luxury aesthetics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Award Winning</h3>
            <p className="text-gray-400">
              Recognized designs that stand out in both aesthetics and functionality
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Elite Support</h3>
            <p className="text-gray-400">
              Dedicated premium support to ensure your success with our templates
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LuxurySection;