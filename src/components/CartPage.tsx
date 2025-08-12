import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem, Product } from '../types';
import Header from './Header';
import Footer from './Footer';
import { useAuthContext } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  };

  const updateCartItems = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
    // Dispatch event to update cart count in header
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCartItems(updatedItems);
  };

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.product.id !== productId);
    updateCartItems(updatedItems);
  };

  const clearCart = () => {
    updateCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (user) {
      // User is logged in, proceed to checkout
      navigate('/checkout');
    } else {
      // User is not logged in, redirect to login page
      // Store the intended destination in sessionStorage so we can redirect back after login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header cartCount={getTotalItems()} onSearchChange={() => {}} profitableUrl="" />
      
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
                <span>Continue Shopping</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Shopping Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-purple-400/50 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
              <p className="text-purple-200 mb-8">Looks like you haven't added any templates to your cart yet.</p>
              <button
                onClick={() => navigate('/templates')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Cart Items ({getTotalItems()})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
                  >
                    Clear Cart
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.product.id} className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-lg border border-purple-300/30"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 hover:text-purple-300 transition-colors">
                          {item.product.title}
                        </h3>
                        <p className="text-purple-200 text-sm mb-2 line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.product.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-400/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className="text-right">
                          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </div>
                          {item.product.originalPrice && (
                            <div className="text-sm text-purple-300/60 line-through">
                              ₹{item.product.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-purple-300/30 text-purple-300 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-purple-300/30 text-purple-300 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-300 p-2 transition-colors hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 sticky top-24 shadow-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Subtotal ({getTotalItems()} items)</span>
                      <span className="font-medium text-white">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Tax</span>
                      <span className="font-medium text-white">₹0</span>
                    </div>
                    <div className="border-t border-purple-300/20 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                          ₹{getTotalPrice().toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 mb-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    onClick={() => navigate('/templates')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-colors border border-purple-300/30"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;