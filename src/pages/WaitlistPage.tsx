import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { WaitlistItem, getWaitlist, removeFromWaitlist } from '../data/waitlist';
import { addToCart } from '../data/cart';
import { Toast } from '../components/ui/Toast';

const WaitlistPage: React.FC = () => {
  const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setWaitlistItems(getWaitlist());
  }, []);

  const handleRemove = (templateId: string) => {
    removeFromWaitlist(templateId);
    setWaitlistItems(getWaitlist());
  };

  const handleAddToCart = (item: WaitlistItem) => {
    addToCart(item.template);
    removeFromWaitlist(item.template.id);
    setWaitlistItems(getWaitlist());
    setToastMessage('Item added to cart!');
    setShowToast(true);
  };

  const handleAddAllToCart = () => {
    waitlistItems.forEach(item => {
      addToCart(item.template);
      removeFromWaitlist(item.template.id);
    });
    setWaitlistItems([]);
    setToastMessage('All items added to cart!');
    setShowToast(true);
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Waitlist</h1>
            {waitlistItems.length > 0 && (
              <Button
                variant="primary"
                onClick={handleAddAllToCart}
                leftIcon={<ShoppingCart size={20} />}
              >
                Add All to Cart
              </Button>
            )}
          </div>

          {waitlistItems.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md">
              {waitlistItems.map((item) => (
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
                        <span className="text-sm text-gray-500">
                          Added on {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-medium text-gray-900">
                            ₹{item.template.salePrice || item.template.price}
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            leftIcon={<ShoppingCart size={16} />}
                          >
                            Add to Cart
                          </Button>
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
          ) : (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Your waitlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add templates to your waitlist to track them
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
      
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default WaitlistPage;