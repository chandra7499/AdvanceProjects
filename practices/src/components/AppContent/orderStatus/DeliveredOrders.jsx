import { OrderCard } from "./OrdersCard";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import OrderCarosels from "../../../components/carosels/OrdersCarosels";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  lazy,
  Suspense,
} from "react";
import { OrderNow, PopUpLoading } from "../../../components/loading";
import { myContext } from "../../../components/GlobalStates/contextHooks";
import { daysCounter } from "../../../functions/eventHandlingFn";
import { Note } from "../../Note";
import Dialog from "@mui/material/Dialog";
import { getSessionStorage, getStorage } from "../../../functions/localStorage";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { PopUps } from "../../popUps";
import { DialogActions, Button, DialogContent } from "@mui/material";
import { Inputs } from "../../layouts/layouts";
import { setStorage } from "../../../functions/localStorage";
const BuyAgainCom = lazy(() => import("./BuyAgain"));
const Policy = lazy(() => import("../../policies/ReturnPolicy"));
const ReasonSelection = lazy(() => import("../../policies/ReasonSelection"));
const ExchangeComponent = lazy(()=>import("../orderStatus/ExchangeProducts"));
import { useUserOrders} from "../../../hooks/useItems";



const DeliveredOrders = () => {
  const {  
    PaymentStatus,
    returnPolicyAccepted,
    EnquiryCallSlide,
    setExchange,
    Exchange,
    userData,
  } = useContext(myContext);

  const [infoCount, setInfoCount] = useState({});
  const [BuyAgainOpen, setOpenBuyAgain] = useState(null);
  const [switchOpenOrderId, setSwitchOpenOrderId] = useState(null);
  const [nextSlide, setNextSlide] = useState(false);
  const [changeSwitch, setChangeSwitch] = useState("choose");
  const [close, setClose] = useState(
    () => getSessionStorage("deliverNote") === "true"
  );

  const amountRef = useRef(0);
  const orderRef = useRef(null);

    const {
    data:DeliveredProducts=[],
    isLoading: DeliveredOrderLoading,
    error: DeliveredOrderError,
  } = useUserOrders(userData?.uid,"delivered");

  function contiuneBtn() {
    setStorage("returnPolicyAccepted", `${returnPolicyAccepted}`);
    setNextSlide(true);
  }
  const [policyApperence, setPolicyApperence] = useState(false);
  const orderDetails = useRef(null);

  const handleSwitchBack = useCallback(
    (e) => setChangeSwitch(e.target.value),
    []
  );

  const handleSwitchOpen = useCallback((orderId) => {
    setSwitchOpenOrderId(orderId);
  }, []);

  const BuyAgain = useCallback((orderId, amount, orderItem) => {
    amountRef.current = amount;
    orderDetails.current = orderItem?.placeOrderList;
    setOpenBuyAgain(orderId);
  }, []);

  const handleClose = useCallback(() => {
    setPolicyApperence(false);
    setSwitchOpenOrderId(null);
    setNextSlide(false);
    setChangeSwitch("choose");
  }, []);

  const handleReturn = useCallback(() => {
    setPolicyApperence(true);
    const isAccepted = getStorage("returnPolicyAccepted");
    console.log(isAccepted);
    setNextSlide(isAccepted);
  }, []);

  const handleInfoCount = useCallback((orderId, count) => {
    setInfoCount((prev) => ({ ...prev, [orderId]: count }));
  }, []);

  const handleExchage = (id) => {
    setExchange(true);
    orderRef.current = id;
  };

  // Styles object moved outside render for consistency & immutability
  const Styles = {
    containerStyle:
      "flex flex-col w-full px-3 gap-4 bg-white pt-2 pb-1 rounded-lg relative overflow-hidden",
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
    itemsStyle: "flex max-w p-2 bg-white",
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

  const deliveredProducts =useMemo(() =>( 
     DeliveredProducts
  ),[DeliveredProducts]);

  if (DeliveredOrderLoading) {
    return (
      <PopUpLoading size={80} />
    );
  }


  if (DeliveredOrderError) {
    return <center>Error loading orders</center>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!close && deliveredProducts?.length > 0 && (
          <motion.div
            className="overflow-hidden ml-auto mr-auto"
            animate={close ? { height: 0, opacity: 0 } : {}}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: easeInOut }}
            onAnimationComplete={() => close && setClose(true)}
          >
            <div className="px-5 py-3 ml-auto mr-auto relative">
              <Note
                containerStyle="flex px-3 gap-2 bg-yellow-600 rounded-lg"
                paraStyle="text-wrap text-white text-center font-medium"
                info="you are allowed to reture the deliverd products within 7 days after deliverd if more than 7 days return option will disappere"
                setClose={setClose}
                sessionKey="deliverNote"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {deliveredProducts?.map((orderItem) => {
        const matchingStatus = PaymentStatus?.find(
          (status) => status.id === orderItem.orderId
        );
        const days = daysCounter(orderItem?.deliverdAt);
        return (
          <div key={orderItem.orderId} className="px-5">
            <OrderCard
              containerStyle={Styles.containerStyle}
              buttonStyle={Styles.buttonStyle}
              category="Delivered"
              itemsStyle={Styles.itemsStyle}
              buttonVisibility1={true}
              buttonVisibility2={days > 7 ? false : true}
              btnName1="Buy again"
              btn1Condition={() =>
                BuyAgain(orderItem?.orderId, matchingStatus?.amount, orderItem)
              }
              btnName2="switch back"
              btn2Condition={() => handleSwitchOpen(orderItem.orderId)}
              buttonStyle2={Styles.buttonStyle2}
              btnVarient2={Styles.btnVarient2}
              btnVarient="contained"
              icon2={<LocalMallIcon />}
              status={matchingStatus?.status || "unknown"}
              amount={matchingStatus?.amount || "unknown"}
              orderid={orderItem.orderId}
              infoCount={infoCount[orderItem.orderId] || 0}
              products={orderItem.placeOrderList}
            >
              <OrderCarosels
                products={orderItem.placeOrderList}
                type="orders"
                SlideCount={(count) =>
                  handleInfoCount(orderItem.orderId, count)
                }
                loading={false}
                error={null}
              />
            </OrderCard>

            <Dialog
              open={BuyAgainOpen === orderItem?.orderId}
              sx={{ width: "100%", transition: "all 0.2s ease-in-out" }}
              onClose={() => setOpenBuyAgain(null)}
              disableEnforceFocus
              disableRestoreFocus
            >
              <div className="flex justify-center flex-col">
                <Suspense
                  fallback={
                    <CircularProgress size={60} sx={{ color: "#0c4a6e" }} />
                  }
                >
                  <BuyAgainCom selectedItems={orderDetails.current} />
                </Suspense>
              </div>
            </Dialog>

            <PopUps
              open={switchOpenOrderId === orderItem.orderId}
              disableScrollLock={false}
              sx={{ width: "100%", transition: "all 0.2s ease-in-out" }}
              setOpen={handleClose}
              title={
                !policyApperence
                  ? "switch back"
                  : nextSlide && !EnquiryCallSlide
                  ? "Reasons"
                  : EnquiryCallSlide && "Return Enquire Call"
              }
              fullWidth={false}
            >
              <DialogContent>
                {!policyApperence ? (
                  <div className="flex max-w px-8 justify-center gap-8">
                    {["Exchange", "Return"].map((value) => (
                      <span
                        key={value}
                        className={`flex gap-2 rounded-md h-max p-2 mb-5 ${
                          value === "Return" ? "ring-1" : ""
                        }`}
                        style={{
                          boxShadow: "3px 3px 15px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        <Inputs
                          className="accent-sky-900 w-5 cursor-pointer"
                          type="radio"
                          name="switch"
                          value={value}
                          onChange={handleSwitchBack}
                        />
                        {value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Suspense
                    fallback={
                      <CircularProgress
                        size={60}
                        sx={{
                          color: "#0c4a6e",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      />
                    }
                  >
                    {nextSlide ? (
                      <ReasonSelection
                        handleClose={handleClose}
                        orderId={switchOpenOrderId}
                      />
                    ) : (
                      <Policy />
                    )}
                  </Suspense>
                )}
              </DialogContent>

              {!nextSlide && (
                <DialogActions>
                  {
                    <Button variant="text" onClick={handleClose}>
                      Cancel
                    </Button>
                  }
                  {!policyApperence ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#0c4a6e" }}
                      disabled={changeSwitch === "choose"}
                      loading={policyApperence}
                      loadingPosition="start"
                      onClick={
                        changeSwitch === "Exchange"
                          ? () => handleExchage(orderItem?.orderId)
                          : changeSwitch === "Return"
                          ? handleReturn
                          : null
                      }
                    >
                      {changeSwitch}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={returnPolicyAccepted ? false : true}
                      onClick={() => {
                        if (!nextSlide) contiuneBtn();
                      }}
                      sx={{ backgroundColor: "#0c4a6e" }}
                    >
                      continue
                    </Button>
                  )}
                </DialogActions>
              )}
            </PopUps>
          </div>
        );
      })}

      {!deliveredProducts?.length && (
        <div className="flex justify-center px-3">
          <OrderNow />
        </div>
      )}
      <AnimatePresence mode="wait">
        {Exchange && (
          <Suspense fallback={<PopUpLoading size={80}/>}>
          <ExchangeComponent
            booked={deliveredProducts}
            orderId={orderRef.current}
          />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(DeliveredOrders);
