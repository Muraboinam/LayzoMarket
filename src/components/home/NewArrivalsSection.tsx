import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { getTemplates } from '../../data/templates';
import { Link } from '../ui/Link';

const NewArrivalsSection: React.FC = () => {
  // Get new templates from localStorage
  const templates = getTemplates();
  const newTemplates = templates.filter(template => template.isNew).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-600 mt-2">
              Fresh templates and themes added recently
            </p>
          </div>
          
          <Link 
            href="/templates/new" 
            className="hidden md:flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all new items
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newTemplates.map(template => (
            <ProductCard key={template.id} template={template} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            href="/templates/new" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View all new items
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;