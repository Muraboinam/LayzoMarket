import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Upload, TestTube, Trash2, RefreshCw } from 'lucide-react';
import { 
  uploadHomepageSections, 
  getHomepageSections, 
  testHomepageCollection,
  clearHomepageCollection,
  HomepageSection 
} from '../utils/homepageFirestore';

const HomepageManager: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const homepageSections = await getHomepageSections();
      setSections(homepageSections);
    } catch (err) {
      setError('Failed to load homepage sections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (isUploading) return;
    
    setIsUploading(true);
    setError(null);
    try {
      await uploadHomepageSections();
      await loadSections(); // Reload sections after upload
      alert('Homepage sections uploaded successfully!');
    } catch (err) {
      setError('Failed to upload homepage sections');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTest = async () => {
    if (isTesting) return;
    
    setIsTesting(true);
    setError(null);
    try {
      const result = await testHomepageCollection();
      if (result.success) {
        alert(`Test successful! Found ${result.sections.length} homepage sections:\n\n${result.sections.map(s => `- ${s.name} (Order: ${s.order}, Active: ${s.isActive})`).join('\n')}`);
        setSections(result.sections);
      } else {
        setError(`Test failed: ${result.error}`);
      }
    } catch (err) {
      setError('Test failed');
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = async () => {
    if (isClearing) return;
    
    const confirmed = window.confirm('Are you sure you want to clear all homepage sections? This action cannot be undone.');
    if (!confirmed) return;
    
    setIsClearing(true);
    setError(null);
    try {
      await clearHomepageCollection();
      setSections([]);
      alert('Homepage collection cleared successfully!');
    } catch (err) {
      setError('Failed to clear homepage collection');
      console.error(err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">Homepage Manager</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Sections'}</span>
                </button>
                <button
                  onClick={handleTest}
                  disabled={isTesting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <TestTube className={`w-4 h-4 ${isTesting ? 'animate-pulse' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Collection'}</span>
                </button>
                <button
                  onClick={loadSections}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleClear}
                  disabled={isClearing}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Trash2 className={`w-4 h-4 ${isClearing ? 'animate-pulse' : ''}`} />
                  <span>{isClearing ? 'Clearing...' : 'Clear All'}</span>
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-white">Loading homepage sections...</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No sections found</h3>
                <p className="text-purple-200 mb-6">Upload the homepage sections to get started.</p>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Upload className={`w-5 h-5 ${isUploading ? 'animate-pulse' : ''}`} />
                  <span>{isUploading ? 'Uploading...' : 'Upload Homepage Sections'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Found {sections.length} Homepage Sections
                  </h2>
                  <p className="text-purple-200">
                    These sections are stored in Firebase Firestore and can be accessed by all users.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sections.map((section) => (
                    <div key={section.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${section.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <span className="text-sm text-purple-300">Order: {section.order}</span>
                        </div>
                        {section.isActive ? (
                          <Eye className="w-5 h-5 text-green-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{section.name}</h3>
                      <p className="text-white/90 font-medium mb-2">{section.title}</p>
                      {section.subtitle && (
                        <p className="text-purple-200 text-sm mb-3 line-clamp-2">{section.subtitle}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-purple-300">
                        <span>ID: {section.id}</span>
                        <span>{section.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                      
                      <div className="mt-3 text-xs text-purple-400">
                        Updated: {new Date(section.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageManager;