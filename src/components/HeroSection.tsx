import React, { useState, useEffect } from 'react';
import { SiteStats } from '../types';
import { useFirestoreSection } from '../hooks/useFirestoreSection';
import Button from './Button';

const HeroSection: React.FC = () => {
  const { section: heroSection, loading, error } = useFirestoreSection('hero');
  const [stats, setStats] = useState<SiteStats>({
    communityMembers: 17000000,
    digitalItems: 80000,
    talentedAuthors: 100000,
    itemsSold: 10000000
  });
  const [heroVideo, setHeroVideo] = useState<string | null>('https://files.catbox.moe/moi8t3.mp4');
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (heroSection && heroSection.content) {
      // Update stats from Firestore
      if (heroSection.content.stats) {
        setStats(heroSection.content.stats);
      }
      
      // Update video URL from Firestore if available
      if (heroSection.content.videoUrl) {
        setHeroVideo(heroSection.content.videoUrl);
      }
    } else if (error) {
      console.error('Error loading hero section data:', error);
      // Keep default values if Firestore fails
    }
  }, [heroSection, error]);


  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString() + '+';
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Video Background */}
      {heroVideo && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            key={heroVideo}
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoad}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-60' : 'opacity-0'
            }`}
            style={{ willChange: 'transform' }}
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Reduced opacity overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05),transparent_70%)]"></div>
        </div>
      )}
      
     <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight fade-in bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
               {heroSection?.title}
          </h1>

           <p className="text-yellow-100/80 text-xl mb-8 fade-in">
            {heroSection?.subtitle}
          </p>

          
          <div className="flex flex-wrap justify-center gap-4 fade-in">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/templates'}
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black transition-colors duration-200"
            >
              Browse All Templates
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="relative group animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/20 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] hover-lift">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 mb-1 animate-float">
                {formatNumber(stats.communityMembers)}
              </h3>
              <p className="text-yellow-100/60">Community Members</p>
            </div>
          </div>

          <div className="relative group animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/20 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] hover-lift">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 mb-1 animate-float" style={{ animationDelay: '0.5s' }}>
                {formatNumber(stats.digitalItems)}
              </h3>
              <p className="text-yellow-100/60">Digital Items</p>
            </div>
          </div>

          <div className="relative group animate-slide-in-up" style={{ animationDelay: '1s' }}>
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/20 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] hover-lift">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 mb-1 animate-float" style={{ animationDelay: '1s' }}>
                {formatNumber(stats.talentedAuthors)}
              </h3>
              <p className="text-yellow-100/60">Talented Authors</p>
            </div>
          </div>

          <div className="relative group animate-slide-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/20 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(234,179,8,0.3)] hover-lift">
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 mb-1 animate-float" style={{ animationDelay: '1.5s' }}>
                {formatNumber(stats.itemsSold)}
              </h3>
              <p className="text-yellow-100/60">Items Sold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;