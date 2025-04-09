import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, Html, Loader } from '@react-three/drei';
import * as THREE from 'three';

// Mock data for model details
const MOCK_MODELS = {
  '1': {
    id: 1,
    title: 'Model 01',
    description: 'This is a detailed 3D model of a spherical object with bubbles. Perfect for decorative purposes or educational displays.',
    creator: 'John Doe',
    createdAt: '2023-12-01',
    fileUrl: '/models/model01.glb',
    thumbnailUrl: '/images/model01.jpg',
    downloadCount: 120,
    printCount: 45,
    estimatedPrintTime: '8 Hrs',
    basePrice: 800
  },
  '2': {
    id: 2,
    title: 'Model 02',
    description: 'A detailed skull model with intricate patterns. Great for artistic projects or Halloween decorations.',
    creator: 'Jane Smith',
    createdAt: '2023-11-15',
    fileUrl: '/models/model02.glb',
    thumbnailUrl: '/images/model02.jpg',
    downloadCount: 85,
    printCount: 32,
    estimatedPrintTime: '12 Hrs',
    basePrice: 1200
  },
  '3': {
    id: 3,
    title: 'Model 03',
    description: 'A minimalist figurine model with smooth surfaces. Perfect for modern home decor or collectibles.',
    creator: 'Alex Johnson',
    createdAt: '2023-10-22',
    fileUrl: '/models/model03.glb',
    thumbnailUrl: '/images/model03.jpg',
    downloadCount: 65,
    printCount: 28,
    estimatedPrintTime: '6 Hrs',
    basePrice: 600
  }
};

// 3D Model component with error handling
function Model({ url, modelId }: { url: string, modelId: string }) {
  const [modelError, setModelError] = useState(false);
  
  // Create a fallback component for error states
  const ErrorFallback = () => (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
      <Html position={[0, 0, 0]}>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px', width: '200px', textAlign: 'center' }}>
          Loading model...
        </div>
      </Html>
    </mesh>
  );

  // Reset error state when model ID changes
  useEffect(() => {
    setModelError(false);
  }, [modelId]);

  // Verify model URL before loading
  useEffect(() => {
    // Check if URL is valid
    if (!url || typeof url !== 'string' || !url.endsWith('.glb')) {
      console.error('Invalid model URL:', url);
      setModelError(true);
    }
  }, [url]);

  // If model URL is invalid, show error
  if (modelError) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 0, 0]}>
          <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px', width: '200px', textAlign: 'center' }}>
            Invalid model URL: {url ? url.split('/').pop() : 'undefined'}
          </div>
        </Html>
      </mesh>
    );
  }

  // Use a safer approach with Suspense
  return (
    <Suspense fallback={<ErrorFallback />}>
      <ModelLoader url={url} modelId={modelId} setModelError={setModelError} />
    </Suspense>
  );
}

// Separate component to handle the actual model loading
function ModelLoader({ url, modelId, setModelError }: { url: string, modelId: string, setModelError: (error: boolean) => void }) {
  // Set the decoder path for Draco compression
  useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  
  // Log the URL being loaded
  console.log('Attempting to load model from URL:', url);
  
  // Validate URL before proceeding
  if (!url || typeof url !== 'string') {
    console.error('Invalid model URL provided to ModelLoader:', url);
    setModelError(true);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 0, 0]}>
          <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px', width: '200px', textAlign: 'center' }}>
            Invalid model URL provided
          </div>
        </Html>
      </mesh>
    );
  }
  
  // Preload the model
  useEffect(() => {
    try {
      // Clear any previously loaded models first
      useGLTF.clear(url);
      
      // Preload with binary flag
      console.log('Preloading model:', url, 'for model ID:', modelId);
      useGLTF.preload(url, true);
    } catch (error) {
      console.error('Error preloading model:', error);
      setModelError(true);
    }
    
    // Cleanup
    return () => {
      try {
        console.log('Clearing model cache for:', url);
        useGLTF.clear(url);
      } catch (error) {
        console.error('Error clearing model cache:', error);
      }
    };
  }, [url, modelId, setModelError]); // Add modelId as dependency to ensure reloading
  
  // Use try-catch to handle loading errors
  try {
    // Load the model with binary flag
    console.log('Loading model with GLTF:', url);
    const { scene } = useGLTF(url, true);
    
    // Log successful scene loading
    console.log('Model scene loaded successfully:', scene ? 'Scene loaded' : 'No scene');
    
    // Clone the scene to avoid issues with reusing the same object
    const clonedScene = useMemo(() => {
      return scene ? THREE.Object3D.prototype.clone.call(scene) : null;
    }, [scene]);
    
    if (!clonedScene) {
      console.error('Failed to clone scene for model:', url);
      throw new Error('Failed to clone scene');
    }
    
    return <primitive object={clonedScene} scale={1.5} />;
  } catch (error) {
    console.error('Error loading model:', error, 'URL:', url);
    // Report error back to parent component
    setModelError(true);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 0, 0]}>
          <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px', width: '200px', textAlign: 'center' }}>
            Error loading model: {url.split('/').pop()}
          </div>
        </Html>
      </mesh>
    );
  }
}

