import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedTemplatesSection from '../components/home/FeaturedTemplatesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import NewArrivalsSection from '../components/home/NewArrivalsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';
import LuxurySection from '../components/home/LuxurySection';
import ParallaxSection from '../components/home/ParallaxSection';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LuxurySection />
        <FeaturedTemplatesSection />
        <ParallaxSection />
        <CategoriesSection />
        <NewArrivalsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;