import React from 'react';
import { Star, Download, Eye, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onPreview: (product: Product) => void;
  onTemplateClick?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onPreview, onTemplateClick }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    // Check if product is in wishlist
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    setIsWishlisted(wishlistItems.some((item: any) => item.id === product.id));
  }, [product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    let updatedWishlist;
    
    if (isWishlisted) {
      updatedWishlist = wishlistItems.filter((item: any) => item.id !== product.id);
      console.log('Removed from wishlist:', product.title);
    } else {
      updatedWishlist = [...wishlistItems, product];
      console.log('Added to wishlist:', product.title);
    }
    
    localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
    
    // Dispatch event to update wishlist count in header
    window.dispatchEvent(new CustomEvent('wishlistUpdate', { 
      detail: { 
        action: isWishlisted ? 'remove' : 'add',
        product: product 
      }
    }));
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer hover-lift animate-fade-in"
      onClick={() => onTemplateClick?.(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce-in shadow-lg">
            Featured
          </div>
        )}
        {discountPercentage && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce-in shadow-lg">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 ${discountPercentage ? 'right-20' : 'right-3'} w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(product);
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center space-x-2 hover-scale shadow-xl"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors duration-300">
            {product.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium hover-scale transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-float" />
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Download className="w-4 h-4" />
              <span className="text-sm">{product.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>


        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1 flex-1 mr-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 hover-scale shadow-lg hover:shadow-xl text-sm whitespace-nowrap min-w-[140px] flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}