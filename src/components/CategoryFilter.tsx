import React from 'react';
import { Globe, Smartphone, Zap, ShoppingCart, Monitor, Palette, Code, Database, Users, Settings } from 'lucide-react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const iconMap = {
  Globe,
  Smartphone,
  Zap,
  ShoppingCart,
  Monitor,
  Palette,
  Code,
  Database,
  Users,
  Settings
};

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Templates</span>
            <span className="text-sm text-gray-500">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </div>
        </button>

        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] || Globe;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-gray-500">{category.count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}