import { Button, useMediaQuery, useTheme } from "@mui/material";
import { Main } from "../../../components/layouts/layouts";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import propType from "prop-types";
import { useState, Suspense, lazy, useRef} from "react";
const DeliveryStatusPoint = lazy(() => import("./OrderStatus"));
// import { myContext } from "../../../components/GlobalStates/contextHooks";
const OrdersInfoContainer = lazy(() =>
  import("../../../components/AppContent/orderStatus/OrdersInfoContainer")
);
export const OrderCard = ({
  orderid,
  category,
  buttonVisibility2,
  buttonStyle,
  containerStyle,
  btnName1,
  buttonVisibility1,
  btnVarient2,
  btnName2,
  icon2,
  btn1Condition,
  btn2Condition,
  buttonStyle2,
  itemsStyle,
  btnVarient,
  status,
  userId,
  amount,
  infoCount,
  products,
  children,
}) => {
  const [slide, setSlide] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const ScrollSmooth = useRef(null);

  function toggleSlide() {
    setSlide((prev) => !prev);
    setTimeout(() => {
      const rect = ScrollSmooth.current.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - 500,
        behavior: "smooth",
      });
    }, 100);
  
  }

  const trObj = {
    tr: "border-b-2 border-grey-500 ",
    td: "text-end py-2 text-md",
  };
  return (
    <>
      <Main
        className={containerStyle}
        style={{ boxShadow: "3px 3px 15px 2px rgba(0,0,0,0.2)"}}
      >
        <div className="flex justify-between">
          <span className="flex gap-1 sm:text-lg xs:text-[10px]">
            orderId:<strong>{orderid}</strong>
          </span>
          <span className="flex gap-1 sm:text-lg xs:text-[10px]">
            payment:<strong>{status}</strong>
          </span>
        </div>
        <div className={itemsStyle}>
          {children}
          <Suspense fallback={<CircularProgress />}>
            {isSmall && (
              <OrdersInfoContainer
                trStyle={trObj.tr}
                amount={amount}
                tdStyle={trObj.td}
                OrderslideCount={infoCount}
                products={products}
              />
            )}
          </Suspense>
        </div>

        <div className="flex ">
          {buttonVisibility1 && (
            <Button
              variant={btnVarient2}
              sx={buttonStyle2}
              endIcon={icon2}
              onClick={btn1Condition}
            >
              {btnName1}
            </Button>
          )}
          {buttonVisibility2 && (
            <Button
              variant={btnVarient}
              sx={buttonStyle}
              onClick={btn2Condition}
            >
              {btnName2}
            </Button>
          )}
        </div>
        <hr className="bg-slate-400 h-[1.4px]" />

        <motion.div
          onClick={() => toggleSlide()}
          initial={false}
          animate={{
            rotate: slide ? 180 : -90,
            // -90 for xs view
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: "500",
            damping: 30,
          }}
          style={{
            marginLeft: "auto",
            width: "fit-content",
            cursor: "pointer",
          }}
        >
          {category === "Pending" ? (
            <KeyboardArrowDownIcon sx={{ fontSize: 35 }} />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ fontSize: 35, display: { sm: "none" } }}
            />
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            ref={ScrollSmooth}
            className="flex flex-col gap-6"
            initial={{ height: 0 }}
            animate={
              slide ? { height: "auto", paddingBottom: "12px" } : { height: 0 }
            }
          >
            <Suspense fallback={<CircularProgress />}>
              {!isSmall && (
                <OrdersInfoContainer
                  trStyle={trObj.tr}
                  tdStyle={trObj.td}
                  products={products}
                  OrderslideCount={infoCount}
                  amount={amount}
                />
              )}
            </Suspense>
            <Suspense fallback={<CircularProgress />}>
              <DeliveryStatusPoint orderId={orderid} userId={userId} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </Main>
      
    </>
  );
};

OrderCard.propTypes = {
  orderid: propType.number.isRequired,
  buttonVisibility2: propType.bool.isRequired,
  btn1Condition: propType.func.isRequired,
  category: propType.string.isRequired,
  buttonStyle: propType.object.isRequired,
  containerStyle: propType.string.isRequired,
  btnName1: propType.string.isRequired,
  buttonVisibility1: propType.bool.isRequired,
  btnVarient2: propType.string.isRequired,
  btnName2: propType.string.isRequired,
  icon2: propType.object.isRequired,
  buttonStyle2: propType.object.isRequired,
  itemsStyle: propType.string.isRequired,
  btnVarient: propType.string.isRequired,
  status: propType.string.isRequired,
  amount: propType.oneOfType([propType.string, propType.number]).isRequired,
  products: propType.array.isRequired,
  infoCount: propType.number.isRequired,
  btn2Condition: propType.func.isRequired,
  userId: propType.number.isRequired,
  children: propType.node.isRequired,
};
