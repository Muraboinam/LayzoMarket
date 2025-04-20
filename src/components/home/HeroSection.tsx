import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Pencil } from 'lucide-react';
import { isAuthenticated } from '../../data/admin';

const HeroSection: React.FC = () => {
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('heroStats');
    return savedStats ? JSON.parse(savedStats) : {
      communityMembers: '17M+',
      digitalItems: '80K+',
      talentedAuthors: '100K+',
      itemsSold: '10M+'
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedStats, setEditedStats] = useState(stats);
  const isAdmin = isAuthenticated();

  const handleSave = () => {
    setStats(editedStats);
    localStorage.setItem('heroStats', JSON.stringify(editedStats));
    setIsEditing(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  };

  const statsItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.pexels.com/photos/38519/macbook-laptop-ipad-apple-38519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Hero background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            variants={titleVariants}
          >
            Find the Perfect Website Template for Your Next Project
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            Thousands of high-quality website templates, themes, and digital assets created by talented designers.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
          >
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/templates'}
              className="w-full sm:w-auto"
            >
              Browse All Templates
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white w-full sm:w-auto"
            >
              Sell Your Creations
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Stats */}
      <div className="container mx-auto mt-12 sm:mt-16 relative z-10">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {isEditing ? (
            <>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="text"
                  value={editedStats.communityMembers}
                  onChange={(e) => setEditedStats({...editedStats, communityMembers: e.target.value})}
                  className="text-xl sm:text-3xl font-bold text-white mb-1 bg-transparent border-b border-white/20 text-center w-full"
                />
                <p className="text-sm text-gray-300">Community Members</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="text"
                  value={editedStats.digitalItems}
                  onChange={(e) => setEditedStats({...editedStats, digitalItems: e.target.value})}
                  className="text-xl sm:text-3xl font-bold text-white mb-1 bg-transparent border-b border-white/20 text-center w-full"
                />
                <p className="text-sm text-gray-300">Digital Items</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="text"
                  value={editedStats.talentedAuthors}
                  onChange={(e) => setEditedStats({...editedStats, talentedAuthors: e.target.value})}
                  className="text-xl sm:text-3xl font-bold text-white mb-1 bg-transparent border-b border-white/20 text-center w-full"
                />
                <p className="text-sm text-gray-300">Talented Authors</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <input
                  type="text"
                  value={editedStats.itemsSold}
                  onChange={(e) => setEditedStats({...editedStats, itemsSold: e.target.value})}
                  className="text-xl sm:text-3xl font-bold text-white mb-1 bg-transparent border-b border-white/20 text-center w-full"
                />
                <p className="text-sm text-gray-300">Items Sold</p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3 
                  className="text-xl sm:text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {stats.communityMembers}
                </motion.h3>
                <p className="text-sm text-gray-300">Community Members</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3 
                  className="text-xl sm:text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {stats.digitalItems}
                </motion.h3>
                <p className="text-sm text-gray-300">Digital Items</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3 
                  className="text-xl sm:text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {stats.talentedAuthors}
                </motion.h3>
                <p className="text-sm text-gray-300">Talented Authors</p>
              </motion.div>
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center"
                variants={statsItemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3 
                  className="text-xl sm:text-3xl font-bold text-white mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {stats.itemsSold}
                </motion.h3>
                <p className="text-sm text-gray-300">Items Sold</p>
              </motion.div>
            </>
          )}
        </motion.div>

        {isAdmin && (
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {isEditing ? (
              <div className="space-x-4">
                <Button
                  variant="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedStats(stats);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                leftIcon={<Pencil size={16} />}
              >
                Edit Stats
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;