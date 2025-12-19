import { memo, useContext } from "react";
import { Main } from "../../layouts/layouts";
import { motion } from "framer-motion";
import { myContext } from "../../GlobalStates/contextHooks";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { inputStyles } from "../../styles/style";
import { Button, DialogActions } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ExchangeProducts = ({ booked, orderId }) => {
  const {setExchange, displayProduct } = useContext(myContext);
  const handleExchangeClose = () => {
    setExchange(false);
  };

  const handleSpecificClick = booked.filter((item) => item.orderId === orderId);
  const categoryId = handleSpecificClick.flatMap((item) =>
    item.placeOrderList.map((placed) => placed.id)
  );
  const handleSpecificCategory = handleSpecificClick.flatMap(
    (item) => item?.placeOrderList
  );
  const categoryOFProducts = displayProduct.filter((item) =>
    categoryId.includes(item.id)
  );

  const categoryName = categoryOFProducts.flatMap((item) => item.category);
  const uniqueCategory = displayProduct.filter((item) =>
    categoryName.includes(item.category)
  );

  return (
    <>
    
        <motion.div
          className="h-[100vh] backdrop-brightness-[0.5] flex justify-center items-start  w-full px-2"
          initial={{ opacity: 0, y: 100 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: 100 }}
          style={{
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 200,
          }}
          onClick={handleExchangeClose}
        >
          <motion.div
            className="bg-white h-full w-full flex flex-col  mt-5 rounded-2xl px-2"
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 100) {
                handleExchangeClose();
              }
            }}
          >
            <span className="flex shadow-inner shadow-slate-950 justify-center  w-16 rounded-full mr-auto ml-auto mt-1 cursor-grabbing">
              <ArrowDropDownIcon />
            </span>
            <div className="px-5 flex justify-between  py-3 gap-5">
              <div className={inputStyles.ExchangeSpan}>
                <div className="w-full overflow-x-auto px-2 flex gap-3 my-3">
                  {handleSpecificCategory.map((placed) => (
                    <div
                      key={placed?.id}
                      className="flex flex-col gap-2 ring-1 ring-slate-300  rounded-md p-2 justify-between"
                    >
                      <span>qty:{placed?.qty || placed?.quantity}</span>
                      <img src={placed?.image} className="w-28" />
                      <span>
                        total:{((placed?.qty || placed?.quantity) * placed.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={inputStyles.ExchangeSpan}> </div>
            </div>
            <span className="flex items-center  max-w px-5 text-lg font-mono justify-end">
              Total:
              <span className="shadow-inner rounded-md shadow-slate-900 px-2 py-1 max-w">
                {handleSpecificCategory.reduce(
                  (total, item) => total + ((item?.qty || item?.quantity) * item.price),
                  0
                ).toFixed(2)}
              </span>{" "}
            </span>

            <Main className=" shadow-inner mt-3 shadow-slate-950  rounded-md overflow-hidden pb-5">
              <div className="px-4 py-4  mt-2 grid  grid-cols-[repeat(auto-fit,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] justify-center items-center gap-x-5 gap-y-10 *:rounded-md *:cursor-pointer transition ease-linear duration-150 overflow-y-auto  h-full">
                {uniqueCategory?.map((item) => (
                  <div
                    key={item?.id}
                    className={`shadow-xl flex flex-col p-3 justify-evenly h-[100%] ${
                      categoryOFProducts.some(
                        (product) => product.id === item.id
                      )
                        ? "opacity-[0.6] ring-1"
                        : ""
                    }`}
                  >
                    <img src={item?.image} className="" />
                    <p className="font-bold text-sm">price:{item?.price}</p>
                    {categoryOFProducts.some(
                      (product) => product.id === item.id
                    ) && (
                      <CheckCircleIcon
                        sx={{
                          marginRight: "0",
                          marginLeft: "auto",
                          color: "#000000FF",
                          fontSize: "1.7rem",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Main>
            <DialogActions
              sx={{
                position: "sticky",
                bottom: 5,
                background: "white",
                padding: "3px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0c4a6e",
                  scale: { xs: "0.8", sm: "0.8", md: "1" },
                }}
              >
                Exchange
              </Button>
              <Button
                variant="contained"
                disabled={true}
                sx={{
                  backgroundColor: "#7c4ae6",
                  scale: { xs: "0.8", sm: "0.8", md: "1" },
                }}
              >
                Pay-Extra
              </Button>
            </DialogActions>
          </motion.div>
        </motion.div>
   
    </>
  );
};

export default memo(ExchangeProducts);
