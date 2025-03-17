import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    // Add a timeout to prevent infinite loading
    React.useEffect(() => {
      const timer = setTimeout(() => {
        console.log("Loading timeout reached, forcing navigation to login");
        window.location.href = "/login";
      }, 15000); // 15 seconds timeout - increased to give more time

      return () => clearTimeout(timer);
    }, []);

    console.log("ProtectedRoute - Loading state", { user, userRole });

    // If we have a user but are still loading, it's likely just waiting for the profile
    // In this case, we can proceed with a default role to prevent getting stuck
    if (user && loading) {
      // Only allow proceeding with default role if no specific roles are required
      // or if we're on a non-restricted route
      if (requiredRoles.length === 0) {
        console.log(
          "User exists but still loading, proceeding with non-restricted route",
        );
        return <>{children}</>;
      } else {
        console.log(
          "User exists but still loading on restricted route, showing loading",
        );
      }
    }

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (requiredRoles.length > 0) {
    console.log("Checking required roles:", { requiredRoles, userRole });

    if (!userRole) {
      console.warn("User role is not set but required for this route");
      return <Navigate to="/unauthorized" replace />;
    }

    if (!requiredRoles.includes(userRole)) {
      console.warn(
        `User role ${userRole} does not match required roles: ${requiredRoles.join(", ")}`,
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
