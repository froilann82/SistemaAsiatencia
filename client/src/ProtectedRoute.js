import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { loading, isAuthenticathed } = useAuth();
  const location = useLocation(); 

  
  if (loading) {
    return <h1>Cargando...</h1>;
  }

 
  if (!isAuthenticathed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

 
  return <Outlet />;
};

export default ProtectedRoute;
