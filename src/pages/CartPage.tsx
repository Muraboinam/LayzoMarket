import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { CartItem, getCart, removeFromCart, updateQuantity } from '../data/cart';
import { isUserAuthenticated } from '../data/auth';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleQuantityChange = (templateId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(templateId, newQuantity);
      setCartItems(getCart());
    }
  };

  const handleRemove = (templateId: string) => {
    removeFromCart(templateId);
    setCartItems(getCart());
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.template.salePrice || item.template.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    if (isUserAuthenticated()) {
      window.location.href = '/checkout';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md">
                  {cartItems.map((item) => (
                    <div
                      key={item.template.id}
                      className="p-6 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.template.image}
                          alt={item.template.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-6 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.template.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.template.category}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleQuantityChange(item.template.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                -
                              </button>
                              <span className="mx-2 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.template.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="text-lg font-medium text-gray-900 mr-4">
                                ₹{(item.template.salePrice || item.template.price) * item.quantity}
                              </span>
                              <Button
                                variant="error"
                                size="sm"
                                onClick={() => handleRemove(item.template.id)}
                                leftIcon={<Trash2 size={16} />}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes</span>
                      <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <span>Total</span>
                        <span>₹{(calculateTotal() * 1.18).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    className="mt-6"
                    leftIcon={<ShoppingCart size={20} />}
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some templates to your cart to get started
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/templates'}
              >
                Browse Templates
              </Button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;