const ModelPreview = () => {
  const router = useRouter();
  const { id } = router.query;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // This key will force the component to remount when the ID changes
  const componentKey = useMemo(() => `model-${id}`, [id]);
  
  useEffect(() => {
    // Reset state when ID changes
    setLoading(true);
    setError('');
    setModel(null);
    
    if (id) {
      // In a real app, fetch model data from API
      // For now, use mock data
      console.log('Current model ID:', id);
      const modelId = id as string;
      
      // Clear any previously loaded models to prevent caching issues
      Object.keys(MOCK_MODELS).forEach(key => {
        const modelUrl = MOCK_MODELS[key].fileUrl;
        try {
          useGLTF.clear(modelUrl);
        } catch (error) {
          console.error('Error clearing model cache:', error);
        }
      });
      
      // Check if the model ID exists in our mock data
      if (Object.prototype.hasOwnProperty.call(MOCK_MODELS, modelId)) {
        const modelData = MOCK_MODELS[modelId];
        console.log('Loading model data for ID:', modelId, modelData);
        setModel(modelData);
      } else {
        console.error('Model not found for ID:', modelId);
        setError(`Model not found for ID: ${modelId}`);
      }
      setLoading(false);
    }
  }, [id]);

  const handlePrintOrder = () => {
    router.push(`/print-specifications/${id}`);
  };

  const handleDownload = () => {
    // In a real app, implement download functionality
    alert('Download started!');
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (!model) return <div className="container mx-auto px-4 py-8">Model not found</div>;

  return (
    <>
      <Head>
        <title>{model.title} | Innoprint</title>
        <meta name="description" content={model.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Model Preview</h1>
        <p className="text-gray-500 text-center mb-8">{model.fileUrl.split('/').pop()}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Model Viewer */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
            <div className="h-[500px] w-full">
              {/* Use the componentKey to force re-render when model changes */}
              <Canvas key={`canvas-${model.id}`} camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Stage environment="city" intensity={0.6}>
                  <Model url={model.fileUrl} modelId={id as string} />
                </Stage>
                <OrbitControls autoRotate />
              </Canvas>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Order ID</span>
                <span>123456789098{model.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Estimated Printing Time</span>
                <span>{model.estimatedPrintTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Customize Order</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹ {model.basePrice}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handlePrintOrder}
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
              >
                Checkout
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
        
        {/* Model Details */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Model Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">{model.title}</h3>
              <p className="text-gray-600 mb-4">{model.description}</p>
              
              <div className="space-y-2">
                <p><span className="font-medium">Created by:</span> {model.creator}</p>
                <p><span className="font-medium">Date:</span> {model.createdAt}</p>
                <p><span className="font-medium">Downloads:</span> {model.downloadCount}</p>
                <p><span className="font-medium">Prints:</span> {model.printCount}</p>
              </div>
              
              <button 
                onClick={handleDownload}
                className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Model
              </button>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Printing Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Recommended Materials</h4>
                  <p className="text-gray-600">PLA, ABS, PETG</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Estimated Print Time</h4>
                  <p className="text-gray-600">{model.estimatedPrintTime} at standard quality</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Dimensions</h4>
                  <p className="text-gray-600">10cm x 10cm x 10cm (default size)</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Print Settings</h4>
                  <p className="text-gray-600">Layer Height: 0.2mm, Infill: 20%, Supports: Recommended</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelPreview;