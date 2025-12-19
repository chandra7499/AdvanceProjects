import { useContext} from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import { Outlet, Navigate } from "react-router-dom";



const ProtectedRoutes = () => {
  const { userLogin } = useContext(myContext);
  if(!userLogin){
    return <div>Loading...</div>
  }
 
  return userLogin ? <Outlet /> : <Navigate to="/" replace/>;
};





export default ProtectedRoutes;
