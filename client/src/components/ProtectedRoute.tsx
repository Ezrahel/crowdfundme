import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // If auth state is still loading, render nothing or a loading indicator
  if (!isLoaded) {
    return <div>Loading authentication...</div>; // Or null
  }

  // If auth state is loaded and user is not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If auth state is loaded and user is signed in, render the nested route
  return <Outlet />;
};

export default ProtectedRoute; 