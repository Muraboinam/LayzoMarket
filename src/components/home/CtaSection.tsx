import React from 'react';
import { FileCheck, Code, LifeBuoy } from 'lucide-react';
import { Button } from '../ui/Button';

const CtaSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Something Amazing?</h2>
            <p className="text-white/90 text-lg mb-8">
              Get started with our premium templates and build beautiful websites in minutes. We offer high-quality designs for all types of projects.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-white/20 p-2 rounded-full">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Quality Guaranteed</h4>
                  <p className="text-white/80">All items are reviewed by our quality team before listing</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-white/20 p-2 rounded-full">
                  <Code size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Clean Code</h4>
                  <p className="text-white/80">Well structured, commented code that's easy to customize</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-4 bg-white/20 p-2 rounded-full">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-lg">6 Months Support</h4>
                  <p className="text-white/80">Get help from the template author for 6 months</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white text-primary border-white hover:bg-white/90"
              >
                Browse Templates
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white hover:bg-white/10"
              >
                Become an Author
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <img 
              src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Theme preview" 
              className="rounded-lg shadow-2xl max-w-md transform rotate-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;