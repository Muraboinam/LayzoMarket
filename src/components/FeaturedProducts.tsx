import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useFeaturedAppTemplates, useFeaturedWebsiteTemplates, useFeaturedComboTemplates, useFeaturedN8nWorkflowTemplates } from '../hooks/useFirestoreTemplates';
import { useFirestoreSection } from '../hooks/useFirestoreSection';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onPreview: (product: Product) => void;
  onTemplateClick?: (product: Product) => void;
}

export default function FeaturedProducts({ onAddToCart, onPreview, onTemplateClick }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const { section: featuredSection, loading: sectionLoading } = useFirestoreSection('featured-products');
  
  // Fetch featured templates from all categories
  const { templates: featuredAppTemplates, loading: appLoading } = useFeaturedAppTemplates(4);
  const { templates: featuredWebsiteTemplates, loading: websiteLoading } = useFeaturedWebsiteTemplates(4);
  const { templates: featuredComboTemplates, loading: comboLoading } = useFeaturedComboTemplates(4);
  const { templates: featuredN8nTemplates, loading: n8nLoading } = useFeaturedN8nWorkflowTemplates(4);

  // Combine all featured templates
  const allFeaturedTemplates = [
    ...featuredAppTemplates,
    ...featuredWebsiteTemplates,
    ...featuredComboTemplates,
    ...featuredN8nTemplates
  ];

  // Sort by downloads and limit to maxItems from section config
  const maxItems = featuredSection?.content?.maxItems || 8;
  const featuredProducts = allFeaturedTemplates
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, maxItems);

  const isLoading = sectionLoading || appLoading || websiteLoading || comboLoading || n8nLoading;

  // Don't render if section is not active or doesn't exist
  if (!featuredSection || !featuredSection.isActive) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured templates from all categories...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no featured products available
  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured templates available</h3>
            <p className="text-gray-600">Featured templates will appear here once they are added to Firestore with featured: true.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {featuredSection?.title || 'Featured Templates'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {featuredSection?.subtitle || 'Hand-picked premium templates from all categories that deliver exceptional value and quality'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {featuredAppTemplates.length} Apps
            </span>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {featuredWebsiteTemplates.length} Websites
            </span>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {featuredComboTemplates.length} Combos
            </span>
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              {featuredN8nTemplates.length} n8n Workflows
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
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
            onClick={() => navigate('/templates')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}