import { Navigate } from "react-router-dom";

import { useAppSelector } from "../../store/hooks";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, authChecked } = useAppSelector(
    (state) => state.auth
  );

  // Still checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <>{children}</>;
};