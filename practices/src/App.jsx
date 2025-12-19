import { NavBar } from "./components/NavBar/NavBar";
import CartPage from "./pages/CartPage/cartPage.jsx";
import { Home } from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import { Category } from "./pages/SpecificCategory/Category";
import { Login } from "./components/AppContent/authentication/login";
import About from "./pages/about/about";
import Order from "./pages/orders/ordersPage";
import { ToastContainer, toast } from "react-toastify";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import "./App.css";
import { SideBar } from "./components/sidebar/SideBar";
import ToggleSider from "./components/sidebar/toggleSider.jsx";
import { useContext, useEffect } from "react";
import { myContext } from "./components/GlobalStates/contextHooks.js";
import Deliverydetails from "./pages/Deliverydetails.jsx";
import FeedBackForm from "./components/FeedbackForm";
import { PaymentOnlineMode } from "./pages/OnlineModePayment";
import WishList from "./pages/whisList/WishList.jsx";
import {
  CanclePaymentState,
  NotFoundAnimation,
  SuccessPaymentState,
} from "./components/loading";
import { useOnlineStatus } from "./hooks/refetches.js";
import UserDetails from "./components/UserSection/userDetails.jsx";
import ProductsView from "./components/productsView/ProductsView.jsx";
import { WishListSkeleton } from "./components/loading";
import ScrollRestoration from "./components/features/ScrollRestoration.jsx";
import SearchSelection from "./components/AppContent/search/SearchSelectionPanal.jsx";

function App() {
  const { setNavSlide, catVisible, wishList } = useContext(myContext);
  function sideToggle() {
    setNavSlide((prev) => !prev);
  }

  const isOnline = useOnlineStatus();
  useEffect(() => {
    if (!isOnline) {
      toast.error("You are offline");
    } else {
      toast.success("You back to online");
    }
  }, [isOnline]);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        theme="dark"
        role="alert"
        className="w-full px-5 rounded-xl md:w-full scale-[1.1] md:scale-[1]"
      />

      <NavBar />

      <ToggleSider
        event={() => sideToggle()}
        sx={{
          position: "fixed",
          background: "#4545",
          backdropFilter: "blur(12px)",
          color: "navy",
          fontSize: 40,
          zIndex: 20,
          top: 82,
          left: !catVisible ? -40 : -10,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          transform: `rotate(0deg)`,
          display: { lg: "none" },
          transition: "all 0.2s ease-in-out",
        }}
      />

      <main className="flex  w-full scroll-smooth ">
        <SideBar />

        <FeedBackForm />

        <section className="flex-1 w-full mt-[50px] gap-5   md:mt-16 relative ">
          <Login />
         <ScrollRestoration />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Category />} />
            <Route path="/productView/:id" element={<ProductsView />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchSelection />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/orders" element={<Order />} />
              <Route path="/cartItems" element={<CartPage />} />
              <Route path="/delivery-details" element={<Deliverydetails />} />
              <Route path="/userProfile/:userid" element={<UserDetails />} />
              <Route
                path="/wishList"
                element={wishList ? <WishList /> : <WishListSkeleton />}
              />
              <Route path="/checkout/:orderId" element={<PaymentOnlineMode />}>
                <Route
                  path="/checkout/:orderId/payment-cancelled"
                  element={<CanclePaymentState />}
                />
                <Route
                  path="/checkout/:orderId/payment-success"
                  element={<SuccessPaymentState />}
                />
                <Route
                  path="/checkout/:orderId/payment-failed"
                  element={<CanclePaymentState />}
                />
              </Route>
            </Route>
            <Route path="/*" element={<NotFoundAnimation />} />
          </Routes>
        </section>
      </main>
    </>
  );
}

export default App;
