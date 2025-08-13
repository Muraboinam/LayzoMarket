import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Edit3, Save, X, Camera, Shield, Bell, CreditCard } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updateProfile } from 'firebase/auth';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName: editForm.displayName
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-purple-200 mb-6">Please sign in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      <Header cartCount={0} onSearchChange={() => {}} profitableUrl="" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-300/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              My Profile
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-purple-300 mb-4">{user.email}</p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-200 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/orders')}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>View Orders</span>
                    </button>
                    
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 py-2 rounded-lg transition-colors border border-red-500/30"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 px-3 py-2 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex items-center space-x-2 text-green-300 hover:text-green-200 transition-colors bg-green-600/20 px-3 py-2 rounded-lg disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            displayName: user?.displayName || '',
                            email: user?.email || ''
                          });
                        }}
                        className="flex items-center space-x-2 text-red-300 hover:text-red-200 transition-colors bg-red-600/20 px-3 py-2 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.displayName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter your display name"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                          <User className="w-5 h-5 text-purple-400" />
                          <span className="text-white">{user.displayName || 'Not set'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Email Address</label>
                      <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Account Created</label>
                      <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span className="text-white">
                          {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Last Sign In</label>
                      <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <span className="text-white">
                          {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;