import { lazy, Suspense } from "react";
const CheckOutForm = lazy(() => import("../components/Onlinepaymentmode.jsx"));
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { Main } from "../components/layouts/layouts";
import { useState, useEffect, useContext } from "react";
import { myContext } from "../components/GlobalStates/contextHooks.js";
import { NotFoundAnimation } from "../components/loading";
import { usePaymentIdVerification } from "../hooks/useItems.js";

import axios from "axios";
import WarningsPopUps from "../components/warningsPopUps.jsx";
const api_url = import.meta.env.VITE_API_BASE_URL;

export const PaymentOnlineMode = () => {
  const location = useLocation();
  const [Message, setMessage] = useState("");
  const [warningState, setWarningState] = useState(null);
  const { orderId: orderIdParams } = useParams();
  const { userData } = useContext(myContext);
  const orderID = location.state?.order?.id || orderIdParams;
  const status = location.state?.status;
  console.log(status);
  const { mutate: PaymentsIdVerifying } = usePaymentIdVerification();

  const [validateOrderId, setValidateOrderId] = useState(null);

  function NavigateToDetailsPage(){
    window.history.go(-4);
  }

  // useEffect(()=>{
  //   if (status === "Payment successfull") {
  //     const timer = setTimeout(()=>{
  //        navigate("/orders/Pending-orders");
  //     },3500)
  //     return () => clearTimeout(timer);
  //   }
  // },[status])

  useEffect(() => {
    const verifyOrderId = async () => {
      if (!orderID || !userData) return;
      try {
        const res = await axios.get(
          `${api_url}/get-order/${orderID}`
        );
        if (res?.data && res.data?.id === orderID) {
          console.log(res?.data);
          PaymentsIdVerifying(
            { paymentDetails: res?.data, userId: userData?.uid },
            {
              onSuccess: (data) => {
                if (data?.posted) {
                  console.log("order id posted", data?.message);
                } else {
                  console.log("order id not posted", data?.message);
                  if (data?.orderID === "duplicate") {
                    setMessage(data?.message);
                    setWarningState(true);
                  }
                }
              },
            }
          );
          setValidateOrderId(true);
        } else {
          setValidateOrderId(false);
        }
      } catch (err) {
        console.log("err:in orderId getting", err);
        setValidateOrderId(false);
      }
    };

    verifyOrderId();
  }, [PaymentsIdVerifying, orderID, userData]);
  const navigate = useNavigate();
  if (validateOrderId === null) {
    return <CircularProgress />;
  }

  if (!validateOrderId) return <NotFoundAnimation></NotFoundAnimation>;
  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        {!warningState && <CheckOutForm />}
        <Main className="flex flex-col justify-center items-center gap-6 w-full">
          {!warningState ? (
            <Outlet />
          ) : warningState === null ? (
            <CircularProgress />
          ) : null}
          {status === "Payment canceled" || status === "Payment failed" ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0c4a6c", margin: 10 }}
              onClick={NavigateToDetailsPage}
            >
              Try again
            </Button>
          ) : (
            status === "Payment successfull" && (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#0c4a6c", margin: 10, fontSize: 10 }}
                onClick={() => navigate("/orders?section=pending-orders")}
              >
                Go to order page
              </Button>
            )
          )}

          {warningState && (
            <WarningsPopUps
              naviagationUrl="cartItems"
              naviagationUrl2="delivery-details"
              message={Message}
              title="Warning"
            />
          )}
        </Main>
      </Suspense>
    </>
  );
};
