import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Calendar, Code, Briefcase, X } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { getCurrentUser, isUserAuthenticated } from '../data/auth';
import { User as UserType } from '../types/user';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isUserAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setNewPhoneNumber(currentUser.phone || '');
    }
  }, []);

  const handleUpdatePhone = () => {
    if (!user) return;

    // Get all users
    const users: UserType[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update the current user's phone number
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, phone: newPhoneNumber };
      }
      return u;
    });

    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update local state
    setUser({ ...user, phone: newPhoneNumber });
    setIsEditingPhone(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#1a1c3b] to-black">
      {/* Futuristic City Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover opacity-30"
        >
          <source src="https://cdn.pixabay.com/vimeo/328428416/night-23378.mp4?width=1280&hash=f4c32d42e06c0c7cdf8ef7680c85495add12c54e" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
        
        {/* Animated Overlay Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent blur-xl" />
      </div>

      <Header />

      <main className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_0_15px_rgba(0,255,255,0.1)] mb-8"
          >
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                <User size={48} className="text-white" />
              </motion.div>
              <div className="ml-8">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                >
                  {user.fullName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-400 mt-1"
                >
                  {user.email}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Mail className="mr-2 text-cyan-400" size={20} />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 transition-colors group-hover:text-cyan-400">
                    Email Address
                  </label>
                  <p className="text-white bg-white/5 rounded-lg p-3 transition-colors group-hover:bg-white/10">
                    {user.email}
                  </p>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 transition-colors group-hover:text-cyan-400">
                    Phone Number
                  </label>
                  {isEditingPhone ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        value={newPhoneNumber}
                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                      <Button
                        variant="primary"
                        onClick={handleUpdatePhone}
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditingPhone(false);
                          setNewPhoneNumber(user.phone || '');
                        }}
                        leftIcon={<X size={16} />}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 transition-colors group-hover:bg-white/10">
                      <span className="text-white">{user.phone || 'Not set'}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditingPhone(true)}
                        className="ml-2"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                  {showSuccess && (
                    <p className="text-green-400 text-sm mt-2">Phone number updated successfully!</p>
                  )}
                </div>

                {user.company && (
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-400 mb-1 transition-colors group-hover:text-cyan-400">
                      Company
                    </label>
                    <p className="text-white bg-white/5 rounded-lg p-3 transition-colors group-hover:bg-white/10">
                      {user.company}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <User className="mr-2 text-cyan-400" size={20} />
                Account Details
              </h2>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 transition-colors group-hover:text-cyan-400">
                    Member Since
                  </label>
                  <p className="text-white bg-white/5 rounded-lg p-3 transition-colors group-hover:bg-white/10">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 transition-colors group-hover:text-cyan-400">
                    Account Status
                  </label>
                  <p className="text-white bg-white/5 rounded-lg p-3 transition-colors group-hover:bg-white/10 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Active
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <Button
              variant="primary"
              onClick={() => window.location.href = '/templates'}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300"
            >
              Browse Templates
            </Button>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;