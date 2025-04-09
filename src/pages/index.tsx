import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  // Mock data for featured models
  const featuredModels = [
    {
      id: 1,
      title: 'Model 01',
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      thumbnailUrl: '/images/model01.jpg'
    },
    {
      id: 2,
      title: 'Model 02',
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      thumbnailUrl: '/images/model02.jpg'
    },
    {
      id: 3,
      title: 'Model 03',
      description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      thumbnailUrl: '/images/model03.jpg'
    }
  ];

  return (
    <>
      <Head>
        <title>Innoprint - 3D Printing Service</title>
        <meta name="description" content="Upload your 3D models and get high-quality prints delivered to your doorstep" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-100 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              Bring Your Imagination to Life with <span className="text-blue-800">Innoprint</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Upload your 3D models and let us craft high-quality, custom 3D printed creations just for you. From prototypes to artistic designs, we turn your ideas into reality with precision and speed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/explore" className="bg-white text-blue-500 px-6 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors">
                Explore more
              </Link>
              <Link href="/upload" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors">
                Upload model
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image 
              src="/images/hero-image.jpg" 
              alt="3D Printing Process" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Models</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <div key={model.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image 
                    src={model.thumbnailUrl} 
                    alt={model.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{model.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                  <Link 
                    href={`/model/${model.id}`}
                    className="block text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/catalogue"
              className="inline-block bg-white text-blue-500 px-6 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
            >
              Explore more
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Get your 3D models printed in just a few simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-xl mb-2">Upload Your Model</h3>
              <p className="text-gray-600">Upload your 3D model file in STL, OBJ, or other supported formats.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-xl mb-2">Customize Your Order</h3>
              <p className="text-gray-600">Choose materials, size, color, and other specifications for your print.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-xl mb-2">Receive Your Print</h3>
              <p className="text-gray-600">We'll print your model and deliver it to your doorstep or you can pick it up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to bring your ideas to life?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Start by uploading your 3D model or browse our catalogue for inspiration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/upload"
              className="bg-white text-blue-500 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Upload Your Model
            </Link>
            <Link 
              href="/catalogue"
              className="bg-transparent text-white px-6 py-3 rounded-md border border-white hover:bg-blue-600 transition-colors"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;