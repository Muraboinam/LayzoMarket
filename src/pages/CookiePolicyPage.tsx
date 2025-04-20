import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide valuable information to website owners.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Key Points About Cookies:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>They are essential for many website features</li>
                  <li>Can remember your preferences and settings</li>
                  <li>Help us understand how you use our site</li>
                  <li>Enable personalized content and ads</li>
                  <li>Can be temporary or permanent</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700">Required for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Authentication and security</li>
                    <li>Shopping cart functionality</li>
                    <li>Session management</li>
                    <li>Load balancing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-700">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Page load times</li>
                    <li>Most visited pages</li>
                    <li>Error messages</li>
                    <li>User journey analysis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-700">Enable the website to remember choices you make to provide enhanced features.</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Language preferences</li>
                    <li>Region/location settings</li>
                    <li>Personalization options</li>
                    <li>Remember login details</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Targeting/Advertising Cookies</h3>
                  <p className="text-gray-700">Used to track visitors across websites to enable personalized advertising.</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Ad delivery and reporting</li>
                    <li>Behavioral profiling</li>
                    <li>Market analysis</li>
                    <li>Product recommendations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Cookies</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Website Operations</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Remember items in your shopping cart</li>
                    <li>Keep you logged in during your session</li>
                    <li>Enable secure checkout processes</li>
                    <li>Remember your preferences</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics and Performance</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Track page views and navigation patterns</li>
                    <li>Analyze user behavior and trends</li>
                    <li>Monitor website performance</li>
                    <li>Identify and fix technical issues</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personalization</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Customize content based on interests</li>
                    <li>Remember language preferences</li>
                    <li>Provide location-based services</li>
                    <li>Save user preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-700">You can control cookies through your browser settings:</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Chrome: Settings → Privacy and Security → Cookies</li>
                    <li>Firefox: Options → Privacy & Security → Cookies</li>
                    <li>Safari: Preferences → Privacy → Cookies</li>
                    <li>Edge: Settings → Privacy & Security → Cookies</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <p className="text-yellow-800">
                    <strong>Important Note:</strong> Blocking certain types of cookies may impact your experience on our website and limit the services we can provide.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration and Expiry</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Session Cookies</h3>
                  <p className="text-gray-700">Temporary cookies that expire when you close your browser.</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Shopping cart contents</li>
                    <li>Form data</li>
                    <li>Authentication status</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Persistent Cookies</h3>
                  <p className="text-gray-700">Remain on your device for a set period:</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2">
                    <li>Short-term (1 day to 1 week)</li>
                    <li>Medium-term (1 week to 1 month)</li>
                    <li>Long-term (1 month to 1 year)</li>
                    <li>Permanent (until manually deleted)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services and Cookies</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Partners</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Google Analytics</li>
                    <li>Hotjar</li>
                    <li>Mixpanel</li>
                    <li>Adobe Analytics</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advertising Partners</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Google Ads</li>
                    <li>Facebook Pixel</li>
                    <li>LinkedIn Insight Tag</li>
                    <li>Other ad networks</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Social Media Integration</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Facebook</li>
                    <li>Twitter</li>
                    <li>LinkedIn</li>
                    <li>Instagram</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Protection and Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Data Security Measures</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Encryption of sensitive data</li>
                    <li>Regular security audits</li>
                    <li>Limited data retention periods</li>
                    <li>Secure data storage facilities</li>
                    <li>Regular security updates</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Your Rights</h3>
                  <ul className="list-disc pl-6 text-blue-800">
                    <li>Right to access your data</li>
                    <li>Right to rectification</li>
                    <li>Right to erasure</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Policy Updates</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We regularly review and update this Cookie Policy to reflect changes in our practices and services. When we post changes to this policy, we will revise the "Last Updated" date at the top of this page.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Update Notifications</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Major changes will be notified via email</li>
                    <li>Updates posted on our website</li>
                    <li>Cookie consent renewal requests</li>
                    <li>Regular policy reviews</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;