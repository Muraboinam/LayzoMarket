import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Template } from '../../data/templates';
import { Link } from './Link';
import { addToCart } from '../../data/cart';
import { Toast } from './Toast';
import { addToWaitlist, removeFromWaitlist, isInWaitlist } from '../../data/waitlist';

interface ProductCardProps {
  template: Template;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ template, className = '' }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isWaitlisted, setIsWaitlisted] = useState(isInWaitlist(template.id));
  
  const { 
    id, 
    title, 
    price, 
    salePrice, 
    image, 
    category, 
    rating, 
    ratingsCount, 
    salesCount, 
    isNew,
    isFeatured,
  } = template;

  const handleAddToCart = () => {
    addToCart(template);
    setToastMessage('Item added to cart successfully!');
    setShowToast(true);
  };

  const handleWaitlistToggle = () => {
    if (isWaitlisted) {
      removeFromWaitlist(template.id);
      setToastMessage('Removed from waitlist');
    } else {
      addToWaitlist(template);
      setToastMessage('Added to waitlist');
    }
    setIsWaitlisted(!isWaitlisted);
    setShowToast(true);
  };

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Image container with badges and overlay */}
      <div className="relative overflow-hidden group">
        <Link href={`/template/${id}`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isNew && (
            <Badge variant="info">New</Badge>
          )}
          {isFeatured && (
            <Badge variant="warning">Featured</Badge>
          )}
          {salePrice && (
            <Badge variant="error">Sale</Badge>
          )}
        </div>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <button 
              className={`p-2 rounded-full ${isWaitlisted ? 'bg-primary text-white' : 'bg-white text-gray-800'} hover:scale-110 transition-transform`}
              aria-label="Add to wishlist"
              onClick={handleWaitlistToggle}
            >
              <Heart size={20} className={isWaitlisted ? 'fill-current' : ''} />
            </button>
            <button 
              className="p-2 bg-white rounded-full text-gray-800 hover:text-primary hover:scale-110 transition-transform"
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link 
            href={`/category/${category.toLowerCase()}`}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            {category}
          </Link>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-700 ml-1">{rating}</span>
            <span className="text-xs text-gray-500 ml-1">({ratingsCount})</span>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mb-4 line-clamp-1 hover:text-primary transition-colors">
          <Link href={`/template/${id}`}>
            {title}
          </Link>
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            {salePrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900">₹{salePrice}</span>
                <span className="text-sm text-gray-500 line-through ml-2">₹{price}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{price}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{salesCount} sales</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 pb-4">
        <Button
          variant="primary"
          fullWidth
          leftIcon={<ShoppingCart size={16} />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      {/* Success Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};