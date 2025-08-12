import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Zap, Star } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useFeaturedComboTemplates } from '../hooks/useFirestoreTemplates';
import { useFirestoreSection } from '../hooks/useFirestoreSection';

interface ComboSectionProps {
  onAddToCart: (product: Product) => void;
  onPreview: (product: Product) => void;
  onTemplateClick?: (product: Product) => void;
}

export default function ComboSection({ onAddToCart, onPreview, onTemplateClick }: ComboSectionProps) {
  const navigate = useNavigate();
  const { section: comboSection, loading, error } = useFirestoreSection('combo-section');
  const { templates: comboProducts, loading: comboLoading } = useFeaturedComboTemplates(4);
  
  // Don't render if section is not active or doesn't exist
  if (!comboSection || !comboSection.isActive) {
    return null;
  }
  
  // Show loading state
  if (loading || comboLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-purple-200">Loading combo section...</p>
          </div>
        </div>
      </section>
    );
  }
  
  const maxItems = comboSection?.content?.maxItems || 4;
  const displayedProducts = comboProducts.slice(0, maxItems);

  // Don't render if no combo products available
  if (displayedProducts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-purple-300 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-white mb-4">No combo packages available</h3>
            <p className="text-purple-300">Combo packages will appear here once they are added to Firestore.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-purple-400 mr-3 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              {comboSection?.title || 'Combo Packages'}
            </h2>
            <Zap className="w-8 h-8 text-pink-400 ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-6">
            {comboSection?.subtitle || 'Get the complete solution! Website + Mobile App combos that work seamlessly together.'}
          </p>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {comboSection?.content?.benefits?.map((benefit: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-300/20">
                {index === 0 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                {index === 1 && <Package className="w-4 h-4 text-green-400" />}
                {index === 2 && <Zap className="w-4 h-4 text-orange-400" />}
                {index > 2 && <Star className="w-4 h-4 text-blue-400" />}
                <span className="text-purple-200 text-sm">{benefit}</span>
              </div>
            )) || (
              // Fallback benefits if not available in Firestore
              <>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-300/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-purple-200 text-sm">Complete Solution</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-300/20">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-purple-200 text-sm">Website + Mobile App</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-300/20">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-purple-200 text-sm">Save up to 40%</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
          {displayedProducts.map((product) => (
            <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onPreview={onPreview}
                onTemplateClick={onTemplateClick}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/combo')}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            <Package className="w-5 h-5" />
            <span>View All Combo Packages</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Special Offer Banner */}
        <div className="mt-16 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-300/30 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse mr-2" />
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {comboSection?.content?.specialOffer?.title || 'Limited Time Offer'}
            </h3>
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse ml-2" />
          </div>
          <p className="text-purple-200 mb-6">
            {comboSection?.content?.specialOffer?.description || 'Buy any combo package this month and get 6 months of premium support absolutely free!'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {comboSection?.content?.specialOffer?.features?.map((feature: string, index: number) => (
              <div key={index} className="bg-white/10 px-4 py-2 rounded-lg">
                <span className={`font-semibold ${
                  index === 0 ? 'text-green-400' : 
                  index === 1 ? 'text-blue-400' : 
                  index === 2 ? 'text-purple-400' : 'text-yellow-400'
                }`}>
                  ✓ {feature}
                </span>
              </div>
            )) || (
              // Fallback features if not available in Firestore
              <>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-green-400 font-semibold">✓ Free Premium Support</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-blue-400 font-semibold">✓ Free Updates</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-purple-400 font-semibold">✓ Priority Assistance</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}