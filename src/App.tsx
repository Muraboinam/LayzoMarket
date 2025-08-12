import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedProducts from './components/FeaturedProducts';
import TestimonialsSection from './components/TestimonialsSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import ComboSection from './components/ComboSection';
import FilterSidebar from './components/FilterSidebar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import TemplateDetailsPage from './components/TemplateDetailsPage';
import TemplatesPage from './pages/TemplatesPage';
import AppsPage from './pages/AppsPage';
import N8nPage from './pages/N8nPage';
import ComboPage from './pages/ComboPage';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import CheckoutPage from './components/CheckoutPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import HomepageManager from './components/HomepageManager';
import FirestoreTemplatesManager from './components/FirestoreTemplatesManager';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LicenseTermsPage from './pages/LicenseTermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Filter } from 'lucide-react';
import { Product, CartItem, Category } from './types';
import LoginPage from './pages/LoginPage';
import QuickChat from './components/QuickChat';
import { useAllTemplates } from './hooks/useFirestoreTemplates';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  
  // Fetch all templates from Firestore
  const { templates: allTemplates, loading: templatesLoading } = useAllTemplates();
  
  // TODO: Configure this URL later
  const profitableUrl = ''; // Add your profitable URL here when ready

  // Define categories locally since we removed mock data
  const categories: Category[] = [
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Complete e-commerce solutions for online stores",
      icon: "shopping-cart",
      count: 0,
      featured: true,
    },
    {
      id: "business",
      name: "Business",
      description: "Professional templates for modern businesses",
      icon: "briefcase",
      count: 0,
      featured: true,
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "Showcase your work with stunning portfolio templates",
      icon: "image",
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
    let filtered = allTemplates.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products by newest first (default)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, allTemplates]);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowHero(false);
    } else {
      setShowHero(true);
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates from Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} onSearchChange={handleSearchChange} profitableUrl={profitableUrl} />
      
      {showHero && <HeroSection />}
      
      {showHero && (
        <FeaturedProducts
          onAddToCart={handleAddToCart}
          onPreview={handlePreview}
          onTemplateClick={handleTemplateClick}
        />
      )}
      
      {showHero && (
        <ComboSection
          onAddToCart={handleAddToCart}
          onPreview={handlePreview}
          onTemplateClick={handleTemplateClick}
        />
      )}
      
      <CategoriesSection />
      
      {showHero && <TestimonialsSection />}
      
      {showHero && <CtaSection />}

      {/* Main Content */}
      {!showHero && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory 
                    ? categories.find(c => c.id === selectedCategory)?.name 
                    : 'All Templates'}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} templates found
                </p>
              </div>
              
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onPreview={handlePreview}
                  onTemplateClick={handleTemplateClick}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
      </div>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <QuickChat />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/n8n" element={<N8nPage />} />
          <Route path="/combo" element={<ComboPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/homepage-manager" element={<HomepageManager />} />
          <Route path="/firestore-templates" element={<FirestoreTemplatesManager />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/license" element={<LicenseTermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;