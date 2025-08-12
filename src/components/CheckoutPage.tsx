import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, User, Mail, MapPin, Phone, CheckCircle, AlertCircle, ShoppingBag, Shield, ArrowRight } from 'lucide-react';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../types';
import Header from './Header';
import Footer from './Footer';
import RazorpayPayment from './RazorpayPayment';
import SuccessOverlay from './SuccessOverlay';
import { useAuthContext } from '../context/AuthContext';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  subcategory: string;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: any; // Firestore timestamp
  status: 'completed' | 'pending' | 'failed';
  total: number;
  items: OrderItem[];
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentDetails: {
    paymentId: string;
    orderId?: string;
    signature?: string;
    method: string;
    currency: string;
  };
}

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

  const generateOrderNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Generate random alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `ORD-${year}${month}${day}-${randomString}`;
  };

  const saveOrderToFirestore = async (paymentData: any): Promise<string> => {
    try {
      const userEmail = user?.email || formData.email;
      if (!userEmail) {
        throw new Error('User email not available');
      }

      // Generate order number
      const generatedOrderNumber = generateOrderNumber();
      
      // Prepare order items
      const orderItems: OrderItem[] = cartItems.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        category: item.product.category,
        subcategory: item.product.subcategory
      }));

      // Create order object
      const newOrder: Order = {
        id: generatedOrderNumber,
        orderNumber: generatedOrderNumber,
        orderDate: new Date(),
        status: 'completed',
        total: getTotalPrice(),
        items: orderItems,
        customerInfo: {
          email: userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentDetails: {
          paymentId: paymentData.razorpay_payment_id,
          orderId: paymentData.razorpay_order_id,
          signature: paymentData.razorpay_signature,
          method: 'Razorpay',
          currency: 'INR'
        }
      };

      // Get reference to user's orders document
      const userOrdersRef = doc(db, 'orders', userEmail);
      
      // Check if user already has orders
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (userOrdersDoc.exists()) {
        // User has existing orders, append new order
        const existingData = userOrdersDoc.data();
        const existingOrders = existingData.orders || [];
        
        await updateDoc(userOrdersRef, {
          orders: [...existingOrders, newOrder],
          lastUpdated: serverTimestamp(),
          totalOrders: existingOrders.length + 1
        });
      } else {
        // First order for this user, create new document
        await setDoc(userOrdersRef, {
          userEmail: userEmail,
          orders: [newOrder],
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          totalOrders: 1
        });
      }

      console.log('Order saved successfully to Firestore:', generatedOrderNumber);
      return generatedOrderNumber;
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    
    // Save order to Firestore
    saveOrderToFirestore(paymentData)
      .then((generatedOrderNumber) => {
        setPaymentSuccess(true);
        setPaymentError(null);
        setOrderNumber(generatedOrderNumber);
        
        // Set success message with order number
        setSuccessMessage(`Your order ${generatedOrderNumber} has been processed successfully! You will receive download links via email.`);
        setSuccessPaymentId(paymentData.razorpay_payment_id);
        
        // Show success overlay
        setShowSuccessOverlay(true);

        // Clear cart
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cartUpdate'));
      })
      .catch((error) => {
        console.error('Error saving order:', error);
        // Still show success for payment, but log the error
        setPaymentSuccess(true);
        setPaymentError(null);
        
        setSuccessMessage(`Your payment was successful! However, there was an issue saving your order details. Please contact support with payment ID: ${paymentData.razorpay_payment_id}`);
        setSuccessPaymentId(paymentData.razorpay_payment_id);
        
        setShowSuccessOverlay(true);
        
        // Clear cart anyway since payment was successful
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cartUpdate'));
      });
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
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-purple-400/50 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
          <p className="text-purple-200 mb-8">Add some templates to your cart before checking out.</p>
          <button
            onClick={() => navigate('/templates')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            Browse Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header cartCount={getTotalItems()} onSearchChange={() => {}} profitableUrl="" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-300/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Checkout
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[
                { id: 'info', label: 'Information', icon: User },
                { id: 'review', label: 'Review', icon: CheckCircle },
                { id: 'payment', label: 'Payment', icon: CreditCard }
              ].map(({ id, label, icon: Icon }, index) => (
                <div key={id} className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep === id
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : index < ['info', 'review', 'payment'].indexOf(currentStep)
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-purple-300/30 text-purple-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium ${
                    currentStep === id ? 'text-white' : 'text-purple-300'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                {currentStep === 'info' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Billing Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-purple-200 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mt-4">
                      <label className="block text-purple-200 text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="mt-4">
                      <label className="block text-purple-200 text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="Enter address"
                      />
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter city"
                        />
                        {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter state"
                        />
                        {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Enter ZIP code"
                        />
                        {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>Continue to Review</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'review' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Review Your Order</h2>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{item.product.title}</h3>
                            <p className="text-purple-300 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Billing Information */}
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                      <h3 className="text-white font-medium mb-3">Billing Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-300">Name:</span>
                          <span className="text-white ml-2">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Email:</span>
                          <span className="text-white ml-2">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Phone:</span>
                          <span className="text-white ml-2">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Address:</span>
                          <span className="text-white ml-2">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={handlePreviousStep}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Back to Information
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>Proceed to Payment</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                      <Shield className="w-6 h-6 text-green-400" />
                      <span>Secure Payment</span>
                    </h2>
                    
                    {paymentError && (
                      <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <p className="text-red-300">{paymentError}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <h3 className="text-blue-300 font-medium">Secure Payment with Razorpay</h3>
                        </div>
                        <p className="text-blue-200 text-sm">
                          Your payment information is encrypted and secure. We support all major payment methods including cards, UPI, net banking, and wallets.
                        </p>
                      </div>

                      <RazorpayPayment
                        amount={getTotalPrice()}
                        customerInfo={{
                          name: `${formData.firstName} ${formData.lastName}`,
                          email: formData.email,
                          phone: formData.phone
                        }}
                        orderDetails={{
                          description: `LayzoMarket Order - ${getTotalItems()} items`
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        disabled={isProcessing}
                      />

                      <div className="flex justify-between">
                        <button
                          onClick={handlePreviousStep}
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Back to Review
                        </button>
                      </div>
                    </div>
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
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-2">{item.product.title}</p>
                        <p className="text-purple-300 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
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

                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="text-green-300 font-medium">What You Get</h3>
                  </div>
                  <ul className="text-green-200 text-sm space-y-1">
                    <li>• Instant download after payment</li>
                    <li>• Full source code and assets</li>
                    <li>• Commercial use license</li>
                  </ul>
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