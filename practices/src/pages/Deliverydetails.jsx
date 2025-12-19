import { BackHistorybtn, Main } from "../components/layouts/layouts";
import {
  getSessionStorage,
  removeSessionStorage,
} from "../functions/localStorage";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useState, useEffect, lazy, Suspense } from "react";
const AddressList = lazy(() => import("../components/Addresslist.jsx"));
const DeliveryForm = lazy(() => import("../components/DeliveryForm.jsx"));
const PromoCode = lazy(() => import("../components/PromoCode.jsx"));
import { myContext } from "../components/GlobalStates/contextHooks";
const PriceSegment = lazy(() => import("../components/PriceSegment.jsx"));
const ProceedToCheckout = lazy(() => import("../components/ProceedToCheckOut"));
import { ItemVariant } from "../components/styles/style";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { priceFormatter } from "../functions/eventHandlingFn.js";

const Deliverydetails = () => {
  const { offerdetails, addressList } = useContext(myContext);
  const [offerCode, setOfferCode] = useState(() =>
    getSessionStorage("promoCode")
  );

  const location = useLocation();
  const items = Array.isArray(location.state?.products) ? location.state.products : location.state?.products ? [location.state.products] : [];
  const section = location.state?.section;
  console.log(items);

  useEffect(() => {
    const handleChange = () => {
      const promo = getSessionStorage("promoCode");
      setOfferCode(promo);
    };
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  useEffect(() => {
    let currentDate = new Date();
    if (offerdetails[0]?.promoCode[0]) {
      let expiryDate = offerdetails[0]?.promoCode[2];
      let expireAt = new Date(expiryDate);
      if (expireAt <= currentDate) {
        if (getSessionStorage("promoCode").length === 0) {
          console.log("it is already empty");
        } else {
          removeSessionStorage("promoCode");
          window.dispatchEvent(new Event("storage"));
          console.log("item got removed from session");
        }
      }
    }
  }, [offerdetails]);

  function RemoveAppliedCode() {
    removeSessionStorage("promoCode");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <>
        <BackHistorybtn />
      <Main className="lg:flex lg:flex-row  h-max py-6 lg:w-full p-2 lg:justify-between lg:items-start items-center   gap-5 flex flex-col w-full">
        <div className="flex flex-col w-full justify-between gap-4">
          <Suspense
            fallback={<CircularProgress size={100} sx={{ color: "#0c4a6e" }} />}
          >
            <DeliveryForm />
          </Suspense>
          <Suspense
            fallback={<CircularProgress size={80} sx={{ color: "#0c4a6e" }} />}
          >
            <AddressList />
          </Suspense>
        </div>

        <div className="flex flex-col w-full gap-5 h-max mt-3  lg:p-4">
          <div className="w-full flex flex-wrap   items-center gap-5 ">
            <Suspense fallback={
                <CircularProgress size={60} sx={{ color: "#0c4a6e" }} />
              }
            >
              <PromoCode />
            </Suspense>
             {offerCode === offerdetails[0]?.promoCode[0] ? (
              <AnimatePresence>
                <motion.strong
                  className="no-underline decoration-none pl-4 flex justify-start items-center w-full"
                  variant={ItemVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  Applied:
                  <p className="text-gray-400  gap-3 line-through pl-4 flex justify-start w-full font-bold text-lg">
                    {offerCode}
                    <DeleteRoundedIcon
                      sx={{ color: "#dd0000", cursor: "pointer" }}
                      onClick={RemoveAppliedCode}
                    />
                  </p>
                </motion.strong>
              </AnimatePresence>
            ) : (
              <p className="text-gray-400 pl-4 text-lg flex justify-start w-full font-bold">
                no promoCode applied yet
              </p>
            )}
          </div>
          {addressList ? (
            <div className="flex flex-row max-w p-3 bg-white  justify-between snap-x gap-10 rounded-md overflow-x-scroll shadow-inner shadow-slate-950">
              {items?.map((item,index) => (
                <div
                  className="flex flex-row gap-5 border-l-2  max-w-[25rem]  justify-end items-center  shrink-0 py-5 px-3 xs:flex-col sm:flex-col md:flex-col"
                  key={index}
                  onClick={() => console.log("hello")}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[12rem] rounded-lg h-[12rem] object-contain"
                  />
                  <div className="flex  flex-col w-full">
                    <p className="">{item.name}</p>
                    <p>₹{priceFormatter(Number(item.price).toFixed(2))}</p>
                    <p>qty:{item.qty|| item.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CircularProgress size={60} sx={{ color: "#0c4a6e" }} />
          )}
        
         

          <Suspense
            fallback={<CircularProgress size={60} sx={{ color: "#0c4a6e" }} />}
          >
            <PriceSegment products={items} />
          </Suspense>
          <span className="w-full flex justify-end ">
            <Suspense
              fallback={
                <CircularProgress size={30} sx={{ color: "#0c4a6e" }} />
              }
            >
              <ProceedToCheckout selectedItems={items} section={section} />
            </Suspense>
          </span>
        </div>
      </Main>
    </>
  );
};

export default Deliverydetails;
