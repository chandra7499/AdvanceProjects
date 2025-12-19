import { OrderCard } from "./OrdersCard";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import OrderCarosels from "../../../components/carosels/OrdersCarosels";
import {
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  lazy,
  Suspense,
  useEffect
} from "react";
import { Note } from "../../../components/Note";
import { OrderNow } from "../../../components/loading";
import { myContext } from "../../../components/GlobalStates/contextHooks";
import { daysCounter } from "../../../functions/eventHandlingFn";
import { getSessionStorage } from "../../../functions/localStorage";
import { motion, AnimatePresence } from "framer-motion";
const ExchangeComponent = lazy(() => import("../orderStatus/ExchangeProducts"));
import { PopUpLoading } from "../../../components/loading";
import { usePlaceAgain, useUserOrders } from "../../../hooks/useItems";
import { DialogActions, Button } from "@mui/material";
import { toast } from "react-toastify";
import { PopUps } from "../../popUps";
import { useQueryClient } from "@tanstack/react-query";
import { setStorage,getStorage } from "../../../functions/localStorage";
const Policy = lazy(() => import("../../policies/RefundPolicy"));
import { calculateRefudableAmount} from "../../../api/getItems";
const CancleOrders = () => {
  const { PaymentStatus, setExchange, refundPolicyAccepted, Exchange, userData } =
    useContext(myContext);

  // useEffect(()=>{
  //     console.log(infoCount);
  // },[infoCount]);
  const orderRef = useRef(null);
  const { mutate: placeAgain, isPending } = usePlaceAgain();
  const queryClient = useQueryClient();
  const RefundedAmount = useRef({});



  const {
    data: CancelledProducts = [],
    isLoading: CancelledOrderLoading,
    error: CancelledOrderError,
  } = useUserOrders(userData?.uid, "cancel");

  const [infoCount, setInfoCount] = useState({});
  const [open, setOpen] = useState({});
  const [refundPolicyOpen, setRefundPolicyOpen] = useState({});

  const [nextSilde, setNextSlide] = useState(false);


  
  useEffect(()=>{
    if(getStorage("refundPolicyAccepted") === "true"){
      setNextSlide(true);
    }
  },[refundPolicyAccepted]);

  const [close, setClose] = useState(() => {
    return getSessionStorage("cancelNote") === "true";
  });

  

  const togglePopup = (orderId, bool) => {
    setOpen((prev) => ({ ...prev, [orderId]: bool }));
  };

   function contiuneBtn() {
      setStorage("refundPolicyAccepted", `${refundPolicyAccepted}`);
      setNextSlide(()=>{
        return getStorage("refundPolicyAccepted") === "true";
      });
    }


    

   



  const handleInfoCount = useCallback((orderId, count) => {
    setInfoCount((prevInfoCount) => ({
      ...prevInfoCount,
      [orderId]: count,
    }));
  }, []);



  function handleRefundPolicyFun(id, bool) {
    setRefundPolicyOpen((prev) => ({ ...prev, [id]: bool }));
  }

  
  function handlePlaceAgain(id) {
    placeAgain(
      { userId: userData?.uid, OrderId: id },
      {
        onSuccess: (data) => {
          if (data?.message) {
            toast.success(data.message);
            togglePopup(id, false);
            queryClient.invalidateQueries({
              queryKey: ["pendingOrders", userData?.uid, "cancel"],
            });
          } else if (data?.warningMessage) {
            toast.warning(data.warningMessage);
            togglePopup(id, false);
          } else {
            toast.error(data.message);
            togglePopup(id, false);
          }
        },
      }
    );
  }

  const handleExchange = useCallback((id) => {
    setExchange(true);
    orderRef.current = id;
  }, []);

  const Styles = {
    containerStyle:
      "flex flex-col w-full px-3 gap-4 bg-white pt-2   pb-1 rounded-lg relative overflow-hidden",
    buttonStyle: {
      maxWidth: "max-content",
      backgroundColor: "#003258FF",
      scale: { sm: 0.66, md: 1 },
      fontSize: { xs: 8.5, sm: 15 },
      whiteSpace: "nowrap",
      width: { sm: "40%", lg: "20%", md: "20%" },
      marginLeft: "auto",
      marginRight: "0",
    },
    itemsStyle: "flex max-w p-2 bg-white  ",
    buttonStyle2: {
      maxWidth: "max-content",
      scale: { sm: 0.66, md: 1 },
      fontSize: { xs: 8.5, sm: 15 },
      whiteSpace: "nowrap",
      width: { sm: "40%", lg: "20%", md: "20%" },
      marginLeft: "0",
      marginRight: "auto",
    },
    btnVarient2: "contained",
  };

  const filterProducts = useMemo(() => {
    return CancelledProducts;
  }, [CancelledProducts]);

  console.log(filterProducts);

  if (CancelledOrderLoading) {
    return <PopUpLoading size={80} />;
  }

  if (CancelledOrderError) {
    return <center>Error loading orders</center>;
  }
  return (
    <>
      <AnimatePresence mode="wait">
        {!close && filterProducts?.length > 0 && (
          <motion.div
            animate={close && { height: 0, opacity: 0 }}
            exit={{ height: 0 }}
            className="relative overflow-hidden  mr-auto ml-auto"
          >
            <div className="px-5 py-3">
              <Note
                containerStyle={
                  "w-full flex rounded-lg bg-yellow-600 md:px-5 xs:px-2"
                }
                paraStyle={
                  "text-center text-wrap text-white xs:text-sm md:text-lg"
                }
                info={
                  "You are allowed to deside, if you want exchange or get re-fund with in 5 working days since cancellation,other than it will get refunded automatically and non of the options will visible"
                }
                setClose={setClose}
                sessionKey={"cancelNote"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {filterProducts?.map((orderItem) => {
        const matchingStatus = PaymentStatus?.find(
          (status) => status.id === orderItem.orderId
        );
        calculateRefudableAmount(userData?.uid,orderItem?.orderId).then((amount)=>{
           RefundedAmount.current = amount;
        });
        console.log(RefundedAmount.current.finalPrice)
        console.log(orderItem?.placeOrderList)
        const cancelledDate = new Date(orderItem?.cancelledAt);
        const days = daysCounter(cancelledDate);
        const isCOD = matchingStatus?.status === "COD";
        const isPaidWithin5Days =
        matchingStatus?.status === "paid" && days <= 5;
        
        const showButton1 = isCOD || isPaidWithin5Days;
        const showButton2 = isPaidWithin5Days;
        console.log(showButton1, showButton2, days, cancelledDate);
        const btn1Label = isCOD ? "place again" : "Exchange";
        
        return (
          <div key={orderItem.orderId} className="px-5 mb-5">
            <OrderCard
              containerStyle={Styles.containerStyle}
              buttonStyle={Styles.buttonStyle}
              itemsStyle={Styles.itemsStyle}
              category={"cancel"}
              buttonVisibility1={showButton1}
              buttonVisibility2={showButton2}
              btnName1={btn1Label}
              btn1Condition={
                isPaidWithin5Days
                  ? () => handleExchange(orderItem?.orderId)
                  : () => togglePopup(orderItem?.orderId, true)
              }
              btnName2={"re-fund"}
              btn2Condition={() =>
                handleRefundPolicyFun(orderItem?.orderId, true)
              }
              buttonStyle2={Styles.buttonStyle2}
              btnVarient2={Styles.btnVarient2}
              btnVarient={"contained"}
              icon2={<PublishedWithChangesIcon />}
              status={matchingStatus?.status}
              amount={matchingStatus?.amount || "unknown"}
              orderid={orderItem.orderId}
              infoCount={infoCount[orderItem.orderId] || 0}
              products={orderItem.placeOrderList}
            >
              <OrderCarosels
                products={orderItem?.placeOrderList}
                type={"orders"}
                SlideCount={(count) =>
                  handleInfoCount(orderItem.orderId, count)
                }
                loading={false}
                error={null}
              />
            </OrderCard>
            <PopUps
              open={open[orderItem?.orderId]}
              setOpen={setOpen}
              title={"Place Again"}
              fullWidth={true}
            >
              <h2 className="flex justify-center items-center text-2xl text-wrap mb-5">
                Are you sure want to place it again? if yes please confirm
              </h2>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>cancle</Button>
                <Button
                  variant="contained"
                  loading={isPending}
                  loadingPosition="start"
                  sx={{ backgroundColor: "#013E68FF" }}
                  onClick={() => handlePlaceAgain(orderItem?.orderId)}
                >
                  confirm
                </Button>
              </DialogActions>
            </PopUps>

            <PopUps
              open={refundPolicyOpen[orderItem?.orderId]}
              setOpen={setRefundPolicyOpen}
              title={!nextSilde ? "Refund Policy" : "Amount Refundable"}
              fullWidth={true}
            >
              <Suspense fallback={<PopUpLoading size={90} />}>
                {!nextSilde ? <Policy /> : <div className=""><p>Amount:{RefundedAmount.current.finalPrice}</p></div>}
              </Suspense>
              <DialogActions className="sticky bottom-0 bg-white">
                <Button
                  onClick={() =>
                    handleRefundPolicyFun(orderItem?.orderId, false)
                  }
                >
                  cancle
                </Button>
                <Button
                  variant="contained"
                  loading={isPending}
                  disabled={!refundPolicyAccepted}
                  onClick={()=>contiuneBtn()}
                  loadingPosition="start"
                  sx={{ backgroundColor: "#013E68FF" }}
                >
                  {!nextSilde ? "continue" : "confirm"}
                </Button>
              </DialogActions>
            </PopUps>
          </div>
        );
      })}
      <div className="flex justify-center px-3">
        {!filterProducts?.length && <OrderNow />}
      </div>
      <AnimatePresence mode="wait">
        {" "}
        {Exchange && (
          <Suspense fallback={<PopUpLoading size={90} />}>
            <ExchangeComponent
              booked={filterProducts}
              orderId={orderRef.current}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(CancleOrders);
