import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import TemplateDetailsPage from '../components/TemplateDetailsPage';
import { Product, CartItem } from '../types';
import { useWebsiteTemplates } from '../hooks/useFirestoreTemplates';

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use Firestore hook to fetch website templates
  const { templates: firestoreTemplates, loading: templatesLoading, error: templatesError } = useWebsiteTemplates();

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cartItems');
      if (updatedCart) {
        setCart(JSON.parse(updatedCart));
      }
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  // Use Firestore templates or fallback to empty array
  const websiteProducts = firestoreTemplates.length > 0 ? firestoreTemplates : [];

  const categories = [
    { id: 'all', name: 'All Templates', count: 14 },
    { id: 'Landing Pages', name: 'Landing Pages', count: 1854 },
    { id: 'ecommerce', name: 'E-commerce', count: 1247 },
    { id: 'portfolio', name: 'Portfolio', count: 523 },
    { id: 'business', name: 'Business', count: 687 }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = websiteProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all' || 
                             product.subcategory === selectedCategory ||
                             product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products by most popular (downloads) by default
    filtered.sort((a, b) => b.downloads - a.downloads);

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, websiteProducts]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      const updatedCart = existing
        ? prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { product, quantity: 1 }];
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleTemplateClick = (product: Product) => {
    setSelectedProductForDetails(product);
    setShowTemplateDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowTemplateDetails(false);
    setSelectedProductForDetails(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Show template details page
  if (showTemplateDetails && selectedProductForDetails) {
    return (
      <TemplateDetailsPage
        product={selectedProductForDetails}
        onBack={handleBackFromDetails}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header cartCount={cartCount} onSearchChange={setSearchQuery} profitableUrl="" />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4">
            Website Templates
          </h1>
          <div className="text-xl text-purple-200 mb-8">
            {templatesLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                <span>Loading website templates from Firestore...</span>
              </div>
            ) : templatesError ? (
              <div className="text-red-400">
                Error loading templates: {templatesError}
              </div>
            ) : (
              <span>
                Discover premium website templates crafted by talented designers. Build stunning websites in minutes with our collection.
                {firestoreTemplates.length > 0 && ` (${firestoreTemplates.length} templates loaded from Firestore)`}
              </span>
            )}
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates, themes, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Filters Header */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-300/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button className="text-purple-300 hover:text-white text-sm">Clear All</button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        (selectedCategory === category.id || (!selectedCategory && category.id === 'all'))
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-purple-300 mt-2">
                      <span>₹0</span>
                      <span>₹25,000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-purple-200">
                    <span>₹0</span>
                    <span>-</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {templatesLoading ? 'Loading...' : `Showing ${filteredProducts.length} results`}
                </h2>
                {firestoreTemplates.length > 0 && (
                  <p className="text-purple-300 text-sm">
                    Data loaded from Firestore • {firestoreTemplates.length} total templates
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {templatesLoading ? (
                // Loading skeleton
                [...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                    <div className="bg-white/20 h-48 rounded-lg mb-4"></div>
                    <div className="bg-white/20 h-4 rounded mb-2"></div>
                    <div className="bg-white/20 h-3 rounded mb-4"></div>
                    <div className="bg-white/20 h-8 rounded"></div>
                  </div>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onPreview={handlePreview}
                    onTemplateClick={handleTemplateClick}
                  />
                ))
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-purple-300 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                <p className="text-purple-300">
                  {templatesError ? 'Error loading templates from Firestore' : 'Try adjusting your filters or search terms'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  );
};

export default TemplatesPage;