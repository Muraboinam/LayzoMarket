import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  onSearchChange: (query: string) => void;
  profitableUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onSearchChange, profitableUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen && !(event.target as Element).closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleWishlistUpdate = (event?: CustomEvent) => {
      const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
      setWishlistCount(wishlistItems.length);
      
      // Show a brief notification
      if (event?.detail) {
        const { action, product } = event.detail;
        console.log(`${action === 'add' ? 'Added to' : 'Removed from'} wishlist: ${product.title}`);
      }
    };

    const handleCartUpdate = () => {
      // This will trigger a re-render with the updated cartCount prop
      // The cartCount is passed from the parent component
    };

    // Initialize wishlist count
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    setWishlistCount(wishlistItems.length);

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('wishlistUpdate', handleWishlistUpdate as EventListener);
    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('wishlistUpdate', handleWishlistUpdate as EventListener);
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [isProfileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfitableClick = () => {
    if (profitableUrl) {
      window.open(profitableUrl, '_blank');
    } else {
      // Fallback or placeholder behavior
      console.log('Profitable URL not configured yet');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const SearchBar = ({ className = '' }: { className?: string }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="relative w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-300 hover:bg-white focus:bg-white shadow-lg hover:shadow-xl focus:shadow-2xl placeholder-gray-500"
      />
    </div>
  );

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black shadow-2xl shadow-black/25 py-3 border-b border-white/10' 
          : 'bg-black/90 backdrop-blur-md py-5 border-b border-white/5'
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1 left-1/2 w-1.5 h-1.5 bg-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            {/* Logo with enhanced styling */}
            <button onClick={() => handleNavigation('/')} className="text-2xl font-bold flex items-center hover-scale animate-bounce-in group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <img 
                src="https://files.catbox.moe/sfwggl.png" 
                alt="LayzoMarket Logo" 
                className="w-8 h-8 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-yellow-300 animate-rainbow">Layzo</span>
              <span className="text-white ml-1 relative">Market</span>
              <Sparkles className="w-4 h-4 text-yellow-400 ml-2 animate-pulse opacity-80" />
            </button>

            {/* Enhanced Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { path: '/', label: 'Home' },
                { path: '/templates', label: 'Website' },
                { path: '/apps', label: 'Apps' },
                { path: '/n8n', label: 'n8n' },
                { path: '/combo', label: 'Combo' }
              ].map(({ path, label }) => (
                <button 
                  key={path}
                  onClick={() => handleNavigation(path)} 
                  className="relative px-4 py-2 text-white/90 hover:text-yellow-300 transition-all duration-300 font-medium group rounded-lg hover:bg-white/10"
                >
                  <span className="relative z-10">{label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 group-hover:w-full transition-all duration-300"></div>
                </button>
              ))}
            </nav>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:block w-1/3 relative">
            <SearchBar />
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button className="p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 hidden md:block lg:hidden hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Search size={18} />
            </button>
            
            {/* Wishlist Button */}
            <button 
              onClick={() => handleNavigation('/wishlist')}
              className="p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 relative hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20 group"
            >
              <Heart size={18} className="group-hover:fill-current transition-all duration-300" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in shadow-lg border border-white/30">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={() => handleNavigation('/cart')}
              className="p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 relative hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20 group"
            >
              <ShoppingCart size={18} className="group-hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in shadow-lg border border-white/30">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Profile Button */}
            <button 
              onClick={handleProfileClick}
              className={`p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 hidden md:block hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20 group relative profile-menu-container ${user ? 'ring-2 ring-green-400/50' : ''}`}
              title={user ? `Signed in as ${user.displayName || user.email}` : 'Sign in'}
            >
              <User size={18} className="group-hover:scale-110 transition-transform duration-300" />
              {user && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
              )}
            </button>
            
            {/* Profile Dropdown Menu */}
            {user && isProfileMenuOpen && (
              <div className="absolute top-16 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-4 min-w-[250px] z-50 animate-slide-in-up profile-menu-container">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.displayName || 'User'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/orders');
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>My Orders</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Profitable Button */}
            <button 
              onClick={handleProfitableClick}
              className="p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 hidden md:block hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20 group relative"
              title="Profitable Solutions"
            >
              <TrendingUp size={18} className="group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="p-3 text-white/90 hover:text-yellow-300 transition-all duration-300 md:hidden hover-scale bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md mt-6 p-6 rounded-xl shadow-2xl border border-white/30 animate-slide-in-up mx-2">
            <SearchBar className="mb-6" />
            <nav className="flex flex-col space-y-2">
              {[
                { path: '/', label: 'Home', icon: '🏠' },
                { path: '/templates', label: 'Website', icon: '🌐' },
                { path: '/apps', label: 'Apps', icon: '📱' },
                { path: '/n8n', label: 'n8n', icon: '🤖' },
                { path: '/combo', label: 'Combo', icon: '📦' },
                { path: '/login', label: 'Sign In', icon: '👤' }
              ].map(({ path, label, icon }) => (
                <button 
                  key={path}
                  onClick={() => handleNavigation(path)} 
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-all duration-300 py-3 px-4 text-left rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover-lift group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button 
                onClick={handleProfitableClick} 
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-all duration-300 py-3 px-4 text-left rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover-lift group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">💰</span>
                <span className="font-medium">Profitable</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;