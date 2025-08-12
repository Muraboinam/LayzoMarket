import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { Product, CartItem } from '../types';
import Header from './Header';
import Footer from './Footer';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWishlistItems();
    loadCartItems();
  }, []);

  const loadWishlistItems = () => {
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    setIsLoading(false);
  };

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    // Dispatch event to update wishlist count in header
    window.dispatchEvent(new Event('wishlistUpdate'));
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    // Dispatch event to update cart count in header
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const addAllToCart = () => {
    let updatedCart = [...cart];

    wishlistItems.forEach(product => {
      const existingItem = updatedCart.find(item => item.product.id === product.id);
      if (existingItem) {
        updatedCart = updatedCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart.push({ product, quantity: 1 });
      }
    });

    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('wishlistItems', JSON.stringify([]));
    window.dispatchEvent(new Event('wishlistUpdate'));
  };

  const shareWishlist = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(window.location.href);
    alert('Wishlist link copied to clipboard!');
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.product.id === productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      <Header cartCount={getCartCount()} onSearchChange={() => {}} profitableUrl="" />
      
      <div className="pt-24 pb-16 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-300/20"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 flex items-center space-x-3">
              <Heart className="w-8 h-8 text-pink-500 fill-current animate-pulse" />
              <span>My Wishlist</span>
            </h1>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-24 h-24 text-pink-400/50 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h2>
              <p className="text-purple-200 mb-8">Save templates you love for later by clicking the heart icon.</p>
              <button
                onClick={() => navigate('/templates')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-purple-200">
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={shareWishlist}
                    className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 px-3 py-2 rounded-lg"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={addAllToCart}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add All to Cart</span>
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group hover:-translate-y-2">
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-pink-500/90 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                      >
                        <Heart className="w-4 h-4 text-white fill-current" />
                      </button>
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-pink-300 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-purple-200 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-purple-300/60 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(product)}
                          className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                            isInCart(product.id)
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;