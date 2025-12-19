import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { Inputs} from "../components/layouts/layouts";
import { PaymentModeAnima, PaymentModeAnima2 } from "../components/loading";

const PaymentMode = ({
  paymentMode,
  handlePaymentValue,
  handleProceesPayment,
  setOpen,
  paymentModeLoader,
  proccessCashOndelivery,
  isPending,
}) => {
  return (
    <>
      <DialogTitle
        sx={{
          fontSize: { md: "2.1rem", xs: "1.5rem", sm: "1.5rem" },
          fontFamily: "sans",
          flexDirection: "row",
          display: "flex",
          transition: "all 1s ease-in-out",
          justifyContent: "center",
          alignItems: "center",
        }}
        width="100%"
      >
        {"Payment mode"}
        {paymentMode === "online" ? (
          <PaymentModeAnima />
        ) : paymentMode === "cash on delivery" ? (
          <PaymentModeAnima2 />
        ) : (
          ""
        )}
      </DialogTitle>
        <DialogContent>
          <div className="flex justify-center text-md md:w-[450px] md:text-2xl text-sm font-[serif] gap-10 items-center ">
            <span className="flex  justify-start gap-2 Items-center rounded-lg p-2 shadow-lg">
              <Inputs
                type="radio"
                name="paymentMode"
                className="accent-sky-900 w-5"
                value="online"
                checked={paymentMode === "online"}
                required
                onChange={handlePaymentValue}
              />
              online
            </span>
            <span className="flex  justify-start gap-2 Items-center rounded-lg p-2 shadow-lg">
              <Inputs
                type="radio"
                name="paymentMode"
                className="accent-sky-900 w-5 "
                value="cash on delivery"
                checked={paymentMode === "cash on delivery"}
                required
                onChange={handlePaymentValue}
              />
              cash on delivery
            </span>
          </div>
        </DialogContent>
        <DialogActions sx={{paddingRight:"1.5rem",paddingBottom:"1.5rem",magrinRight:"0",marginLeft:"auto"}}>
          <Button
            variant="link"
            onClick={() => setOpen(false)}
            sx={{ fontSize: { md: "1.1rem", xs: "0.7rem", lg: "0.9rem" } }}
          >
            cancel
          </Button>
          <Button
            variant="contained"
            onClick={
              paymentMode === "online"
                ? handleProceesPayment
                : proccessCashOndelivery
            }
            loading={paymentModeLoader || isPending}
            loadingPosition={"start"}
            sx={{
              backgroundColor: "#0c4a6e",
              fontSize: { md: "1.1rem", xs: "0.7rem", lg: "0.8rem" },
            }}
            disabled={paymentMode === ""}
          >
            {paymentMode === "online" ? "proceed to pay" : "place order"}
          </Button>
        </DialogActions>
    </>
  );
};

PaymentMode.propTypes = {
  paymentMode: PropTypes.string.isRequired,
  handlePaymentValue: PropTypes.func.isRequired,
  handleProceesPayment: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  paymentModeLoader: PropTypes.bool.isRequired,
  proccessCashOndelivery: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
};

export default PaymentMode;
