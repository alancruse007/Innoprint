import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/auth/login');
    }
  }, [currentUser, loading, router]);

  // Show loading or nothing while checking authentication
  if (loading || !currentUser) {
    return <div className="container mx-auto px-4 py-8 flex justify-center">Loading...</div>;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;