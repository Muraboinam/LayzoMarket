import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using LayzoMarket, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. License Terms</h2>
              <p className="text-gray-700 mb-4">
                All templates and themes purchased from LayzoMarket are subject to our Standard License or Extended License agreements. You must choose the appropriate license based on your intended use.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Standard License allows use in a single end product</li>
                <li>Extended License allows use in multiple end products</li>
                <li>Resale of templates or themes is strictly prohibited</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. No Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                Due to the digital nature of our products, we maintain a strict no-refund policy. All sales are final. We encourage users to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Thoroughly review product descriptions and previews before purchase</li>
                <li>Check compatibility requirements</li>
                <li>Test demo versions when available</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Exception:</strong> Refunds may be considered in cases where the product is demonstrably non-functional and cannot be fixed through support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Obligations</h2>
              <p className="text-gray-700 mb-4">
                Users of LayzoMarket agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate account information</li>
                <li>Maintain the security of their account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any unauthorized use of the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                All templates, themes, and digital assets remain the intellectual property of their respective creators. Users purchase a license to use the products but do not acquire ownership of the intellectual property.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Support Policy</h2>
              <p className="text-gray-700 mb-4">
                Item support includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Answering technical questions about item features</li>
                <li>Assistance with reported bugs and issues</li>
                <li>Help with included third-party assets</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Item support does NOT include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Customization services</li>
                <li>Installation services</li>
                <li>Support for modified code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                LayzoMarket shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform or products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;