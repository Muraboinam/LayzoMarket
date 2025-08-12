import React from 'react';
import { Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and About */}
          <div className="lg:col-span-2">
            <a href="/" className="text-2xl font-bold mb-4 inline-block">
              <span className="text-blue-500">Template</span>
              <span className="text-white">Market</span>
            </a>
            <p className="text-gray-400 mb-6">
              TemplateMarket is the leading marketplace for website templates, 
              themes, plugins, and digital assets for all your project needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/templates" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Website Templates
                </a>
              </li>
              <li>
                <a href="/apps" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Apps
                </a>
              </li>
              <li>
                <a href="/n8n" className="text-gray-400 hover:text-blue-500 transition-colors">
                  n8n Workflows
                </a>
              </li>
              <li>
                <a href="/combo" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Combo Packages
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Shopping Cart
                </a>
              </li>
              <li>
                <a href="/wishlist" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="/terms" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/license" className="text-gray-400 hover:text-blue-500 transition-colors">
                  License Terms
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2025 TemplateMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;