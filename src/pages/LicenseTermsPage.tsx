import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LicenseTermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">License Terms</h1>
          
          <div className="prose prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Standard License</h2>
              <p className="text-gray-700 mb-4">
                The Standard License grants you the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use in a single end product for yourself or a client</li>
                <li>Use in one domain only</li>
                <li>Modify the item to suit your needs</li>
                <li>Use in personal or commercial projects</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Restrictions:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cannot be redistributed or resold</li>
                <li>Cannot be used in multiple projects</li>
                <li>Cannot be included in a theme or template</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Extended License</h2>
              <p className="text-gray-700 mb-4">
                The Extended License includes all Standard License rights plus:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use in unlimited end products</li>
                <li>Use in multiple domains</li>
                <li>Use in products that will be sold to end users</li>
                <li>Extended usage rights for larger organizations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Usage Requirements</h2>
              <p className="text-gray-700 mb-4">
                For all licenses, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Maintain copyright notices in the code</li>
                <li>Not claim ownership of the item</li>
                <li>Not use the item in trademark or logo designs</li>
                <li>Not use the item in any illegal or unethical way</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Attribution Requirements</h2>
              <p className="text-gray-700 mb-4">
                Attribution requirements vary by license type:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Standard License: Attribution required in source code</li>
                <li>Extended License: Attribution optional but appreciated</li>
                <li>Must maintain all copyright notices intact</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Updates and Support</h2>
              <p className="text-gray-700 mb-4">
                License terms regarding updates and support:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>6 months of support included with purchase</li>
                <li>Access to bug fixes and updates</li>
                <li>Support can be extended for additional fee</li>
                <li>Major version updates may require new license</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All items remain the intellectual property of their creators:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You purchase a license to use, not ownership</li>
                <li>Creator retains all copyrights</li>
                <li>Modifications do not grant ownership rights</li>
                <li>Third-party components have separate licenses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. License Violations</h2>
              <p className="text-gray-700 mb-4">
                Consequences of license violations:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Immediate license termination</li>
                <li>Legal action may be taken</li>
                <li>Removal of access to updates and support</li>
                <li>Requirement to cease usage of the item</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LicenseTermsPage;