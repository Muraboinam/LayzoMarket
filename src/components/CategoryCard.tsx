import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Briefcase, Image, HeartPulse, Home, LayoutDashboard,
  Clock, MessageCircle, DollarSign, GraduationCap, Palette, BarChart,
  Headphones, PenTool, TrendingUp, Target, Share2
} from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  type: 'templates' | 'apps' | 'n8n-agents';
}

const iconMap = {
  'shopping-cart': ShoppingCart,
  'briefcase': Briefcase,
  'image': Image,
  'heart-pulse': HeartPulse,
  'home': Home,
  'layout-dashboard': LayoutDashboard,
  'clock': Clock,
  'message-circle': MessageCircle,
  'dollar-sign': DollarSign,
  'graduation-cap': GraduationCap,
  'palette': Palette,
  'bar-chart': BarChart,
  'headphones': Headphones,
  'pen-tool': PenTool,
  'trending-up': TrendingUp,
  'target': Target,
  'share-2': Share2
};

export default function CategoryCard({ category, type }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[category.icon as keyof typeof iconMap] || ShoppingCart;

  const handleCategoryClick = () => {
    switch (type) {
      case 'templates':
        navigate('/templates');
        break;
      case 'apps':
        navigate('/apps');
        break;
      case 'n8n-agents':
        navigate('/n8n');
        break;
    }
  };

  return (
    <div 
      onClick={handleCategoryClick}
      className="group relative bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] cursor-pointer hover-lift animate-fade-in"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center group-hover:from-yellow-500/40 group-hover:to-yellow-600/40 transition-all duration-500 hover-scale animate-float">
            <Icon className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 group-hover:from-yellow-400 group-hover:to-yellow-100 transition-all duration-500 animate-gradient">
              {category.name}
            </h3>
            <p className="text-yellow-100/60 text-sm">
              {category.count.toLocaleString()} {type === 'templates' ? 'templates' : type === 'apps' ? 'apps' : 'agents'}
            </p>
          </div>
        </div>
        
        <p className="text-yellow-100/70 text-sm leading-relaxed group-hover:text-yellow-100/90 transition-colors duration-300">
          {category.description}
        </p>
      </div>
    </div>
  );
}