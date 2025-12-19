import { useState, useRef, useEffect } from "react";
import { myContext } from "./contextHooks";
// import { getStorage, setStorage } from "../../functions/localStorage";
import { useAuthListener } from "../../api/auth.js";
// import products from "../JsonData/data.json";
import propType from "prop-types";
// import {useProducts} from "../../hooks/useItems";
import { usePaymentStatus } from "../../hooks/useItems";
import { getStorage } from "../../functions/localStorage";

import {
  useRealTimeProducts,
  useRealTimeCart,
  useRealTimePlaceOrder,
  useRealTimeAddresses,
  useOfferzone,
  useWishListProducts,
  placeOrderSelectionCalculations,
  useRealTimePopularProducts,
} from "../../api/getItems";
import { getCookie } from "../../functions/searchFunction.js";
import { CircularProgress } from "@mui/material";

const GlobalData = ({ children }) => {
  const user = useAuthListener();
  const { products, productsPending } = useRealTimeProducts();
  const [verifyToken, setVerifyToken] = useState();
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const [filter, setFilter] = useState([]);
  const [displayProduct, setDisplayProduct] = useState([]);
  const [AuthError, setAuthError] = useState({ type: "", text: "", cat: "" });
  const [navSlide, setNavSlide] = useState(false);
  const [returnPolicyAccepted, setReturnPolicyAccepted] = useState(false);
  const [refundPolicyAccepted, setRefundPolicyAccepted] = useState(false);
  const [userLogin, setUserLogin] = useState(!!getCookie("token"));
  const [userData, setUserData] = useState([]);
  const placeOrderList = useRealTimePlaceOrder(userData?.uid);
  const addressList = useRealTimeAddresses(userData?.uid);
  const [cartItems, setCartItems] = useState(null);
  //popular category
  const { popularCategories, loading: popularCategoryLoading } =
    useRealTimePopularProducts(userData?.uid);
  const [catVisible, setCatvisible] = useState(true);
  const offerdetails = useOfferzone();
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchItems, setSearchItems] = useState(""); //search onChange KeyStrock
  const [prevScrollY, setPrevScrollY] = useState(window.prevScrollY);
  const [finalPrice, setFinalPrice] = useState(0);
  const [paymentModeLoader, setPaymentModeLoader] = useState(false);
  const [OrderslideCount, setOrderSlideCount] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [EnquiryCallSlide, setEnquiryCallSlide] = useState(false);
  const [Exchange, setExchange] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const { products: WishListProducts } = useWishListProducts(userData?.uid);
  let [wishList, setWishList] = useState([]);

  //pending orders

  const {
    data: PaymentStatus,
    isLoading: PaymentLoading,
    error: PaymentError,
  } = usePaymentStatus(userData?.uid);
  const GlobalFilters = [
    { id: "price", name: "Price" },
    { id: "name", name: "Title" },
    { id: "rating", name: "Rating" },
  ];

  //userdata

  useEffect(() => {
    const returnPolicy = getStorage("returnPolicyAccepted");
    setReturnPolicyAccepted(returnPolicy === "true");
  }, []);

  useEffect(() => {
    const refundPolicy = getStorage("refundPolicyAccepted");
    setRefundPolicyAccepted(refundPolicy === "true");
  }, []);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      if (!userData?.uid) return;
      const totalPrice = await placeOrderSelectionCalculations(userData?.uid);
      setSelectedTotalPrice(totalPrice ?? 0);

      console.log(selectedTotalPrice);
    };
    calculateTotalPrice();
  }, [placeOrderList]);

  useEffect(() => {
    if (user === undefined) return;

    if (user) {
      setUserData(user);
      setUserLogin(!!getCookie("tarzon_client_token"));
    }
  }, [user]);

  let userId = user?.uid;

  const cartList = useRealTimeCart(userId);

  //cart list
  useEffect(() => {
    if (cartList) {
      setCartItems(cartList);
      // console.log(cartItems?.length);
    }
  }, [cartItems, cartList]);

  //Products
  useEffect(() => {
    if (products) {
      setDisplayProduct(products);
    }
  }, [products, setDisplayProduct]);

  // useEffect(() => {
  //   setStorage("orders", selectedItems);
  // }, [selectedItems]);

  useEffect(() => {
    if (WishListProducts) {
      setWishList(WishListProducts);
      console.log(wishList);
    }
  }, [WishListProducts]);

  useEffect(() => {
    const checkAuth = () => {
      setUserLogin(!!getCookie("tarzon_client_token"));
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    if ((filter?.length > 0 && filter !== "") || Exchange) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [filter, Exchange]);

  const loginPopUp = useRef(null);
  const [FeedFormPopUp, setFeedFormPopUp] = useState(false);
  const dialogMotion = useRef(null);
  console.log(popularCategories);

  if (user === undefined) return <CircularProgress />;
  return (
    <>
      <myContext.Provider
        value={{
          // items,
          // setItems,
          userLogin,
          setUserLogin,
          filter,
          setFilter,
          loginPopUp,
          OrderslideCount,
          setOrderSlideCount,
          finalPrice,
          setFinalPrice,
          PaymentStatus,
          PaymentLoading,
          PaymentError,
          verifyToken,
          setSelectedTotalPrice,
          paymentDetails,
          setPaymentDetails,
          setVerifyToken,
          uniqueCategories,
          setUniqueCategories,
          displayProduct,
          EnquiryCallSlide,
          productsPending,
          addressList,
          searchItems,
          setSearchItems,
          GlobalFilters,
          popularCategories,
          popularCategoryLoading,
          refundPolicyAccepted,
          setRefundPolicyAccepted,
          setDisplayProduct,
          AuthError,
          selectedTotalPrice,
          setAuthError,
          navSlide,
          wishList,
          setWishList,
          returnPolicyAccepted,
          setReturnPolicyAccepted,
          setFeedFormPopUp,
          paymentModeLoader,
          setPaymentModeLoader,
          setNavSlide,
          userData,
          Exchange,
          setExchange,
          offerdetails,
          placeOrderList,
          catVisible,
          setEnquiryCallSlide,
          setCatvisible,
          prevScrollY,
          cartItems,
          dialogMotion,
          totalPrice,
          FeedFormPopUp,
          setTotalPrice,
          setPrevScrollY,
        }}
      >
        {children}
      </myContext.Provider>
    </>
  );
};

GlobalData.propTypes = { children: propType.node.isRequired };

export { GlobalData };
