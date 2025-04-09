import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Image from 'next/image';

// Mock data for model details
const MOCK_MODELS = {
  '1': {
    id: 1,
    title: 'Model 01',
    description: 'This is a detailed 3D model of a spherical object with bubbles.',
    thumbnailUrl: '/images/model01.jpg',
    basePrice: 800
  },
  '2': {
    id: 2,
    title: 'Model 02',
    description: 'A detailed skull model with intricate patterns.',
    thumbnailUrl: '/images/model02.jpg',
    basePrice: 1200
  },
  '3': {
    id: 3,
    title: 'Model 03',
    description: 'A minimalist figurine model with smooth surfaces.',
    thumbnailUrl: '/images/model03.jpg',
    basePrice: 600
  }
};

const PaymentPage = () => {
  const router = useRouter();
  const { id, price, time } = router.query;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayError, setRazorpayError] = useState('');
  
  // Add Razorpay to the Window interface
  declare global {
    interface Window {
      Razorpay: any;
    }
  }
  
  // Function to check if Razorpay is loaded
  const isRazorpayReady = () => {
    return typeof window !== 'undefined' && window.Razorpay !== undefined;
  }
  
  useEffect(() => {
    if (id) {
      // In a real app, fetch model data from API
      // For now, use mock data
      const modelData = MOCK_MODELS[id as string];
      if (modelData) {
        setModel(modelData);
      } else {
        setError('Model not found');
      }
      setLoading(false);
      
      // Generate a random order ID for demo purposes
      // In a real app, this would come from your backend
      const randomOrderId = 'order_' + Math.random().toString(36).substring(2, 15);
      setOrderId(randomOrderId);
      
      // Check if Razorpay is already loaded
      if (isRazorpayReady()) {
        setRazorpayLoaded(true);
      }
    }
  }, [id]);
  
  const handlePayment = () => {
    // Reset states
    setPaymentProcessing(true);
    setRazorpayError('');
    
    // Validate if Razorpay is loaded
    if (!isRazorpayReady()) {
      console.error('Razorpay SDK is not loaded yet');
      setRazorpayError('Payment gateway is not ready. Please refresh the page and try again.');
      setPaymentProcessing(false);
      return;
    }
    
    // Validate order ID
    if (!orderId) {
      console.error('Order ID is missing');
      setRazorpayError('Order initialization failed. Please refresh the page and try again.');
      setPaymentProcessing(false);
      return;
    }
    
    // Calculate amount
    const amount = (Number(price) || model?.basePrice || 0) * 100; // Amount in paise
    if (amount <= 0) {
      console.error('Invalid amount:', amount);
      setRazorpayError('Invalid payment amount. Please refresh the page and try again.');
      setPaymentProcessing(false);
      return;
    }
    
    // In a real app, you would create an order on your backend
    // and get the order_id from Razorpay
    const options = {
      key: 'rzp_test_51NXHkLkCjF2176i', // Using a valid test key format
      amount: amount,
      currency: 'INR',
      name: 'Innoprint',
      description: `Payment for ${model?.title || 'Model Print'}`,
      image: '/logo.png', // Replace with your logo
      order_id: orderId,
      handler: function(response: any) {
        // Handle successful payment
        console.log('Payment successful:', response);
        setPaymentSuccess(true);
        setPaymentProcessing(false);
        
        // In a real app, verify payment on backend
        // Then redirect to confirmation page
        setTimeout(() => {
          router.push(`/order-confirmation/${id}?orderId=${response.razorpay_payment_id}`);
        }, 2000);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9876543210'
      },
      notes: {
        address: 'Innoprint Office',
        modelId: id as string
      },
      theme: {
        color: '#4285F4'
      },
      modal: {
        ondismiss: function() {
          setPaymentProcessing(false);
          console.log('Payment cancelled');
        }
      }
    };
    
    try {
      // Open Razorpay payment form
      const razorpayWindow = new window.Razorpay(options);
      
      // Add event listeners for payment failures
      razorpayWindow.on('payment.failed', function(response: any) {
        console.error('Payment failed:', response.error);
        setRazorpayError(response.error.description || 'Payment failed. Please try again.');
        setPaymentProcessing(false);
      });
      
      // Open the payment window
      razorpayWindow.open();
    } catch (error: any) {
      console.error('Error opening Razorpay window:', error);
      setRazorpayError(error.message || 'Payment gateway encountered an error. Please try again.');
      setPaymentProcessing(false);
    }
  };
  
  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!model) return <div className="container mx-auto px-4 py-8">Model not found</div>;

  return (
    <>
      <Head>
        <title>Payment | Innoprint</title>
        <meta name="description" content="Complete your payment for 3D printing" />
      </Head>
      
      {/* Razorpay Script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Razorpay script loaded successfully');
          setRazorpayLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Razorpay script:', e);
          setRazorpayError('Payment gateway failed to load. Please check your internet connection and refresh the page.');
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Payment</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative w-24 h-24 rounded-md overflow-hidden">
                <Image 
                  src={model.thumbnailUrl} 
                  alt={model.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div>
                <h3 className="font-medium">{model.title}</h3>
                <p className="text-sm text-gray-600">{model.description}</p>
                <p className="text-sm text-gray-500 mt-1">Estimated Print Time: {time || '8'} Hrs</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹ {price || model.basePrice}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₹ 100</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Tax (18% GST)</span>
                <span>₹ {Math.round((Number(price) || model.basePrice) * 0.18)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>₹ {Math.round((Number(price) || model.basePrice) * 1.18 + 100)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Options */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4">
                    <Image 
                      src="/images/razorpay-logo.webp" 
                      alt="Razorpay"
                      width={48}
                      height={48}
                      onError={() => console.error('Failed to load Razorpay logo')}
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Razorpay</h3>
                    <p className="text-sm text-gray-600">Secure payment via credit/debit card, UPI, or net banking</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 text-center bg-white text-blue-500 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
              disabled={paymentProcessing || !razorpayLoaded}
            >
              Back
            </button>
            
            <button
              onClick={handlePayment}
              className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
              disabled={paymentProcessing || !razorpayLoaded}
            >
              {paymentProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Pay Now'}
            </button>
          </div>
          
          {/* Payment Status Messages */}
          {paymentSuccess && (
            <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Payment successful! Redirecting to order confirmation...
            </div>
          )}
          
          {razorpayError && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {razorpayError}
            </div>
          )}
          
          {/* Security Notice */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;