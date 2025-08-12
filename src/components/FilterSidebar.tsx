import React from 'react';
import { Filter, X } from 'lucide-react';
import { Category } from '../types';
import CategoryFilter from './CategoryFilter';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  isOpen,
  onClose
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:block overflow-y-auto`}>
        <div className="p-6 space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Categories */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />

          {/* Price Range */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 200])}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => onPriceRangeChange([0, 4199])}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                >
                  Under ₹4,199
                </button>
                <button
                  onClick={() => onPriceRangeChange([4199, 8399])}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                >
                  ₹4,199 - ₹8,399
                </button>
                <button
                  onClick={() => onPriceRangeChange([8399, 25000])}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                >
                  ₹8,399 - ₹25,000
                </button>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}