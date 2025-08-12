import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, DollarSign, Clock, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfServicePage: React.FC = () => {
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
              Terms of Service
            </h1>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-8 shadow-lg">
            <div className="prose prose-invert max-w-none">
              <p className="text-purple-200 mb-6">
                <strong>Last updated:</strong> January 2025
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                  <p className="text-purple-200 mb-4">
                    By accessing and using LayzoMarket, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
                  <p className="text-purple-200 mb-4">
                    Permission is granted to temporarily download one copy of the materials on LayzoMarket for personal, non-commercial transitory viewing only.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>This is the grant of a license, not a transfer of title</li>
                    <li>Under this license you may not modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Digital Products</h2>
                  <p className="text-purple-200 mb-4">
                    All digital products including websites, mobile apps, and n8n AI agents are provided "as is" with documentation and basic support.
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>Instant download after successful payment</li>
                    <li>Source code and design files included</li>
                    <li>Commercial use license included</li>
                    <li>Basic support included</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Payment and Refunds</h2>
                  <p className="text-purple-200 mb-4">
                    All payments are processed securely through Razorpay. We accept all major credit cards, debit cards, UPI, and net banking.
                  </p>
                  <p className="text-purple-200">
                    Refund policies are subject to our refund policy terms and conditions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  <p className="text-purple-200">
                    For any questions about these Terms of Service, please contact us at layzohelpdesk@gmail.com
                  </p>
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

export default TermsOfServicePage;