import React from 'react';
import { FileCheck, Code, LifeBuoy, CheckCircle, Shield, Zap, Star, Heart, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useFirestoreSection } from '../hooks/useFirestoreSection';

// Icon mapping for dynamic icon rendering
const iconMap = {
  FileCheck,
  Code,
  LifeBuoy,
  CheckCircle,
  Shield,
  Zap,
  Star,
  Heart,
  Award,
  Users
};

const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  const { section: ctaSection, loading, error } = useFirestoreSection('cta-section');

  // Don't render if section is not active or doesn't exist
  if (!ctaSection || !ctaSection.isActive) {
    return null;
  }
  
  // Show loading state
  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
            <p className="text-blue-200">Loading call to action section...</p>
          </div>
        </div>
      </section>
    );
  }

  const features = ctaSection?.content?.features || [];
  const buttons = ctaSection?.content?.buttons || [];

  return (
    <section className="py-16 relative overflow-hidden bg-black">
      {/* Laser Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glowing Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-blue-900/20"></div>
      
      {/* Neon Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-pulse">
              {ctaSection?.title || 'Ready to Create Something Amazing?'}
            </h2>
            <p className="text-blue-400/90 text-lg mb-8">
              {ctaSection?.subtitle || 'Get started with our premium templates and build beautiful websites in minutes. We offer high-quality designs for all types of projects.'}
            </p>
            
            <div className="space-y-4">
              {features.map((feature: any, index: number) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || FileCheck;
                const colors = [
                  { bg: 'from-red-500/10 to-blue-500/10', border: 'border-red-500/20 group-hover:border-red-500/40', icon: 'text-red-400', title: 'from-red-400 to-purple-400' },
                  { bg: 'from-purple-500/10 to-blue-500/10', border: 'border-purple-500/20 group-hover:border-purple-500/40', icon: 'text-purple-400', title: 'from-purple-400 to-blue-400' },
                  { bg: 'from-blue-500/10 to-purple-500/10', border: 'border-blue-500/20 group-hover:border-blue-500/40', icon: 'text-blue-400', title: 'from-blue-400 to-purple-400' }
                ];
                const colorSet = colors[index % colors.length];
                
                return (
                  <div key={index} className="flex items-start group">
                    <div className={`mt-1 mr-4 bg-gradient-to-br ${colorSet.bg} p-2 rounded-full border ${colorSet.border} transition-colors duration-300`}>
                      <IconComponent size={20} className={colorSet.icon} />
                    </div>
                    <div>
                      <h4 className={`font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r ${colorSet.title}`}>
                        {feature.title}
                      </h4>
                      <p className="text-blue-300/80">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              {buttons.map((button: any, index: number) => {
                const isPrimary = button.variant === 'primary';
                const borderColor = index === 0 ? 'border-red-500/50 text-red-400' : 'border-blue-500/50 text-blue-400';
                const gradientColor = index === 0 ? 'from-red-600 to-purple-600' : 'from-blue-600 to-purple-600';
                
                return (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="lg"
                    className={`relative group overflow-hidden bg-transparent ${borderColor} hover:text-white transition-colors duration-300`}
                    onClick={() => navigate(button.link)}
                  >
                    <span className={`absolute inset-0 w-full h-full bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></span>
                    <span className="relative">{button.text}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end">
            <div className="relative">
              {/* Neon Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-lg blur-xl opacity-30"></div>
              <img 
                src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Theme preview" 
                className="relative rounded-lg shadow-2xl max-w-md transform rotate-2 border border-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;