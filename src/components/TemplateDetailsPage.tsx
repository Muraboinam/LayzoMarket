import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Download, Heart, Share2, ShoppingCart, FileText, Code, HelpCircle, RefreshCw, Shield } from 'lucide-react';
import { Product } from '../types';

interface TemplateDetailsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function TemplateDetailsPage({ product, onBack, onAddToCart }: TemplateDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'support'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  useEffect(() => {
    // Check if product is in wishlist
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    setIsWishlisted(wishlistItems.some((item: any) => item.id === product.id));
  }, [product.id]);

  const handleWishlistToggle = () => {
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

  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
        <p className="text-gray-300 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-gray-300">
            <Code className="w-5 h-5 text-blue-400" />
            <span>Source Files</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <FileText className="w-5 h-5 text-green-400" />
            <span>Design Files</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Documentation</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <Shield className="w-5 h-5 text-orange-400" />
            <span>Basic Support (30 days)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Category</h4>
            <p className="text-white capitalize">{product.category}</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-1">File Size</h4>
            <p className="text-white">{product.fileSize}</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Created</h4>
            <p className="text-white">{new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-gray-400 text-sm mb-1">Updated</h4>
            <p className="text-white">{new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.tags.map((tag, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300 capitalize">{tag.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Compatibility</h4>
        <div className="flex flex-wrap gap-2">
          {product.compatibility.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Reviews</h3>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-white font-semibold">{product.rating}</span>
          <span className="text-gray-400">({product.reviewCount} reviews)</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Mock reviews */}
        {[1, 2, 3].map((review) => (
          <div key={review} className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://images.pexels.com/photos/${220453 + review}/pexels-photo-${220453 + review}.jpeg`}
                  alt="Reviewer"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">User {review}</span>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-gray-300">
              Great template with clean code and excellent documentation. Easy to customize and implement.
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-white mb-4">Support & Documentation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Documentation</h4>
          </div>
          <p className="text-gray-300">Comprehensive setup and customization guide</p>
        </div>
        
        <div className="p-6 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <HelpCircle className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Basic Email Support</h4>
          </div>
          <p className="text-gray-300">30 days basic support included</p>
        </div>
        
        <div className="p-6 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <RefreshCw className="w-6 h-6 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Premium Updates</h4>
          </div>
          <p className="text-gray-300">Major updates require separate purchase</p>
        </div>
        
        <div className="p-6 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Extended Support Plans</h4>
          </div>
          <p className="text-gray-300">Premium support packages available for purchase</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Additional Services</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Extended Support (6 months)</span>
            <span className="text-yellow-400 font-semibold">₹2,399</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Premium Support (1 year)</span>
            <span className="text-yellow-400 font-semibold">₹4,099</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Major Version Updates</span>
            <span className="text-yellow-400 font-semibold">₹1,599 each</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Breadcrumb */}
      <div className="bg-black/20 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <button onClick={onBack} className="flex items-center space-x-2 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span>/</span>
            <span>Templates</span>
            <span>/</span>
            <span className="text-white">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
              {discountPercentage && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-purple-400' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white/10 rounded-lg p-1">
              <div className="flex space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: FileText },
                  { id: 'features', label: 'Features', icon: Star },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                  { id: 'support', label: 'Support', icon: HelpCircle }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                      activeTab === id
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/5 rounded-lg p-6">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'features' && renderFeaturesTab()}
              {activeTab === 'reviews' && renderReviewsTab()}
              {activeTab === 'support' && renderSupportTab()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {discountPercentage && (
                    <p className="text-green-400 text-sm">Save {discountPercentage}% - Limited time offer!</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  Buy Now
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </button>
                
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Template</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold">{product.rating}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Download className="w-5 h-5" />
                  <span>{product.downloads.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{product.reviewCount} reviews</p>
              <p className="text-gray-300 text-sm">downloads</p>
            </div>

            {/* Tags */}
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/20 text-gray-300 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}