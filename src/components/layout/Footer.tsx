import React from 'react';
import { Link } from '../ui/Link';
import { Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const handleCategoryClick = (category: string) => {
    window.location.href = `/templates?category=${encodeURIComponent(category)}`;
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and About */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              <span className="text-primary">Layzo</span>
              <span className="text-white">Market</span>
            </Link>
            <p className="text-gray-400 mb-6">
              LayzoMarket is the leading marketplace for website templates, 
              themes, plugins, and digital assets for all your project needs.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-primary transition-colors">
                  All Items
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates?category=WordPress"
                  className="text-gray-400 hover:text-primary transition-colors"
                  onClick={() => handleCategoryClick('WordPress')}
                >
                  WordPress Themes
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates?category=HTML"
                  className="text-gray-400 hover:text-primary transition-colors"
                  onClick={() => handleCategoryClick('HTML')}
                >
                  HTML Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates?category=React"
                  className="text-gray-400 hover:text-primary transition-colors"
                  onClick={() => handleCategoryClick('React')}
                >
                  React Templates
                </Link>
              </li>
              <li>
                <Link 
                  href="/templates?category=Admin Templates"
                  className="text-gray-400 hover:text-primary transition-colors"
                  onClick={() => handleCategoryClick('Admin Templates')}
                >
                  Admin Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/license-terms" className="text-gray-400 hover:text-primary transition-colors">
                  License Terms
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Join Our Newsletter</h3>
              <p className="text-gray-400">Stay updated with new items, sales, and more.</p>
            </div>
            <div>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow rounded-l-md px-4 py-2 focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors flex items-center"
                >
                  <Mail size={18} className="mr-2" />
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2025 LayzoMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;