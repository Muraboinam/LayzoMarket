import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import CategoryCard from './CategoryCard';
import { useFirestoreSection } from '../hooks/useFirestoreSection';

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const { section: categoriesSection, loading, error } = useFirestoreSection('categories');
  const [activeTab, setActiveTab] = useState<'templates' | 'apps' | 'n8n-agents'>('templates');
  const [categories, setCategories] = useState<Category[]>([]);
  const [appCategories, setAppCategories] = useState<Category[]>([]);
  const [n8nAgentCategories, setN8nAgentCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categoriesSection && categoriesSection.content) {
      // Set categories from Firestore data
      if (categoriesSection.content.websiteCategories) {
        setCategories(categoriesSection.content.websiteCategories);
      }
      if (categoriesSection.content.appCategories) {
        setAppCategories(categoriesSection.content.appCategories);
      }
      if (categoriesSection.content.n8nAgentCategories) {
        setN8nAgentCategories(categoriesSection.content.n8nAgentCategories);
      }
    } else {
      // Set default empty categories if Firestore data is not available
      setCategories([]);
      setAppCategories([]);
      setN8nAgentCategories([]);
    }
    
    if (error) {
      console.error('Error loading categories data:', error);
      // Keep empty arrays if Firestore fails
    }
  }, [categoriesSection, error]);

  const getCurrentCategories = () => {
    if (!categoriesSection || !categoriesSection.content) {
      return [];
    }
    
    switch (activeTab) {
      case 'templates':
        return categoriesSection.content.websiteCategories || [];
      case 'apps':
        return categoriesSection.content.appCategories || [];
      case 'n8n-agents':
        return categoriesSection.content.n8nAgentCategories || [];
      default:
        return categoriesSection.content.websiteCategories || [];
    }
  };

  const handleViewAllCategories = () => {
    switch (activeTab) {
      case 'templates':
        navigate('/templates');
        break;
      case 'apps':
        navigate('/apps');
        break;
      case 'n8n-agents':
        navigate('/n8n');
        break;
    }
  };

  const handleTabChange = (tab: 'templates' | 'apps' | 'n8n-agents') => {
    setActiveTab(tab);
  };

  const getTabDescription = () => {
    if (!categoriesSection || !categoriesSection.content || !categoriesSection.content.tabs) {
      switch (activeTab) {
        case 'templates':
          return 'Find the perfect template for your specific needs';
        case 'apps':
          return 'Discover powerful apps for your business';
        case 'n8n-agents':
          return 'Intelligent AI agents for automation and productivity';
        default:
          return '';
      }
    }
    
    const currentTab = categoriesSection.content.tabs.find((tab: any) => tab.id === activeTab);
    return currentTab ? currentTab.description : '';
  };
  const currentCategories = getCurrentCategories();

  // Don't render if section is not active or doesn't exist
  if (!categoriesSection || !categoriesSection.isActive) {
    return null;
  }
  
  // Show loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-yellow-200">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent inline-block">
              {categoriesSection?.title || 'Browse Categories'}
            </h2>
            <p className="text-yellow-500/80 mt-2">
              {getTabDescription() || categoriesSection?.subtitle || 'Find the perfect template for your specific needs'}
            </p>
          </div>
          
          <button 
            onClick={handleViewAllCategories}
            className="hidden md:flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            View all categories
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        {/* Category Type Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => handleTabChange('templates')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'templates'
                ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'bg-black/50 text-yellow-500/80 hover:bg-black/70 border border-yellow-500/20'
            }`}
          >
            Website Templates
          </button>
          <button
            onClick={() => handleTabChange('apps')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'apps'
                ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'bg-black/50 text-yellow-500/80 hover:bg-black/70 border border-yellow-500/20'
            }`}
          >
            Apps
          </button>
          <button
            onClick={() => handleTabChange('n8n-agents')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'n8n-agents'
                ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'bg-black/50 text-yellow-500/80 hover:bg-black/70 border border-yellow-500/20'
            }`}
          >
            n8n AI Agents
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              type={activeTab}
            />
          ))}
        </div>
        
        {currentCategories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-yellow-300 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
            <p className="text-yellow-300">Categories will appear here once they are added to Firestore.</p>
          </div>
        )}
        
        <div className="mt-10 text-center md:hidden">
          <button 
            onClick={handleViewAllCategories}
            className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            View all categories
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;