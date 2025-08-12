import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  CreditCard, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Mail,
  Lock
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePassword, updateEmail, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'billing' | 'downloads' | 'privacy'>('security');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Security settings
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: ''
  });

  const handlePasswordUpdate = async () => {
    if (!user) return;
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Reauthenticate user before updating password
      const credential = EmailAuthProvider.credential(user.email!, passwordForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordForm.newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      // Reauthenticate user before updating email
      const credential = EmailAuthProvider.credential(user.email!, emailForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, emailForm.newEmail);
      
      setMessage({ type: 'success', text: 'Email updated successfully!' });
      setEmailForm({ newEmail: '', currentPassword: '' });
    } catch (error: any) {
      console.error('Email update error:', error);
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and you will lose access to all your purchases.'
    );
    
    if (!confirmed) return;

    const password = window.prompt('Please enter your current password to confirm account deletion:');
    if (!password) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Reauthenticate user before deleting account
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user account
      await deleteUser(user);
      
      alert('Your account has been deleted successfully.');
      navigate('/');
    } catch (error: any) {
      console.error('Account deletion error:', error);
      setMessage({ type: 'error', text: getErrorMessage(error.code) });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Current password is incorrect';
      case 'auth/weak-password':
        return 'New password is too weak';
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/requires-recent-login':
        return 'Please sign out and sign in again before making this change';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Lock className="w-5 h-5" />
          <span>Change Password</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </div>

      {/* Change Email */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Change Email Address</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Current Email</label>
            <div className="p-3 bg-white/5 rounded-lg text-purple-300">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">New Email Address</label>
            <input
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter new email address"
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={emailForm.currentPassword}
              onChange={(e) => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter current password"
            />
          </div>

          <button
            onClick={handleEmailUpdate}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Updating...' : 'Update Email'}</span>
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone</span>
        </h3>
        
        <div className="space-y-4">
          <p className="text-red-200 text-sm">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-purple-200 mb-6">Please sign in to access settings.</p>
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
        <div className="max-w-6xl mx-auto px-4">
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
              Account Settings
            </h1>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                : 'bg-red-500/10 border-red-400/30 text-red-300'
            }`}>
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-4 shadow-lg">
                <nav className="space-y-2">
                  {[
                    { id: 'security', label: 'Security', icon: Shield }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === id
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                {activeTab === 'security' && renderSecurityTab()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;