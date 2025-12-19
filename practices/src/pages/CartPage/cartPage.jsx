import { lazy, Suspense } from "react";
const CartItems = lazy(() => import("../../components/AppContent/cartItems.jsx"));
import  CircularProgress  from "@mui/material/CircularProgress";
import { BackHistorybtn } from "../../components/layouts/layouts.jsx";


const cartPage = () => {
  return (
    <>
      <BackHistorybtn/>
      <Suspense fallback={<CircularProgress size={60} sx={{color:"#0c4a6e"}}/>}>
        <CartItems />
      </Suspense>
    </>
  );
};

export default cartPage;
