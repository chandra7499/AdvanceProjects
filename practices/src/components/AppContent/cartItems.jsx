import { useCart } from "../GlobalStates/contextHooks";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { style } from "../styles/style";
import { Inputs } from "../../components/layouts/layouts";
import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clearAllSelections } from "../../api/deleteItems";
import { selectAllSelection } from "../../api/postItems";
import { useDeleteCartItem, usePlaceOrderItems } from "../../hooks/useItems";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { ItemVariant, listVariant } from "../../components/styles/style";
import { useSelection } from "../../functions/searchFunction";
import { NumberAnimation } from "../loading";
import { priceFormatter } from "../../functions/eventHandlingFn";

// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CartItems = () => {
  const {
    cartItems,
    totalPrice,
    setTotalPrice,
    userData,
    selectedTotalPrice,
    placeOrderList,
  } = useCart();
  const { mutate: ReduceQty_then_delete } = useDeleteCartItem();
  const { mutate: placeOrderItem } = usePlaceOrderItems();
  const [passIngproducts, setpassIngproducts] = useState([]);
  const navigate = useNavigate();
  const ProductsView = useSelection();
  console.log(cartItems);

  // const { selectedItems } = useOrderSelection();

  const DeleteItem = (item, userId = userData?.uid) => {
    ReduceQty_then_delete({ id: item.id, userId: userId });
    console.log(item.id, userId);
  };

  function clearAllselections() {
    clearAllSelections(userData?.uid);
  }

  function selectAllselections() {
    selectAllSelection(userData?.uid, cartItems);
  }

  useEffect(() => {
    if (!placeOrderList || placeOrderList.length === 0) {
      setpassIngproducts([]);
      return;
    }

    const selectedProducts = cartItems.filter((item) =>
      placeOrderList.some((order) => order.id === item.id)
    );

    setpassIngproducts(selectedProducts);
    console.log("Selected products for checkout:", selectedProducts);
  }, [placeOrderList, cartItems]);

  function Navigate() {
    navigate("/delivery-details", {
      state: { products: passIngproducts, section: "cartSection" },
    });
  }

  
  function Navigation(id) {
    ProductsView(id, navigate);
  }
  
  const handleChange = useCallback(
    (item) => {
      const orders = {
        id: item.id,
        qty:item.qty,
        price: Number(parseFloat(item.price).toFixed(2)),
      };
      placeOrderItem({ item: orders, userId: userData?.uid });
      //  console.log("orders",orders);
    },
    [placeOrderItem, userData?.uid]
  );
  
  
  useEffect(() => {
    const total = cartItems?.reduce((total, item) => total + item.price, 0);
    setTotalPrice(parseFloat(total));
  }, [cartItems, setTotalPrice]);
  
  //selectedCost
  

  return (
    <>
      <div className="w-full rounded-md  py-2   ">
        {/* <Cancle
          // onClick={closeDialog}
          className="sticky top-0 "
          color="warning"
          style={{ cursor: "pointer", left: "-20px" }}
        /> */}

        {cartItems?.length > 0 && (
          <div className="flex flex-row  justify-end px-5 sticky top-[28.5px] py-2 bg-white gap-5 *:cursor-pointer  border-b-slate-300 border-b-[0.77px] ">
            <button
              className="disabled:cursor-not-allowed bg-red-700 text-white  md:px-4 md:py-1 px-2 text-sm md:text-md  rounded-md disabled:opacity-[0.5]"
              onClick={clearAllselections}
              disabled={placeOrderList.length === 0}
            >
              Clear All
            </button>
            <button
              className="disabled:cursor-not-allowed  text-white  py-1 md:px-4 md:py-1 px-2 text-sm md:text-md   bg-green-700  disabled:opacity-[0.5] rounded-md"
              disabled={cartItems.length === placeOrderList.length}
              onClick={selectAllselections}
            >
              Select All
            </button>
          </div>
        )}

        <div className="px-4 md:px-8 bg-white mt-5">
          {cartItems?.length > 0 ? (
            <div
              className={`*:grid lg:*:grid-cols-[repeat(auto-fit,minmax(410px,1fr))]    h-full *:h-full *:gap-5 mb-6`}
            >
              <motion.ul
                variants={listVariant}
                initial="hidden"
                animate="visible"
                className="*:flex *:flex-row  *:bg-white *:px-1 *:border-b-slate-300 *:border-b-[1px] *:gap-6 *:py-2"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => {
                    let statusCheck = (placeOrderList ?? []).some(
                      (orderItem) => orderItem?.id === item?.id
                    );
                    return (
                      <motion.li
                        key={item.id}
                        variants={ItemVariant}
                        layout
                        className={`*:max-w *:flex   *:gap-2  *:justify-start px-5 hover:bg-gray-200 rounded-lg cursor-pointer`}
                      >
                        <div className="mr-3">
                          <span>
                            <Inputs
                              type="checkbox"
                              className={`w-5 h-5 accent-sky-900 `}
                              checked={statusCheck}
                              onChange={() => handleChange(item)}
                            />
                          </span>
                          <img
                            src={item?.image}
                            alt={item.name}
                            onClick={() => Navigation(item?.id)}
                            className="rounded-lg aspect-auto w-20 h-20 object-contain"
                          />
                        </div>

                        <div className=" w-full flex flex-col ">
                          <span className="line-clamp-1">{item.name}</span>
                          <span className="text-gray-400 w-full flex flex-row gap-1 justify-between">
                            price:{priceFormatter(item.price)}
                            <span className="w-full text-end ">
                              {" "}
                              qty:{item.qty}
                            </span>
                          </span>
                        </div>

                        <button>
                          {
                            <DeleteRoundedIcon
                              color="error"
                              onClick={() => DeleteItem(item)}
                            />
                          }
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
          ) : (
            <div className=" flex items-center justify-center">
              {cartItems?.length === 0 ? (
                <h1 className="text-3xl text-gray-500">
                  No products added yet
                </h1>
              ) : (
                <CircularProgress size={60} sx={{ color: "#0c4a6e" }} />
              )}
            </div>
          )}
          <div
            className={`sticky bottom-0 px-1 overflow-x-scroll  py-1 text-end gap-2 flex justify-between  backdrop-blur-md rounded-md`}
          >
            {cartItems?.length > 0 && (
              <span className={`${style.cartBottomCostStyle}`}>
                Total Cost:
                <span className="ml-2">
                  ₹{cartItems?.length > 0 && <NumberAnimation value={Number(totalPrice.toFixed(2)) } color={"#CECECEF7"} size={16}/>}
                </span>
              </span>
            )}

            {/*            

            {placeOrderList?.length > 0 && <span className="rounded-full bg-slate-900 text-gray-400 shadow-lg px-4  py-2   mr-auto ml-0">
              {placeOrderList?.length}
            </span>} */}
            {parseInt(selectedTotalPrice) !== 0 && cartItems?.length > 0 && (
              <span className={`${style.cartBottomCostStyle}`}>
                Selected Cost:
                <span> ₹{<NumberAnimation value={Number(selectedTotalPrice)} color={"#CECECEF7"} size={16}/>}</span>
              </span>
            )}
            {cartItems?.length > 0 && (
              <button
                className="bg-green-700 px-2 rounded-md text-slate-50 text-nowrap disabled:bg-slate-300 disabled:cursor-not-allowed"
                disabled={placeOrderList?.length === 0}
                onClick={Navigate}
              >
                Proceed to checkout: [ {placeOrderList?.length} ]
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItems;
