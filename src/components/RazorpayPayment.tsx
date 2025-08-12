import React, { useEffect } from 'react';
import { CreditCard, Shield, Lock } from 'lucide-react';

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  orderDetails: {
    orderId?: string;
    description: string;
  };
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  currency = 'INR',
  customerInfo,
  orderDetails,
  onSuccess,
  onError,
  disabled = false
}) => {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      onError({ message: 'Razorpay SDK not loaded' });
      return;
    }

    const options = {
      key: "rzp_test_0IM2TUIyvN8aTX", // Replace with your actual Razorpay Key ID
      amount: amount * 100, // Amount in paise (multiply by 100 for rupees)
      currency: currency,
      name: "LayzoMarket",
      description: orderDetails.description,
      image: "/vite.svg", // You can replace this with your logo
      order_id: orderDetails.orderId, // Optional: Pass order ID if you have backend integration
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/", // Your webhook URL when available
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      notes: {
        address: "LayzoMarket Digital Templates"
      },
      theme: {
        color: "#8B5CF6" // Purple theme to match your site
      },
      handler: function (response: any) {
        // Payment successful
        console.log('Payment successful:', response);
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      modal: {
        ondismiss: function() {
          onError({ message: 'Payment cancelled by user' });
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      onError({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        metadata: response.error.metadata
      });
    });

    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
    >
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5" />
        <CreditCard className="w-5 h-5" />
      </div>
      <span>Pay ₹{amount.toLocaleString('en-IN')} Securely</span>
      <Lock className="w-4 h-4" />
    </button>
  );
};

export default RazorpayPayment;