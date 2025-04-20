import React from 'react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { getTemplates } from '../../data/templates';
import { Link } from '../ui/Link';
import { Button } from '../ui/Button';
import { isAuthenticated } from '../../data/admin';

const FeaturedTemplatesSection: React.FC = () => {
  // Get featured templates from localStorage
  const templates = getTemplates();
  const featuredTemplates = templates.filter(template => template.isFeatured).slice(0, 4);
  const isAdmin = isAuthenticated();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Templates</h2>
            <p className="text-gray-600 mt-2">
              Handpicked premium templates for your projects
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <Button
                variant="primary"
                onClick={() => window.location.href = '/admin/dashboard'}
                leftIcon={<LayoutDashboard size={18} />}
              >
                Admin Dashboard
              </Button>
            )}
            <Link 
              href="/templates" 
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              View all templates
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map(template => (
            <ProductCard key={template.id} template={template} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => window.location.href = '/admin/dashboard'}
              leftIcon={<LayoutDashboard size={18} />}
              className="mb-4"
            >
              Admin Dashboard
            </Button>
          )}
          <Link 
            href="/templates" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all templates
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTemplatesSection;