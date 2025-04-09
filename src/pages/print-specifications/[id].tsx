import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data for model details
const MOCK_MODELS = {
  '1': {
    id: 1,
    title: 'Model 01',
    description: 'This is a detailed 3D model of a spherical object with bubbles.',
    fileUrl: '/models/model01.glb',
    thumbnailUrl: '/images/model01.jpg',
    basePrice: 800,
    basePrintTime: 8 // hours
  },
  '2': {
    id: 2,
    title: 'Model 02',
    description: 'A detailed skull model with intricate patterns.',
    fileUrl: '/models/model02.glb',
    thumbnailUrl: '/images/model02.jpg',
    basePrice: 1200,
    basePrintTime: 12 // hours
  },
  '3': {
    id: 3,
    title: 'Model 03',
    description: 'A minimalist figurine model with smooth surfaces.',
    fileUrl: '/models/model03.glb',
    thumbnailUrl: '/images/model03.jpg',
    basePrice: 600,
    basePrintTime: 6 // hours
  }
};

// Material options
const MATERIALS = [
  { id: 'pla', name: 'PLA', priceMultiplier: 1.0, description: 'Standard, eco-friendly material. Good for most prints.' },
  { id: 'abs', name: 'ABS', priceMultiplier: 1.2, description: 'Durable and heat-resistant. Good for functional parts.' },
  { id: 'petg', name: 'PETG', priceMultiplier: 1.3, description: 'Strong and flexible. Good for mechanical parts.' },
  { id: 'tpu', name: 'TPU', priceMultiplier: 1.5, description: 'Flexible and elastic. Good for parts that need to bend.' },
  { id: 'resin', name: 'Resin', priceMultiplier: 2.0, description: 'High detail and smooth finish. Good for intricate models.' }
];

// Color options
const COLORS = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'red', name: 'Red', hex: '#FF0000' },
  { id: 'blue', name: 'Blue', hex: '#0000FF' },
  { id: 'green', name: 'Green', hex: '#00FF00' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { id: 'orange', name: 'Orange', hex: '#FFA500' },
  { id: 'purple', name: 'Purple', hex: '#800080' },
];

// Quality options
const QUALITY_OPTIONS = [
  { id: 'draft', name: 'Draft (0.3mm)', priceMultiplier: 0.8, timeMultiplier: 0.7, description: 'Faster printing, visible layer lines' },
  { id: 'standard', name: 'Standard (0.2mm)', priceMultiplier: 1.0, timeMultiplier: 1.0, description: 'Balanced quality and speed' },
  { id: 'high', name: 'High (0.1mm)', priceMultiplier: 1.3, timeMultiplier: 1.5, description: 'Higher quality, less visible layer lines' },
  { id: 'ultra', name: 'Ultra (0.05mm)', priceMultiplier: 1.8, timeMultiplier: 2.2, description: 'Maximum quality, minimal layer lines' }
];

// Size options
const SIZE_OPTIONS = [
  { id: 'xs', name: 'XS (50%)', scale: 0.5, priceMultiplier: 0.5 },
  { id: 'sm', name: 'Small (75%)', scale: 0.75, priceMultiplier: 0.75 },
  { id: 'md', name: 'Medium (100%)', scale: 1.0, priceMultiplier: 1.0 },
  { id: 'lg', name: 'Large (125%)', scale: 1.25, priceMultiplier: 1.5 },
  { id: 'xl', name: 'XL (150%)', scale: 1.5, priceMultiplier: 2.0 },
  { id: 'xxl', name: 'XXL (200%)', scale: 2.0, priceMultiplier: 3.0 }
];

const PrintSpecifications = () => {
  const router = useRouter();
  const { id } = router.query;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Specification state
  const [material, setMaterial] = useState(MATERIALS[0].id);
  const [color, setColor] = useState(COLORS[0].id);
  const [quality, setQuality] = useState(QUALITY_OPTIONS[1].id); // Standard quality by default
  const [size, setSize] = useState(SIZE_OPTIONS[2].id); // Medium size by default
  const [quantity, setQuantity] = useState(1);
  const [infill, setInfill] = useState(20); // Default 20% infill
  const [supports, setSupports] = useState(true);
  
  // Calculated price and time
  const [totalPrice, setTotalPrice] = useState(0);
  const [printTime, setPrintTime] = useState(0);
  
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
    }
  }, [id]);
  
  // Calculate price and print time whenever specifications change
  useEffect(() => {
    if (model) {
      const selectedMaterial = MATERIALS.find(m => m.id === material);
      const selectedQuality = QUALITY_OPTIONS.find(q => q.id === quality);
      const selectedSize = SIZE_OPTIONS.find(s => s.id === size);
      
      if (selectedMaterial && selectedQuality && selectedSize) {
        // Calculate price based on base price and multipliers
        const basePrice = model.basePrice;
        const materialMultiplier = selectedMaterial.priceMultiplier;
        const qualityMultiplier = selectedQuality.priceMultiplier;
        const sizeMultiplier = selectedSize.priceMultiplier;
        const supportsMultiplier = supports ? 1.1 : 1.0; // 10% extra for supports
        const infillMultiplier = 1 + (infill - 20) / 100; // Adjust price based on infill percentage
        
        const calculatedPrice = basePrice * 
                               materialMultiplier * 
                               qualityMultiplier * 
                               sizeMultiplier * 
                               supportsMultiplier * 
                               infillMultiplier * 
                               quantity;
        
        setTotalPrice(Math.round(calculatedPrice));
        
        // Calculate print time
        const basePrintTime = model.basePrintTime;
        const timeMultiplier = selectedQuality.timeMultiplier * 
                              selectedSize.scale * 
                              (supports ? 1.15 : 1.0) * 
                              (1 + (infill - 20) / 200); // Infill affects time less than price
        
        setPrintTime(Math.round(basePrintTime * timeMultiplier * quantity));
      }
    }
  }, [model, material, quality, size, quantity, infill, supports]);
  
  const handleProceedToDelivery = () => {
    // In a real app, save specifications to state/context or backend
    // For now, just navigate to delivery page
    router.push(`/delivery/${id}?price=${totalPrice}&time=${printTime}`);
  };
  
  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!model) return <div className="container mx-auto px-4 py-8">Model not found</div>;

  return (
    <>
      <Head>
        <title>Print Specifications | Innoprint</title>
        <meta name="description" content="Customize your 3D print specifications" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">{model.title}</h1>
        <p className="text-gray-500 text-center mb-8">Customize your print specifications</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Specifications Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Material Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Material</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MATERIALS.map((mat) => (
                  <div 
                    key={mat.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${material === mat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => setMaterial(mat.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{mat.name}</span>
                      <span className="text-sm text-gray-500">{mat.priceMultiplier}x</span>
                    </div>
                    <p className="text-sm text-gray-600">{mat.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Color</h2>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((clr) => (
                  <div 
                    key={clr.id}
                    className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center ${color === clr.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: clr.hex }}
                    onClick={() => setColor(clr.id)}
                  >
                    {color === clr.id && (
                      <svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Print Quality */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Print Quality</h2>
              <div className="space-y-3">
                {QUALITY_OPTIONS.map((qual) => (
                  <div 
                    key={qual.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${quality === qual.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => setQuality(qual.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{qual.name}</span>
                      <div className="text-sm text-gray-500">
                        <span className="mr-2">Price: {qual.priceMultiplier}x</span>
                        <span>Time: {qual.timeMultiplier}x</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{qual.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Size and Quantity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Size</h2>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    {SIZE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} (Price: {option.priceMultiplier}x)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Quantity</h2>
                  <div className="flex items-center">
                    <button 
                      className="w-10 h-10 rounded-l-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    />
                    <button 
                      className="w-10 h-10 rounded-r-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium">Infill Density: {infill}%</label>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={infill}
                    onChange={(e) => setInfill(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10% (Hollow)</span>
                    <span>50% (Standard)</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="supports" 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={supports}
                    onChange={(e) => setSupports(e.target.checked)}
                  />
                  <label htmlFor="supports" className="ml-2 text-gray-700">Generate supports (recommended for complex models)</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Model</span>
                  <span>{model.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Material</span>
                  <span>{MATERIALS.find(m => m.id === material)?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Color</span>
                  <span>{COLORS.find(c => c.id === color)?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Quality</span>
                  <span>{QUALITY_OPTIONS.find(q => q.id === quality)?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Size</span>
                  <span>{SIZE_OPTIONS.find(s => s.id === size)?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Quantity</span>
                  <span>{quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Infill</span>
                  <span>{infill}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Supports</span>
                  <span>{supports ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-medium">Estimated Print Time</span>
                  <span>{printTime} Hrs</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹ {totalPrice}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleProceedToDelivery}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Proceed to Delivery
                </button>
                
                <button 
                  onClick={() => router.back()}
                  className="w-full bg-white text-blue-500 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintSpecifications;