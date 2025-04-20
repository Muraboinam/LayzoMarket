import React from 'react';
import { Parallax } from 'react-parallax';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const ParallaxSection: React.FC = () => {
  return (
    <Parallax
      blur={0}
      bgImage="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      bgImageAlt="Parallax Background"
      strength={200}
    >
      <section className="min-h-[600px] flex items-center relative">
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Create Stunning Animated Websites
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-200 mb-8"
            >
              Our templates come with beautiful animations and parallax effects that will bring your website to life
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                View Animated Templates
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Parallax>
  );
};

export default ParallaxSection;