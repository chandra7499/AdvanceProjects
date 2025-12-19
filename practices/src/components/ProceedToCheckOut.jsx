import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import { useContext, useEffect, useState,useRef } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import Dialog from "@mui/material/Dialog";
import {useRefetches} from "../hooks/refetches";
import { CodsuccessFull, CodError } from "../components/loading";
import { handlePayments } from "../functions/handlePayments";
import { useCashonDelivery } from "../hooks/useItems";
import { useNavigate } from "react-router-dom";
import { counter } from "../functions/eventHandlingFn";
import PaymentMode from "../components/paymentMode";

const ProceedToCheckOut = ({ selectedItems, section }) => {
  const {
    finalPrice,
    addressList,
    offerdetails,
    paymentModeLoader,
    setPaymentModeLoader,
    userData,
  } = useContext(myContext);
  const [open, setOpen] = useState(false);
  const count = useRef();
  const [paymentMode, setPaymentMode] = useState("");
  const [Boolean, setBoolean] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const boolean = addressList?.some(
      (address) => address.deliveryPoint === true
    );
    setBoolean(boolean);
  }, [addressList]);

  const refetch = useRefetches();

  function handlePaymentValue(e) {
    setPaymentMode(e.target.value);
  }

  const {
    mutate: CashOnDelivery,
    isPending,
    isError,
    isSuccess,
  } = useCashonDelivery({
    onSuccess: (data) => {
        if(data?.message){
           refetch(userData?.uid);
        }
    },
  });
  function proccessCashOndelivery() {
    CashOnDelivery({
      userId: userData?.uid,
      finalPrice: finalPrice,
      section: section,
      selectedItems: selectedItems,
    });
  }

  useEffect(() => {
    if (finalPrice === 0 || undefined || null) {
      console.log("final price not updated...");
    } else {
      console.log("finalPrice updated", finalPrice);
    }
  }, [finalPrice]);

  // isSuccess && refetches(userData?.uid);

  useEffect(() => {
    if (isSuccess) {
      refetch(userData?.uid);
      counter(
        5,
        (tick) => count.current = tick,
        () => navigate("/orders")
      );
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      counter(
        3,
        (tick) => count.current = tick,
        () => navigate("/delivery-details")
      );
    }
  }, [isError, navigate]);

  const handleProceesPayment = () => {
    console.log("current final price before Update", finalPrice);
    if (finalPrice > 0) {
      setPaymentModeLoader(true);
      handlePayments(finalPrice, navigate, setPaymentModeLoader,section,selectedItems);
    } else {
      setPaymentModeLoader(false);
      console.log("Final price is not updated");
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{ backgroundColor: "#0c4a6e" }}
          disabled={
            !(
              finalPrice - Number(offerdetails[0]?.deliveryCharges) > 0 &&
              Boolean
            )
          }
          endIcon={<PaymentIcon />}
        >
          Place order
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        disableEnforceFocus
        fullWidth={true}
        disableRestoreFocus
      >
        {!isSuccess ? (
          <div className="flex w-full justify-center items-center h-auto flex-col">
            <PaymentMode
              paymentMode={paymentMode}
              handlePaymentValue={handlePaymentValue}
              handleProceesPayment={handleProceesPayment}
              setOpen={setOpen}
              paymentModeLoader={paymentModeLoader}
              proccessCashOndelivery={proccessCashOndelivery}
              isPending={isPending}
            />
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col w-full rounded-md justify-center items-center h-auto text-2xl">
            {<CodsuccessFull />}{" "}
            <strong className="flex flex-col text-2xl text-center w-full px-3">
              placed successfully
            </strong>
            {count.current}
          </div>
        ) : (
          isError && (
            <div className="flex w-full justify-center items-center rounded-md flex-col h-auto text-2xl">
              {<CodError />}{" "}
              <strong className="flex flex-col text-center text-2xl w-full px-3">
                order not placed
              </strong>
              try again after {count}
            </div>
          )
        )}
      </Dialog>
    </>
  );
};

export default ProceedToCheckOut;
