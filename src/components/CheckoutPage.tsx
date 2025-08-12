import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, User, Mail, MapPin, Phone, CheckCircle, AlertCircle, ShoppingBag, Shield } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../context/AuthContext';
import { generateOrderNumber, createOrderData, saveOrderToFirestore } from '../utils/orderUtils';
import { CartItem } from '../types';
import Header from './Header';
import Footer from './Footer';
import RazorpayPayment from './RazorpayPayment';
import SuccessOverlay from './SuccessOverlay';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'info' | 'review' | 'payment'>('info');
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successPaymentId, setSuccessPaymentId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      if (items.length === 0) {
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
    setIsLoading(false);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: 'info' | 'payment') => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (step === 'info') {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (step === 'payment') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'info' && validateStep('info')) {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('info');
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    
    if (!user) {
      setPaymentError('User not authenticated. Please sign in and try again.');
      return;
    }
    
    // Generate order number
    const generatedOrderNumber = generateOrderNumber();
    setOrderNumber(generatedOrderNumber);
    
    try {
      // Create order data
      const orderData = createOrderData(generatedOrderNumber, cartItems, formData, paymentData, user);
      
      // Save order to Firestore with retry logic
      await saveOrderToFirestore(orderData, user.email!);
      
      setPaymentSuccess(true);
      setPaymentError(null);
      
      // Set success message with order number
      setSuccessMessage(`Your order ${generatedOrderNumber} has been processed successfully! You will receive download links via email.`);
      setSuccessPaymentId(paymentData.razorpay_payment_id);
      
      // Show success overlay
      setShowSuccessOverlay(true);

      // Clear cart and dispatch update event
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdate'));
      
    } catch (error) {
      console.error('Error saving order:', error);
      
      // Still show success but with a warning about order saving
      setPaymentSuccess(true);
      setPaymentError(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Order processing completed but there was an issue saving your order details. Please contact support.';
      setSuccessMessage(`Payment successful! Order ${generatedOrderNumber} processed. ${errorMessage}`);
      setSuccessPaymentId(paymentData.razorpay_payment_id);
      
      // Show success overlay
      setShowSuccessOverlay(true);

      // Clear cart
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdate'));
    }
  };
    
  const handleOverlayClose = () => {
    setShowSuccessOverlay(false);
    
    // Redirect to homepage after 5 seconds
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentError(error.description || error.message || 'Payment failed. Please try again.');
    setPaymentSuccess(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header cartCount={getTotalItems()} onSearchChange={() => {}} profitableUrl="" />
      
      <div className="pt-24 pb-16 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-300/20"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[
                { id: 'info', label: 'Information', icon: User },
                { id: 'review', label: 'Review', icon: CheckCircle },
                { id: 'payment', label: 'Payment', icon: CreditCard },
              ].map(({ id, label, icon: Icon }, index) => (
                <div key={id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    currentStep === id ? 'text-purple-300' : 
                    ['info', 'review', 'payment'].indexOf(currentStep) > index ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === id ? 'border-purple-300 bg-purple-600/20' :
                      ['info', 'review', 'payment'].indexOf(currentStep) > index ? 'border-green-400 bg-green-600/20' : 'border-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      ['info', 'review', 'payment'].indexOf(currentStep) > index ? 'bg-green-400' : 'bg-gray-500'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                {/* Information Step */}
                {currentStep === 'info' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.email ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.phone ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mt-8 mb-4">Billing Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.firstName ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.lastName ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-200 text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                          errors.address ? 'border-red-400' : 'border-purple-300/30'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.city ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="Mumbai"
                        />
                        {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.state ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="Maharashtra"
                        />
                        {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                            errors.zipCode ? 'border-red-400' : 'border-purple-300/30'
                          }`}
                          placeholder="400001"
                        />
                        {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Review Your Order</h2>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-300">Email:</span>
                          <span className="text-white ml-2">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Phone:</span>
                          <span className="text-white ml-2">{formData.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Billing Address</h3>
                      <div className="text-sm text-white">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.country}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Lock className="w-5 h-5 text-green-400" />
                      <h2 className="text-xl font-semibold text-white">Secure Payment</h2>
                      <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded-full">256-bit SSL</span>
                    </div>
                    
                    {/* Payment Error Display */}
                    {paymentError && (
                      <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <div>
                            <h4 className="text-red-300 font-medium">Payment Failed</h4>
                            <p className="text-red-200 text-sm">{paymentError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Success Display */}
                    {paymentSuccess && (
                      <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <h4 className="text-green-300 font-medium">Payment Successful!</h4>
                            <p className="text-green-200 text-sm">Your order has been processed successfully.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Razorpay Payment Component */}
                    <div className="bg-white/5 rounded-lg p-6 border border-purple-300/20">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Complete Your Payment</h3>
                        <p className="text-purple-200 text-sm">
                          You will be redirected to Razorpay's secure payment gateway
                        </p>
                      </div>

                      <RazorpayPayment
                        amount={getTotalPrice()}
                        currency="INR"
                        customerInfo={{
                          name: `${formData.firstName} ${formData.lastName}`,
                          email: formData.email,
                          phone: formData.phone
                        }}
                        orderDetails={{
                          description: `LayzoMarket - ${getTotalItems()} digital template${getTotalItems() > 1 ? 's' : ''}`,
                          orderId: orderNumber || generateOrderNumber()
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        disabled={isProcessing || paymentSuccess}
                      />
                    </div>

                    {/* Payment Methods Info */}
                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CreditCard className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-blue-300 font-medium mb-2">Accepted Payment Methods</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs">Credit Cards</span>
                            <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs">Debit Cards</span>
                            <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs">UPI</span>
                            <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs">Net Banking</span>
                            <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs">Wallets</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <h4 className="text-green-300 font-medium">Secure Payment</h4>
                          <p className="text-green-200 text-sm">
                            Your payment is processed securely by Razorpay. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep !== 'payment' && (
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        currentStep === 'info' 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-purple-300/30'
                      }`}
                      disabled={currentStep === 'info'}
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Continue to {currentStep === 'info' ? 'Review' : 'Payment'}
                    </button>
                  </div>
                )}

                {/* Back button for payment step */}
                {currentStep === 'payment' && (
                  <div className="flex justify-start mt-8">
                    <button
                      onClick={handlePreviousStep}
                      className="px-6 py-3 rounded-lg font-medium transition-colors bg-white/10 hover:bg-white/20 text-white border border-purple-300/30"
                    >
                      ← Back to Review
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 sticky top-24 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-start space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded border border-purple-300/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-medium line-clamp-2">{item.product.title}</h3>
                        <p className="text-purple-300 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 border-t border-purple-300/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium text-white">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Tax</span>
                    <span className="font-medium text-white">₹0</span>
                  </div>
                  <div className="border-t border-purple-300/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        ₹{getTotalPrice().toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-purple-200 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span>Secure checkout powered by Razorpay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span>Instant download after payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <SuccessOverlay
        isOpen={showSuccessOverlay}
        message={successMessage}
        paymentId={successPaymentId}
        orderNumber={orderNumber}
        onClose={handleOverlayClose}
      />

      <Footer />
    </div>
  );
};

export default CheckoutPage;