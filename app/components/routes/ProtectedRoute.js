import { useEffect } from "react";
import { useAuthState } from "../../../contexts/auth.context";

const isBrowser = () => typeof window !== "undefined";

export const ProtectedRoute = ({ router, children }) => {
  const auth = useAuthState();

  useEffect(() => {
    if (isBrowser() && !auth.isAuthenticated) {
      router.push("/login");
    }

    if (isBrowser() && auth.isAuthenticated) {
      // router.push("/mantenimiento/datos-empresa"); //! DESCOMENTAR
    }
  }, []);

  return children;
};
