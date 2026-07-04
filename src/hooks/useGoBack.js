import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useGoBack = (fallback) => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.state?.canGoBack && location.key !== "default") {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }, [location, navigate, fallback]);
};

export default useGoBack;
