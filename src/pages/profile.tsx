import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (!currentUser) {
    if (typeof window !== 'undefined') {
      router.push('/auth/login');
    }
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>My Profile | Innoprint</title>
        <meta name="description" content="Manage your Innoprint account" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{currentUser.displayName || 'User'}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{currentUser.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p>{currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last Sign In</p>
                  <p>{currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email Verified</p>
                  <p>{currentUser.emailVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={() => router.push('/profile/change-password')}
                  className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Change Password
                </button>
                
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Log Out'}
                </button>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-6">
              <h3 className="text-lg font-semibold mb-4">My Orders</h3>
              
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-gray-500">You haven't placed any orders yet.</p>
                <button
                  onClick={() => router.push('/catalogue')}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Browse Catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;