import { useContext } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { userLogin } = useContext(myContext);

  if (!userLogin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
