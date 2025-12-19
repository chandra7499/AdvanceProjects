import { useContext, useState,memo } from "react";
import { OrderCard } from "./OrdersCard";
import OrderCarosels from "../../../components/carosels/OrdersCarosels";
import { PopUps } from "../../../components/popUps";
import { useCancelOrder } from "../../../hooks/useItems";
import { myContext } from "../../../components/GlobalStates/contextHooks";
import { OrderNow, PopUpLoading } from "../../../components/loading";
import { Note } from "../../../components/Note";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { daysCounter } from "../../../functions/eventHandlingFn";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionStorage } from "../../../functions/localStorage";
import { ItemVariant } from "../../styles/style";
import { useUserOrders } from "../../../hooks/useItems";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const PendingOrders = () => {
  const {
    PaymentStatus,
    userData,
  } = useContext(myContext);

   const {
    data:PendingProducts=[],
    isLoading: pendingOrderLoading,
    error: pendingOrderError,
  } = useUserOrders(userData?.uid,"pending");

  const queryClient = useQueryClient();

  const [infoCount, setInfoCount] = useState({});
  const [open, setOpen] = useState({});
  const [close, setClose] = useState(() => {
    return getSessionStorage("pendingOrdersNote") === "true";
  });



  const handleInfoCount = (orderId, count) => {
    setInfoCount((prev) => ({ ...prev, [orderId]: count }));
  };

  const togglePopup = (orderId, bool) => {
    setOpen((prev) => ({ ...prev, [orderId]: bool }));
  };

  const { mutate: handleCancellation, isPending } = useCancelOrder();

  const confirmOrderStatus = (orderId) => {
    handleCancellation(
      { userId: userData?.uid, orderId },
      {
        onSuccess: (data) => {
          if (data?.message) {
            toast.success(data.message);
            togglePopup(orderId, false);
            queryClient.invalidateQueries({queryKey:["pendingOrders",userData?.uid,"pending"]});
            
          }
        },
      }
    );
  };

  

  const Styles = {
    containerStyle:
      "flex flex-col w-full px-3 gap-4 bg-white pt-2 pb-1 rounded-lg relative overflow-hidden ",
    buttonStyle: {
      maxWidth: "max-content",
      backgroundColor: "#DF0303FF",
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
      backgroundColor: "#7B7B7BE6",
      scale: { sm: 0.66, md: 1 },
      fontSize: { xs: 8.5, sm: 15 },
      whiteSpace: "nowrap",
      width: { sm: "40%", lg: "20%", md: "20%" },
      marginLeft: "0",
      marginRight: "auto",
    },
    btnVarient2: "contained",
  };

  if (!PendingProducts || pendingOrderLoading) {
    return <PopUpLoading size={60} />;
  }

  if (pendingOrderError) {
    return (
      <center>
        <h1>Error loading orders</h1>
      </center>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!close && PendingProducts?.length > 0 && (
          <motion.div
            animate={close && { height: 0, opacity: 0 }}
            exit={{ height: 0 }}
            className="relative  overflow-hidden mr-auto ml-auto"
          >
            <div className="px-5 py-3">
              <Note
                containerStyle={
                  "w-full flex rounded-lg bg-yellow-600 md:px-5 xs:px-2 "
                }
                paraStyle={
                  "text-center text-wrap text-white xs:text-sm md:text-lg"
                }
                info={
                  "You are allowed to deside, if you want exchange or get re-fund with in 5 working days since cancellation,other than it will get refunded automatically"
                }
                setClose={setClose}
                sessionKey={"pendingOrdersNote"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-6 bg-white">
        {PendingProducts?.map((orderItem) => {
          const statusInfo = PaymentStatus?.find(
            (status) => status.id === orderItem.orderId
          );
          const createdDate = statusInfo?.createdAt;
          const days = daysCounter(createdDate);

          return (
            <motion.div
              key={orderItem.orderId}
              className="px-5"
              variants={ItemVariant}
            >
              <PopUps
                open={open[orderItem.orderId]}
                setOpen={() => togglePopup(orderItem.orderId, true)}
                title={orderItem.orderId}
                fullWidth={false}
              >
                <DialogContent>
                  <div className="flex justify-center text-md md:w-[450px] md:text-2xl text-sm font-[serif] gap-5 items-center">
                    <h1>
                      Do you want to cancel this order? Please confirm to
                      proceed.
                    </h1>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="link"
                    onClick={() => togglePopup(orderItem.orderId, false)}
                    sx={{
                      fontSize: { md: "1.1rem", xs: "0.7rem", lg: "0.9rem" },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => confirmOrderStatus(orderItem.orderId)}
                    loading={isPending}
                    loadingPosition="start"
                    sx={{
                      backgroundColor: "#0c4a6e",
                      fontSize: { md: "1.1rem", xs: "0.7rem", lg: "0.8rem" },
                    }}
                    disabled={isPending}
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </PopUps>

              <OrderCard
                containerStyle={Styles.containerStyle}
                buttonStyle={Styles.buttonStyle}
                itemsStyle={Styles.itemsStyle}
                buttonVisibility1
                category={"Pending"}
                buttonVisibility2={days > 3 ? false : true}
                btnName1="Receipt"
                btnName2="Cancel Order"
                btn2Condition={() => togglePopup(orderItem.orderId, true)}
                buttonStyle2={Styles.buttonStyle2}
                btnVarient2={Styles.btnVarient2}
                btnVarient="contained"
                icon2={<DownloadForOfflineIcon />}
                userId={userData?.uid}
                status={statusInfo?.status || "unknown"}
                amount={statusInfo?.amount || "unknown"}
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
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center px-3">
        {!PendingProducts?.length && <OrderNow />}
      </div>
      <div className="mb-[3.5rem]"></div>
    </>
  );
};

export default memo(PendingOrders);
