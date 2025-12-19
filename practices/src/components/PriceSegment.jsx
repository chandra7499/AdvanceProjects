import { getSessionStorage } from "../functions/localStorage";
import { useContext, useState, useEffect, memo } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import { Minislide, NumberAnimation, Slide } from "./loading";
import { motion, AnimatePresence } from "framer-motion";
import { listVariant } from "../components/styles/style";

const PriceSegment = ({ products }) => {
  const [offerCode, setOfferCode] = useState(() =>
    getSessionStorage("promoCode")
  );

  const [price, setBasePrice] = useState(0);

  useEffect(() => {
    const handleChange = () => {
      const promo = getSessionStorage("promoCode");
      setOfferCode(promo);
    };
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const { offerdetails, finalPrice, setFinalPrice } = useContext(myContext);

  useEffect(() => {
    if (!products || (Array.isArray(products) && products.length === 0)) {
      setBasePrice(0);
      return;
    }
    const normalize = Array.isArray(products) ? products : [products];

    const amount = normalize.reduce((total, item) => total + Number(item.price), 0);
    setBasePrice(amount);
  }, [products]);

  useEffect(() => {
    console.log(price);
    const offer = offerdetails?.[0] || {};
    if (!offer) return;
    const totalPrice = Number(price) || 0;
    const gstRate = Number(offer?.gst) || 0;
    const storeDiscountRate = Number(offer?.storeDiscount) || 0;
    const promoDiscountRate = Number(offer?.promoCode?.[1]) || 0;
    const deliveryCharges = price < 500 ? Number(offer?.deliveryCharges) : 0;

    const gstAmount = (totalPrice * gstRate) / 100;
    const discountAmount = (totalPrice * storeDiscountRate) / 100;
    const promoDiscount =
      offerCode === offer?.promoCode?.[0]
        ? (totalPrice * promoDiscountRate) / 100
        : 0;

    const calculatedFinalPrice =
      totalPrice + gstAmount + deliveryCharges - discountAmount - promoDiscount;
    setFinalPrice(Number(Math.round(calculatedFinalPrice)));
  }, [offerCode, offerdetails, setFinalPrice, price]);

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div
          className="price-segment p-4 rounded-lg shadow-xl "
          variant={listVariant}
          layout
        >
          <h1 className="text-3xl font-medium ">Price segment</h1>
          <hr className="my-2" />
          <div className="flex flex-col pl-2 gap-3 text-gray-600">
            <span className="flex justify-between w-full">
              Total Price:
              <span>
                ₹
                {
                  <NumberAnimation
                    value={price.toFixed(2)}
                    color="black"
                    size={16}
                  />
                }
              </span>
            </span>
            <span className="flex justify-between w-full">
              GST :<p>{offerdetails[0]?.gst ?? <Slide />}%</p>
            </span>
            {price < 500 && (
              <span className="flex justify-between w-full">
                Delivery charges :<p>{offerdetails[0]?.deliveryCharges}</p>
              </span>
            )}
            <hr className="bg-gray-300 h-[0.1rem]" />
            {offerCode === offerdetails[0]?.promoCode[0] ? (
              <span className="flex justify-between w-full">
                Promo discount :
                <p>{offerdetails[0]?.promoCode[1] ?? <Slide />}%</p>
              </span>
            ) : (
              ""
            )}
            <span className="flex justify-between w-full">
              Discount % :<p>{offerdetails[0]?.storeDiscount}%</p>
            </span>
            <hr className="bg-gray-300 h-[0.1rem]" />
            <span className="flex justify-between w-full ">
              <span className="text-md font-bold">Final Price:</span>
              {products?.length > 0 ? (
                <span>
                  ₹
                  {(finalPrice < 500 ? (
                    <NumberAnimation
                      value={finalPrice.toFixed(3)}
                      color="black"
                      size={16}
                    />
                  ) : (
                    <NumberAnimation
                      value={(
                        finalPrice - offerdetails[0]?.deliveryCharges
                      ).toFixed(3)}
                      color="black"
                      size={16}
                    />
                  )) ?? <Minislide />}
                </span>
              ) : (
                <p className="text-gray-400 text-sm text-wrap line-clamp-2">
                  please select any item in cart to proceed to payment.
                </p>
              )}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default memo(PriceSegment);
