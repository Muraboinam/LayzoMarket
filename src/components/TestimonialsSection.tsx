import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { useFirestoreSection } from '../hooks/useFirestoreSection';

const TestimonialsSection: React.FC = () => {
  const { section: testimonialsSection, loading, error } = useFirestoreSection('testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (testimonialsSection && testimonialsSection.content && testimonialsSection.content.testimonials) {
      setTestimonials(testimonialsSection.content.testimonials);
    }
    
    if (error) {
      console.error('Error loading testimonials data:', error);
    }
  }, [testimonialsSection, error]);

  // Don't render if section is not active or doesn't exist
  if (!testimonialsSection || !testimonialsSection.isActive) {
    return null;
  }
  
  // Show loading state
  if (loading) {
    return (
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-purple-200">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(66,8,132,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(66,8,132,0.2)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glowing Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-cyan-900/20"></div>
      
      {/* Neon Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 animate-pulse">
            {testimonialsSection?.title || 'What Our Customers Say'}
          </h2>
          <p className="text-cyan-400/80 max-w-2xl mx-auto">
            {testimonialsSection?.subtitle || "Don't take our word for it. Here's what customers think about the quality of our templates and themes."}
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-purple-300 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No testimonials available</h3>
            <p className="text-purple-300">Testimonials will appear here once they are added to Firestore.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="relative group"
              >
                {/* Card Background with Neon Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-lg opacity-50 group-hover:opacity-70 blur transition-opacity duration-300"></div>
                
                <div className="relative bg-black/80 backdrop-blur-xl p-6 rounded-lg border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.2)] transition-transform duration-300 hover:-translate-y-2">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-2xl ${i < testimonial.rating ? 'text-cyan-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <blockquote className="text-purple-300 mb-6 text-center italic relative">
                    <span className="absolute top-0 left-0 text-4xl text-purple-500/20">❝</span>
                    <span className="absolute bottom-0 right-0 text-4xl text-purple-500/20">❞</span>
                    <p className="px-4">"{testimonial.quote}"</p>
                  </blockquote>
                  
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-sm"></div>
                      <img 
                        src={testimonial.author.avatar} 
                        alt={testimonial.author.name}
                        className="relative w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-500/50"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        {testimonial.author.name}
                      </h4>
                      <p className="text-sm text-purple-400/60">{testimonial.author.role}</p>
                    </div>
                  </div>

                  {/* Animated Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;