import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List, Package, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import TemplateDetailsPage from '../components/TemplateDetailsPage';
import { Product, CartItem } from '../types';
import { useComboTemplates } from '../hooks/useFirestoreTemplates';

const ComboPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch combo templates from Firestore
  const { templates: comboProducts, loading: templatesLoading, error: templatesError } = useComboTemplates();
  
  // Define combo categories locally
  const comboCategories = [
    {
      id: "ecommerce-combo",
      name: "E-commerce Complete",
      description: "Full e-commerce solution with website and mobile app",
      icon: "shopping-cart",
      count: 0,
      featured: true,
    },
    {
      id: "business-combo",
      name: "Business Suite",
      description: "Professional business website with companion mobile app",
      icon: "briefcase",
      count: 0,
      featured: true,
    }
  ];
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = comboProducts.filter(product => {
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
  }, [searchQuery, selectedCategory, priceRange, comboProducts]);

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
      window.dispatchEvent(new Event('cartUpdate'));
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

  // Show loading state while templates are being fetched
  if (templatesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading combo packages from Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header cartCount={cartCount} onSearchChange={setSearchQuery} profitableUrl="" />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Package className="w-16 h-16 text-purple-400 mr-4 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Combo Packages
            </h1>
            <Zap className="w-16 h-16 text-pink-400 ml-4 animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed">
            Complete solutions combining website and mobile app. Get everything you need in one package and save up to 40%!
          </p>
          
          {/* Benefits Banner */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/20 hover:bg-white/20 transition-all duration-300">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-purple-200 font-medium">Website + Mobile App</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/20 hover:bg-white/20 transition-all duration-300">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-purple-200 font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-300/20 hover:bg-white/20 transition-all duration-300">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-purple-200 font-medium">Save up to 40%</span>
            </div>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-6 h-6" />
            <input
              type="text"
              placeholder="Search combo packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Filters Header */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-300/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 50000]);
                  }}
                  className="text-purple-300 hover:text-white text-sm font-medium transition-colors bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1 rounded-lg"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Categories
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      !selectedCategory
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">All Combos</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{comboProducts.length}</span>
                  </button>
                  {comboCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'text-purple-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="font-medium text-left">{category.name}</span>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <span className="text-green-400 mr-2">₹</span>
                  Price Range
                </h4>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-purple-300 mt-2">
                      <span>₹0</span>
                      <span>₹50,000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-purple-200 bg-white/5 p-3 rounded-lg">
                    <span>₹0</span>
                    <span className="text-purple-400">to</span>
                    <span className="font-semibold">₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Special Offers */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
                <div className="flex items-center mb-3">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                  <h4 className="text-yellow-400 font-semibold">Limited Time Offer</h4>
                </div>
                <p className="text-yellow-200 text-sm mb-3">
                  Save up to 40% with combo packages + get 6 months premium support free!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full">Free Support</span>
                  <span className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded-full">Free Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-purple-300/20">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {templatesLoading ? 'Loading...' : `${filteredProducts.length} Combo Package${filteredProducts.length !== 1 ? 's' : ''} Found`}
                </h2>
                <p className="text-purple-200">
                  {templatesLoading ? 'Loading combo packages from Firestore...' : 'Complete website + mobile app solutions'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-white/10 rounded-lg p-1 border border-purple-300/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-purple-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-purple-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${
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
                  <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onPreview={handlePreview}
                      onTemplateClick={handleTemplateClick}
                    />
                  </div>
                ))
              )}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white/5 rounded-lg border border-purple-300/20">
                <Package className="w-24 h-24 text-purple-300 mx-auto mb-6 opacity-50 animate-pulse" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {comboProducts.length === 0 ? 'No combo packages available' : 'No combo packages found'}
                </h3>
                <p className="text-purple-300 mb-8">
                  {comboProducts.length === 0 
                    ? 'Combo packages will appear here once they are added to Firestore.' 
                    : 'Try adjusting your filters or search terms to find what you\'re looking for.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setPriceRange([0, 50000]);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Call to Action Section */}
            {filteredProducts.length > 0 && (
              <div className="mt-16 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-300/30 rounded-xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-yellow-400 animate-pulse mr-3" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Why Choose Combo Packages?
                  </h3>
                  <Zap className="w-8 h-8 text-yellow-400 animate-pulse ml-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-6 border border-purple-300/20">
                    <Package className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Complete Solution</h4>
                    <p className="text-purple-200">Get both website and mobile app that work seamlessly together</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6 border border-purple-300/20">
                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4 fill-current" />
                    <h4 className="text-xl font-semibold text-white mb-2">Premium Quality</h4>
                    <p className="text-purple-200">Hand-crafted designs with clean code and documentation</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6 border border-purple-300/20">
                    <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Great Value</h4>
                    <p className="text-purple-200">Save up to 40% compared to buying separately</p>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                  <Package className="w-6 h-6" />
                  <span>Browse All Combo Packages</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
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

export default ComboPage;