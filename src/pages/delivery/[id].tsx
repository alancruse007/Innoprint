import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data for Indian states
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// Mock data for cities (simplified)
const CITIES = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirapalli'],
  // Add more as needed
};

const DeliveryPage = () => {
  const router = useRouter();
  const { id, price, time } = router.query;
  
  // Delivery method state
  const [deliveryMethod, setDeliveryMethod] = useState('HOME');
  
  // Address form state
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Available cities based on selected state
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Update available cities when state changes
  useEffect(() => {
    if (selectedState && CITIES[selectedState]) {
      setAvailableCities(CITIES[selectedState]);
      setSelectedCity(''); // Reset city when state changes
    } else {
      setAvailableCities([]);
    }
  }, [selectedState]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (deliveryMethod === 'HOME') {
      if (!addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!selectedState) newErrors.state = 'State is required';
      if (!selectedCity) newErrors.city = 'City is required';
      if (!zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^\d{6}$/.test(zipCode)) {
        newErrors.zipCode = 'ZIP code must be 6 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, save delivery details to state/context or backend
      // For now, just navigate to payment page
      const deliveryDetails = {
        method: deliveryMethod,
        address: deliveryMethod === 'HOME' ? {
          line1: addressLine1,
          line2: addressLine2,
          state: selectedState,
          city: selectedCity,
          zipCode
        } : null
      };
      
      // Navigate to payment page with order details
      router.push(`/payment/${id}?price=${price}&time=${time}`);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Delivery Options | Innoprint</title>
        <meta name="description" content="Choose your delivery method" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Add New Address</h1>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Delivery Method Selection */}
            <div className="flex space-x-4 mb-8">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border ${deliveryMethod === 'HOME' ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100'}`}
                onClick={() => setDeliveryMethod('HOME')}
              >
                HOME
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border ${deliveryMethod === 'OFFICE' ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100'}`}
                onClick={() => setDeliveryMethod('OFFICE')}
              >
                Office
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg border ${deliveryMethod === 'PICKUP' ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100'}`}
                onClick={() => setDeliveryMethod('PICKUP')}
              >
                Pick up
              </button>
            </div>
            
            {/* Address Form (only shown for HOME or OFFICE delivery) */}
            {deliveryMethod !== 'PICKUP' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Address 01"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Apartment"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State<span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-4 py-3 rounded-lg border ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="">Select state</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City<span className="text-red-500">*</span></label>
                  <select
                    className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                  >
                    <option value="">Select city</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            )}
            
            {/* Pickup Location Info (only shown for PICKUP) */}
            {deliveryMethod === 'PICKUP' && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-2">Pickup Information</h3>
                <p className="text-gray-700 mb-4">
                  You can pick up your order at our main office location once it's ready.
                </p>
                <div className="space-y-2">
                  <p><span className="font-medium">Address:</span> 123 Printing Avenue, Tech Park</p>
                  <p><span className="font-medium">City:</span> Bangalore</p>
                  <p><span className="font-medium">Hours:</span> Monday-Friday, 9:00 AM - 6:00 PM</p>
                  <p><span className="font-medium">Contact:</span> +91 9876543210</p>
                </div>
              </div>
            )}
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 text-center bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryPage;