import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage: React.FC = () => {
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
              Privacy Policy
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
                    <Shield className="w-6 h-6 mr-2 text-green-400" />
                    Your Privacy Protection
                  </h2>
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6 mb-4">
                    <p className="text-green-200 mb-4">
                      <strong>Privacy Protection Promise:</strong> We protect your personal information with industry-standard security measures. Your data security is our priority.
                    </p>
                    <ul className="list-disc list-inside text-green-200 space-y-2">
                      <li>No personal data sold to third parties</li>
                      <li>Secure payment processing</li>
                      <li>Full data deletion available upon request</li>
                      <li>Transparent data usage policies</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Eye className="w-6 h-6 mr-2 text-blue-400" />
                    Information We Collect
                  </h2>
                  <p className="text-purple-200 mb-4">
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>Account information (name, email, password)</li>
                    <li>Payment information (processed securely by Razorpay)</li>
                    <li>Purchase history and download records</li>
                    <li>Support communications and feedback</li>
                    <li>Website usage analytics (anonymized)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                  <p className="text-purple-200 mb-4">
                    We use the information we collect to provide, maintain, and improve our services and digital products.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>Process transactions and deliver digital products</li>
                    <li>Provide customer support</li>
                    <li>Send important updates about your purchases</li>
                    <li>Improve our website and product offerings</li>
                    <li>Prevent fraud and ensure platform security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-purple-400" />
                    Data Security
                  </h2>
                  <p className="text-purple-200 mb-4">
                    We implement industry-standard security measures to protect your personal information and financial data.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure payment processing through Razorpay</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Secure backup and recovery systems</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-purple-200">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 mt-4">
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

export default PrivacyPolicyPage;