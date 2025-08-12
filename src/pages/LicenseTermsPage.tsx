import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, DollarSign, Users, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LicenseTermsPage: React.FC = () => {
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
              License Terms
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
                    <FileText className="w-6 h-6 mr-2 text-blue-400" />
                    Standard License
                  </h2>
                  <p className="text-purple-200 mb-4">
                    Our standard license covers most use cases for websites, apps, and n8n AI agents.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 mb-4">
                    <h4 className="text-blue-200 font-semibold mb-3">What's Included:</h4>
                    <ul className="list-disc list-inside text-blue-200 space-y-2">
                      <li>Commercial use for unlimited projects</li>
                      <li>Modify and customize the code</li>
                      <li>Use for client projects (with attribution)</li>
                      <li>Create derivative works</li>
                      <li>Professional quality templates</li>
                      <li>Quality designs at competitive prices</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-purple-400" />
                    Extended License
                  </h2>
                  <p className="text-purple-200 mb-4">
                    For larger projects and resale purposes, our extended license provides additional rights.
                  </p>
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-6 mb-4">
                    <h4 className="text-purple-200 font-semibold mb-3">Additional Rights:</h4>
                    <ul className="list-disc list-inside text-purple-200 space-y-2">
                      <li>Resell the template as part of a larger product</li>
                      <li>Use in SaaS applications</li>
                      <li>Remove attribution requirements</li>
                      <li>Priority support</li>
                      <li>Custom modifications available</li>
                      <li>Fast delivery with premium quality</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Prohibited Uses</h2>
                  <p className="text-purple-200 mb-4">
                    The following uses are prohibited under all license types:
                  </p>
                  <ul className="list-disc list-inside text-purple-200 space-y-2 mb-4">
                    <li>Redistributing the original template files</li>
                    <li>Creating competing template marketplaces</li>
                    <li>Claiming authorship of the original design</li>
                    <li>Using for illegal or harmful purposes</li>
                    <li>Violating intellectual property rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Support & Modifications</h2>
                  <p className="text-purple-200 mb-4">
                    Support level and modification services are provided based on your total investment with LayzoMarket.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Basic License Support</h4>
                      <p className="text-purple-200 text-sm">Email support, documentation, money-back guarantee</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Extended License Support</h4>
                      <p className="text-purple-200 text-sm">Priority support, custom modifications, dedicated assistance</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Digital Product Quality</h2>
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 mb-4">
                    <p className="text-blue-200 mb-4">
                      <strong>Quality Assurance:</strong> All our new websites, apps, and n8n AI agents are created by the best web designers and developers, ensuring low cost with premium quality and fast delivery.
                    </p>
                    <ul className="list-disc list-inside text-blue-200 space-y-2">
                      <li>Code reviewed by senior developers</li>
                      <li>Design approved by professional designers</li>
                      <li>Performance optimized for best user experience</li>
                      <li>Regular updates and improvements included</li>
                      <li>Money-back guarantee if quality doesn't meet expectations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">License Termination</h2>
                  <p className="text-purple-200 mb-4">
                    This license is effective until terminated. Your rights under this license will terminate automatically if you fail to comply with any of its terms.
                  </p>
                  <p className="text-purple-200">
                    Upon termination, you must destroy any downloaded materials in your possession whether in electronic or printed format.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  <p className="text-purple-200">
                    For license-related questions or to request a refund under our money-back guarantee, contact us at:
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

export default LicenseTermsPage;