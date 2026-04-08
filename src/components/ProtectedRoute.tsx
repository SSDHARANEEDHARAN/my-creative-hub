import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireApproved = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, userStatus } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ returnPath: location.pathname }} replace />;
  }

  // Blocked users cannot access any protected content
  if (userStatus === "blocked") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Account Blocked</h1>
          <p className="text-muted-foreground mb-4">
            Your account has been blocked. Contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Contact the site administrator if you need admin access.
          </p>
        </div>
      </div>
    );
  }

  if (requireApproved && !isAdmin && userStatus !== "approved") {
    const isRestricted = userStatus === "restricted" || userStatus === "rejected";

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {isRestricted ? "Account Restricted" : "Approval Pending"}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isRestricted
              ? "Your account has been restricted by the administrator. Please contact support for assistance."
              : "Your account is awaiting admin approval. You'll be able to access this content once approved."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
