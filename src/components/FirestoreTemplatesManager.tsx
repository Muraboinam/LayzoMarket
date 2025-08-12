import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Search, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  testTemplatesConnection,
  getAllTemplates,
  getAppTemplates,
  getFeaturedAppTemplates,
  getWebsiteTemplates,
  getFeaturedWebsiteTemplates,
  getComboTemplates,
  getFeaturedComboTemplates,
  getN8nWorkflowTemplates,
  getFeaturedN8nWorkflowTemplates
} from '../utils/firestoreTemplates';
import { Product } from '../types';

const FirestoreTemplatesManager: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    totalTemplates: number;
    appTemplates: number;
    websiteTemplates: number;
    comboTemplates: number;
    n8nWorkflowTemplates: number;
    error?: string;
  } | null>(null);
  const [templates, setTemplates] = useState<Product[]>([]);
  const [appTemplates, setAppTemplates] = useState<Product[]>([]);
  const [websiteTemplates, setWebsiteTemplates] = useState<Product[]>([]);
  const [comboTemplates, setComboTemplates] = useState<Product[]>([]);
  const [n8nWorkflowTemplates, setN8nWorkflowTemplates] = useState<Product[]>([]);
  const [featuredAppTemplates, setFeaturedAppTemplates] = useState<Product[]>([]);
  const [featuredWebsiteTemplates, setFeaturedWebsiteTemplates] = useState<Product[]>([]);
  const [featuredComboTemplates, setFeaturedComboTemplates] = useState<Product[]>([]);
  const [featuredN8nWorkflowTemplates, setFeaturedN8nWorkflowTemplates] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'connection' | 'all' | 'apps' | 'websites' | 'combos' | 'n8n-workflows' | 'featured-apps' | 'featured-websites' | 'featured-combos' | 'featured-n8n'>('connection');

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await testTemplatesConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        totalTemplates: 0,
        appTemplates: 0,
        websiteTemplates: 0,
        comboTemplates: 0,
        n8nWorkflowTemplates: 0,
        error: 'Connection test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching all templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppTemplates = async () => {
    setLoading(true);
    try {
      const data = await getAppTemplates();
      setAppTemplates(data);
    } catch (error) {
      console.error('Error fetching app templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWebsiteTemplates = async () => {
    setLoading(true);
    try {
      const data = await getWebsiteTemplates();
      setWebsiteTemplates(data);
    } catch (error) {
      console.error('Error fetching website templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedAppTemplates = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedAppTemplates(8);
      setFeaturedAppTemplates(data);
    } catch (error) {
      console.error('Error fetching featured app templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedWebsiteTemplates = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedWebsiteTemplates(8);
      setFeaturedWebsiteTemplates(data);
    } catch (error) {
      console.error('Error fetching featured website templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComboTemplates = async () => {
    setLoading(true);
    try {
      const data = await getComboTemplates();
      setComboTemplates(data);
    } catch (error) {
      console.error('Error fetching combo templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedComboTemplates = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedComboTemplates(8);
      setFeaturedComboTemplates(data);
    } catch (error) {
      console.error('Error fetching featured combo templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const renderConnectionTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Firestore Templates Connection</h3>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
        >
          <TestTube className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          <span>{loading ? 'Testing...' : 'Test Connection'}</span>
        </button>
      </div>

      {connectionStatus && (
        <div className={`p-6 rounded-lg border ${
          connectionStatus.success 
            ? 'bg-green-500/10 border-green-400/30' 
            : 'bg-red-500/10 border-red-400/30'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {connectionStatus.success ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
            <h4 className={`text-lg font-semibold ${
              connectionStatus.success ? 'text-green-300' : 'text-red-300'
            }`}>
              {connectionStatus.success ? 'Connection Successful' : 'Connection Failed'}
            </h4>
          </div>

          {connectionStatus.success ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{connectionStatus.totalTemplates}</div>
                <div className="text-green-300">Total Templates</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{connectionStatus.appTemplates}</div>
                <div className="text-green-300">App Templates</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{connectionStatus.websiteTemplates}</div>
                <div className="text-green-300">Website Templates</div>
              </div>
            </div>
          ) : (
            <div className="text-red-300">
              <p>Error: {connectionStatus.error}</p>
              <p className="text-sm mt-2">
                Make sure your Firestore database has the correct structure:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Collection: "templates"</li>
                <li>Subcollection: "templates/app/items"</li>
                <li>Subcollection: "templates/website/items"</li>
                <li>Subcollection: "templates/combo/items"</li>
                <li>Subcollection: "templates/n8n-workflow/items"</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTemplatesList = (templatesList: Product[], title: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-purple-300">{templatesList.length} templates</span>
      </div>

      {templatesList.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg">
          <Database className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
          <p className="text-purple-300">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templatesList.map((template) => (
            <div key={template.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-300/20">
              <div className="flex items-start space-x-3">
                <img
                  src={template.images[0] || 'https://via.placeholder.com/60x60'}
                  alt={template.title}
                  className="w-15 h-15 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium line-clamp-2 mb-1">{template.title}</h4>
                  <p className="text-purple-300 text-sm line-clamp-2 mb-2">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">₹{template.price.toLocaleString('en-IN')}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-purple-300">{template.downloads} downloads</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{connectionStatus.comboTemplates}</div>
                  <div className="text-green-300">Combo Templates</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-white">{connectionStatus.n8nWorkflowTemplates}</div>
                  <div className="text-green-300">n8n Workflow Templates</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Firestore Templates Manager</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex space-x-4">
              {[
                { id: 'connection', label: 'Connection Test', action: testConnection },
                { id: 'all', label: 'All Templates', action: fetchAllTemplates },
                { id: 'apps', label: 'App Templates', action: fetchAppTemplates },
                { id: 'websites', label: 'Website Templates', action: fetchWebsiteTemplates },
                { id: 'combos', label: 'Combo Templates', action: fetchComboTemplates },
                { id: 'featured-apps', label: 'Featured Apps', action: fetchFeaturedAppTemplates },
                { id: 'featured-websites', label: 'Featured Websites', action: fetchFeaturedWebsiteTemplates },
                { id: 'featured-combos', label: 'Featured Combos', action: fetchFeaturedComboTemplates }
              ].map(({ id, label, action }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id as any);
                    if (id !== 'connection') action();
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-purple-300">Loading...</p>
              </div>
            )}

            {!loading && (
              <>
                {activeTab === 'connection' && renderConnectionTab()}
                {activeTab === 'all' && renderTemplatesList(templates, 'All Templates')}
                {activeTab === 'apps' && renderTemplatesList(appTemplates, 'App Templates')}
                {activeTab === 'websites' && renderTemplatesList(websiteTemplates, 'Website Templates')}
                {activeTab === 'combos' && renderTemplatesList(comboTemplates, 'Combo Templates')}
                {activeTab === 'n8n-workflows' && renderTemplatesList(n8nWorkflowTemplates, 'n8n Workflow Templates')}
                {activeTab === 'featured-apps' && renderTemplatesList(featuredAppTemplates, 'Featured App Templates')}
                {activeTab === 'featured-websites' && renderTemplatesList(featuredWebsiteTemplates, 'Featured Website Templates')}
                {activeTab === 'featured-combos' && renderTemplatesList(featuredComboTemplates, 'Featured Combo Templates')}
                {activeTab === 'featured-n8n' && renderTemplatesList(featuredN8nWorkflowTemplates, 'Featured n8n Workflow Templates')}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreTemplatesManager;