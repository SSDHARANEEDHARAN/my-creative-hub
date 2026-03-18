import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const localReturnTo = localStorage.getItem("authReturnTo");
    const returnTo = params.get("returnTo") || localReturnTo || "/services";
    const error = params.get("error");

    // Clean up
    localStorage.removeItem("authReturnTo");

    if (error) {
      navigate(`/login?error=auth&returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
      return;
    }

    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
  }, [location.search, navigate]);

  return <LoadingSpinner />;
};

export default AuthCallbackPage;
