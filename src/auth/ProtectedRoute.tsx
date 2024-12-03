// ProtectedRoute.tsx

import { useAuth0 } from "@auth0/auth0-react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;

};

export default ProtectedRoute;

// is authenticated, display Outlet/ all child routes, 
// not authenticated navigate them to homepage
// client side, authentication always false therefore push us to the homepage
 // to="/" is the Homepage