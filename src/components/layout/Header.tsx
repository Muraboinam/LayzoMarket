import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { Link } from '../ui/Link';
import SearchBar from '../ui/SearchBar';
import { isAuthenticated, logout } from '../../data/admin';
import { isUserAuthenticated, logout as userLogout } from '../../data/auth';
import { getCart } from '../../data/cart';
import { getWaitlist } from '../../data/waitlist';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const updateCounts = () => {
      const cart = getCart();
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(cartCount);

      const waitlist = getWaitlist();
      setWaitlistCount(waitlist.length);
    };

    setIsAdmin(isAuthenticated());
    setIsUser(isUserAuthenticated());
    window.addEventListener('scroll', handleScroll);
    updateCounts();

    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const handleLogout = () => {
    if (isAdmin) {
      logout();
      window.location.href = '/admin/login';
    } else {
      userLogout();
      window.location.href = '/login';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center">
              <span className="text-primary">Layzo</span>
              <span className="text-gray-800">Market</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
            <Link href="/templates" className="text-gray-700 hover:text-primary transition-colors">Templates</Link>
            <Link href="/collections" className="text-gray-700 hover:text-primary transition-colors">Collections</Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block w-1/3">
            <SearchBar />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 text-gray-700 hover:text-primary transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <Link 
              href="/waitlist"
              className="p-2 text-gray-700 hover:text-primary transition-colors relative"
            >
              <Heart size={20} />
              {waitlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {waitlistCount}
                </span>
              )}
            </Link>
            <Link 
              href="/cart"
              className="p-2 text-gray-700 hover:text-primary transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isUser ? (
              <Link 
                href="/profile"
                className="p-2 text-gray-700 hover:text-primary transition-colors hidden md:block"
              >
                <User size={20} />
              </Link>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="p-2 text-gray-700 hover:text-primary transition-colors hidden md:block"
              >
                <User size={20} />
              </button>
            )}
            {(isAdmin || isUser) && (
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white mt-4 p-4 rounded-lg shadow-lg">
            <SearchBar className="mb-4" />
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors py-2">Home</Link>
              <Link href="/templates" className="text-gray-700 hover:text-primary transition-colors py-2">Templates</Link>
              <Link href="/collections" className="text-gray-700 hover:text-primary transition-colors py-2">Collections</Link>
              <Link href="/cart" className="text-gray-700 hover:text-primary transition-colors py-2">Cart</Link>
              <Link href="/waitlist" className="text-gray-700 hover:text-primary transition-colors py-2">Waitlist</Link>
              {isUser ? (
                <Link href="/profile" className="text-gray-700 hover:text-primary transition-colors py-2">Profile</Link>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-primary transition-colors py-2">Login</Link>
              )}
              {(isAdmin || isUser) && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;