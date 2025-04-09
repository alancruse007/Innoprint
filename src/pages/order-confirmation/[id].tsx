import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { id, orderId } = router.query;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      // In a real app, fetch model data from API
      // For now, use mock data
      const modelData = MOCK_MODELS[id as string];
      if (modelData) {
        setModel(modelData);
        
        // Generate mock order details
        const mockOrderDetails = {
          orderId: orderId || `ORD${Math.floor(Math.random() * 1000000000)}`,
          orderDate: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          paymentMethod: 'Razorpay',
          paymentId: orderId || `pay_${Math.random().toString(36).substring(2, 15)}`,
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main Street, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          items: [
            {
              id: modelData.id,
              name: modelData.title,
              price: modelData.basePrice,
              quantity: 1
            }
          ],
          subtotal: modelData.basePrice,
          shipping: 100,
          tax: Math.round(modelData.basePrice * 0.18),
          total: Math.round(modelData.basePrice * 1.18 + 100)
        };
        
        setOrderDetails(mockOrderDetails);
      } else {
        setError('Model not found');
      }
      setLoading(false);
    }
  }, [id, orderId]);
  
  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!model || !orderDetails) return <div className="container mx-auto px-4 py-8">Order details not found</div>;

  return (
    <>
      <Head>
        <title>Order Confirmation | Innoprint</title>
        <meta name="description" content="Your order has been confirmed" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 rounded-lg p-6 mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
            <p className="text-green-700">
              Thank you for your order. We've received your payment and will start processing your print immediately.
            </p>
          </div>
          
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm">Order ID</p>
                <p className="font-medium">{orderDetails.orderId}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Order Date</p>
                <p className="font-medium">{new Date(orderDetails.orderDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-medium">{orderDetails.paymentMethod}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Payment ID</p>
                <p className="font-medium">{orderDetails.paymentId}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Estimated Delivery</p>
                <p className="font-medium">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{orderDetails.shippingAddress.name}</p>
              <p>{orderDetails.shippingAddress.address}</p>
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
              <p>{orderDetails.shippingAddress.country}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              {/* Order Items */}
              <div className="mb-4">
                {orderDetails.items.map((item: any) => (
                  <div key={item.id} className="flex items-start space-x-4 mb-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image 
                        src={model.thumbnailUrl} 
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">₹ {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹ {orderDetails.subtotal}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₹ {orderDetails.shipping}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span>Tax (18% GST)</span>
                  <span>₹ {orderDetails.tax}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>₹ {orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-500 font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Production</h3>
                  <p className="text-gray-600">Your model is now in our production queue. We'll start printing it shortly.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-500 font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Quality Check</h3>
                  <p className="text-gray-600">Once printed, your model will undergo a thorough quality check.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-500 font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-gray-600">After quality approval, your model will be carefully packaged and shipped.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-500 font-medium">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Delivery</h3>
                  <p className="text-gray-600">You'll receive your model at the provided address. We'll send you tracking information once it's shipped.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/"
              className="flex-1 py-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </Link>
            
            <Link 
              href="/catalogue"
              className="flex-1 py-3 text-center bg-white text-blue-500 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
            >
              Browse More Models
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Have questions about your order?</p>
            <p>Contact us at <a href="mailto:support@innoprint.com" className="text-blue-500 hover:underline">support@innoprint.com</a> or call <a href="tel:+919876543210" className="text-blue-500 hover:underline">+91 9876543210</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;