import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, DollarSign, Settings } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiePolicyPage: React.FC = () => {
  const navigate = useNavigate();

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
              Cookie Policy
            </h1>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-8 shadow-lg">
            <div className="prose prose-invert max-w-none">
              <p className="text-purple-200 mb-6">
                <strong>Last updated:</strong> January 2025
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Cookie className="w-6 h-6 mr-2 text-orange-400" />
                    What Are Cookies?
                  </h2>
                  <p className="text-purple-200 mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and remember your preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Settings className="w-6 h-6 mr-2 text-blue-400" />
                    Types of Cookies We Use
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                      <h4 className="text-blue-300 font-semibold mb-2">Essential Cookies</h4>
                      <p className="text-blue-200 text-sm">Required for basic website functionality and cart management</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                      <h4 className="text-purple-300 font-semibold mb-2">Performance Cookies</h4>
                      <p className="text-purple-200 text-sm">Help us understand how visitors interact with our templates</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                      <h4 className="text-yellow-300 font-semibold mb-2">Functional Cookies</h4>
                      <p className="text-yellow-200 text-sm">Remember your preferences for personalized experience</p>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4">
                      <h4 className="text-pink-300 font-semibold mb-2">Analytics Cookies</h4>
                      <p className="text-pink-200 text-sm">Help us improve our website and product offerings based on user behavior</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
                  <p className="text-purple-200 mb-4">
                    You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-semibold mb-2">Browser Settings</h4>
                    <p className="text-purple-200 text-sm">Most browsers allow you to view, manage, and delete cookies through their settings.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Impact on Services</h4>
                    <p className="text-purple-200 text-sm">Disabling cookies may affect cart functionality and user preferences.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
                  <p className="text-purple-200 mb-4">
                    We use trusted third-party services that may set cookies to help us provide better service.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>Razorpay for secure payment processing</li>
                    <li>Google Analytics for website performance (anonymized)</li>
                    <li>Firebase for user authentication and data storage</li>
                    <li>Support system cookies for customer service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-green-400" />
                    Your Rights & Data Protection
                  </h2>
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6">
                    <p className="text-green-200 mb-4">
                      <strong>Data Protection Rights:</strong> You have full control over your personal data and privacy settings.
                    </p>
                    <ul className="list-disc list-inside text-green-200 space-y-2">
                      <li>Right to access your personal data and purchase history</li>
                      <li>Right to request data deletion</li>
                      <li>Right to opt-out of non-essential cookies</li>
                      <li>Right to data portability</li>
                      <li>Right to customer support</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-purple-200 mb-4">
                    For questions about our cookie policy:
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white">Email: layzomarket@gmail.com</p>
                    <p className="text-white">Support: layzohelpdesk@gmail.com</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicyPage;