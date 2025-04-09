import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for catalogue models
const MOCK_MODELS = [
  {
    id: 1,
    title: 'Model 01',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model01.jpg',
    creator: 'John Doe',
    createdAt: '2023-12-01',
    downloadCount: 120,
    printCount: 45,
    category: 'decoration'
  },
  {
    id: 2,
    title: 'Model 02',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model02.jpg',
    creator: 'Jane Smith',
    createdAt: '2023-11-15',
    downloadCount: 85,
    printCount: 32,
    category: 'art'
  },
  {
    id: 3,
    title: 'Model 03',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model03.jpg',
    creator: 'Alex Johnson',
    createdAt: '2023-10-22',
    downloadCount: 65,
    printCount: 28,
    category: 'figurine'
  },
  {
    id: 4,
    title: 'Model 04',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model01.jpg',
    creator: 'Sarah Williams',
    createdAt: '2023-09-18',
    downloadCount: 42,
    printCount: 15,
    category: 'decoration'
  },
  {
    id: 5,
    title: 'Model 05',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model02.jpg',
    creator: 'Michael Brown',
    createdAt: '2023-08-30',
    downloadCount: 98,
    printCount: 37,
    category: 'art'
  },
  {
    id: 6,
    title: 'Model 06',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model03.jpg',
    creator: 'Emily Davis',
    createdAt: '2023-07-25',
    downloadCount: 76,
    printCount: 29,
    category: 'figurine'
  },
  {
    id: 7,
    title: 'Model 07',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model01.jpg',
    creator: 'David Wilson',
    createdAt: '2023-06-20',
    downloadCount: 54,
    printCount: 21,
    category: 'gadget'
  },
  {
    id: 8,
    title: 'Model 08',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model02.jpg',
    creator: 'Olivia Martinez',
    createdAt: '2023-05-15',
    downloadCount: 112,
    printCount: 43,
    category: 'gadget'
  },
  {
    id: 9,
    title: 'Model 09',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    thumbnailUrl: '/images/model03.jpg',
    creator: 'James Taylor',
    createdAt: '2023-04-10',
    downloadCount: 89,
    printCount: 34,
    category: 'decoration'
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'decoration', name: 'Decoration' },
  { id: 'art', name: 'Art' },
  { id: 'figurine', name: 'Figurines' },
  { id: 'gadget', name: 'Gadgets' },
  { id: 'tool', name: 'Tools' }
];

// Sort options
const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'prints', name: 'Most Printed' }
];

const CataloguePage = () => {
  const [models, setModels] = useState(MOCK_MODELS);
  const [filteredModels, setFilteredModels] = useState(MOCK_MODELS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort models when filters change
  useEffect(() => {
    let result = [...models];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(model => model.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(model => 
        model.title.toLowerCase().includes(query) || 
        model.description.toLowerCase().includes(query) ||
        model.creator.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'prints':
        result.sort((a, b) => b.printCount - a.printCount);
        break;
      default:
        break;
    }
    
    setFilteredModels(result);
  }, [models, selectedCategory, sortOption, searchQuery]);

  return (
    <>
      <Head>
        <title>Catalogue | Innoprint</title>
        <meta name="description" content="Browse our collection of 3D models for printing" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Catalogue</h1>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search models..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Filter */}
            <div className="md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <p className="text-gray-600">
            Showing {filteredModels.length} of {models.length} models
          </p>
        </div>
        
        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
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
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>By {model.creator}</span>
                  <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Downloads: {model.downloadCount}</span>
                  <span>Prints: {model.printCount}</span>
                </div>
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
        
        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
        
        {/* Upload CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg mb-4">Don't see what you're looking for?</p>
          <Link 
            href="/upload"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Upload Your Own Model
          </Link>
        </div>
      </div>
    </>
  );
};

export default CataloguePage;