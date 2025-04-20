import React from 'react';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminTemplateEditPage from './pages/AdminTemplateEditPage';
import AdminTemplateCreatePage from './pages/AdminTemplateCreatePage';
import AdminCategoryEditPage from './pages/AdminCategoryEditPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WaitlistPage from './pages/WaitlistPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LicenseTermsPage from './pages/LicenseTermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CollectionsPage from './pages/CollectionsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const path = window.location.pathname;

  return (
    <div className="bg-gray-50 min-h-screen">
      {path === '/' && <HomePage />}
      {path === '/admin/login' && <AdminLoginPage />}
      {path === '/admin/dashboard' && <AdminDashboardPage />}
      {path === '/admin/template/new' && <AdminTemplateCreatePage />}
      {path.startsWith('/admin/template/edit/') && <AdminTemplateEditPage />}
      {path.startsWith('/admin/category/edit/') && <AdminCategoryEditPage />}
      {path === '/templates' && <SearchPage />}
      {path === '/collections' && <CollectionsPage />}
      {path === '/cart' && <CartPage />}
      {path === '/checkout' && <CheckoutPage />}
      {path === '/waitlist' && <WaitlistPage />}
      {path === '/terms-of-service' && <TermsOfServicePage />}
      {path === '/privacy-policy' && <PrivacyPolicyPage />}
      {path === '/license-terms' && <LicenseTermsPage />}
      {path === '/cookie-policy' && <CookiePolicyPage />}
      {path === '/login' && <LoginPage />}
      {path === '/signup' && <SignupPage />}
      {path === '/profile' && <ProfilePage />}
    </div>
  );
}

export default App;