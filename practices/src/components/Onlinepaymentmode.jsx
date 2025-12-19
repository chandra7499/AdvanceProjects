// import { Main } from "../components/layouts/layouts";
import { useEffect,useState,useContext} from "react";
import {myContext} from "../components/GlobalStates/contextHooks";
import { Main } from "../components/layouts/layouts";
// import { useOrderDetails } from "../hooks/useItems";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { updateOrders } from "../hooks/useItems"; 
import {useRefetches} from "../hooks/refetches";
// import { handleUpdatedOrderDetails } from "../hooks/useItems";

const CheckOutForm = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentState, setPaymentState] = useState("loading");
  const {userData} = useContext(myContext);
  const refetch = useRefetches();
  const order = location.state?.order;
  const section = location.state?.section;
  const selectedItems = location.state?.selectedItems;
  // const [updatedOrderDetails,setUpdatedOrderDetails] = useState(null);

  useEffect(() => {
    if (!order) return;
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Tarzon-store",
      description: "Test payment",
      order_id: order.id,
      handler: async function (response) {
        console.log("payment success", response);
        await updateOrders(response,userData.uid,section,selectedItems);
        navigate(`/checkout/${orderId}/payment-success`,{state:{status:"Payment successfull"}});
        setPaymentState("success");
        refetch(userData.uid);
      },
      modal:{
        ondismiss:function(){
        if (paymentState === "loading") {
          setPaymentState("canceled")
          navigate(`/checkout/${orderId}/payment-cancelled`,{state:{status:"Payment canceled"}});
        }}
      },
      theme: { color: "#43399cc" },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();

   

    razorpay.on("payment.failed", function (response) {
      console.error("Payment failed:", response);
      navigate(`/check/${orderId}/payment-failed`,{state:{status:"Payment failed"}});
      setPaymentState("failed");
    });

    console.log(paymentState);

    return()=>{
       razorpay.close(); 
    }
  }, [orderId]);

  return (
    <>
      <Main className="flex justify-center items-center w-full text-2xl">
        {paymentState === "loading" ? (
          <h1 className="bg-green-700 rounded-lg p-2 text-white">
            Payment gateway is loading....
          </h1>
        ) : paymentState === "success"? (
          <h1 className="bg-green-700 rounded-lg p-2 text-white">
            Payment successfull{" "}
          </h1>
        ) : paymentState === "canceled" ? (
          <h1 className="bg-yellow-700 rounded-lg p-2 text-white">
            Payment canceled
          </h1>
        ) : paymentState === "failed" ? (
          <h1 className="bg-red-700 rounded-lg p-2 text-white">
            Payment failed
          </h1>
        ) : (
          <h1 className="bg-yellow-200 rounded-lg p-2 text-white">
            An technical error occured plase try later after sometime
          </h1>
        )}
      </Main>
    </>
  );
};

export default CheckOutForm;
