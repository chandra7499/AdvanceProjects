import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useEffect, useRef, useCallback, useState } from "react";
import propType from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
// import {orderTableContent} from "../../functions/orderTableContent";

// import { myContext } from "../../components/GlobalStates/contextHooks";

const OrderCarosels = ({type,products, loading, SlideCount }) => {
  // const { OrderslideCount: slideCount, setOrderSlideCount: setSlideCount } =
  //   useContext(myContext);
  const intervalRef = useRef(null);

  const [slideCount, setSlideCount] = useState(0);

  // useEffect(()=>{
  //   console.log(newArray[slideCount].image);
  // })

  useEffect(()=>{
    SlideCount(slideCount);
  },[products,slideCount])
  // Auto-slide
  useEffect(() => {
    if (products?.length > 1) {
      startAutoSlide();
      return () => clearInterval(intervalRef.current);
    }
  }, [products]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleSliding();
    }, 8000);
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  const handleSliding = useCallback(() => {
    // setPrevCount(slideCount);
    setSlideCount((prev) => (prev + 1) % products?.length);
    
    resetAutoSlide();
  }, [slideCount, products.length]);

  const handleBackSliding = useCallback(() => {
    setSlideCount((prev) => (prev - 1 + products.length) % products?.length);
    resetAutoSlide();
  }, [slideCount, products.length]);

  return (
    !loading && (
      <div className="flex z-0 w-full h-full flex-col items-center relative overflow-hidden  py-2">
        <AnimatePresence>
          <motion.div
            className="max-w-[450px] h-[250px] flex relative z-0 rounded-xl"
            drag="x"
            dragConstraints={{ left: 10, right: 10 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > -100) {
                handleBackSliding();
              } else if (info.offset.x < 100) {
                handleSliding();
              }
            }}
          >
            <motion.img
              key={`current-${slideCount}`}
              src={type === "orders" ?  Array.isArray(products[products.length > 1 ? slideCount : 0].image) ? products[products.length > 1 ? slideCount : 0].image[0] : products[products.length > 1 ? slideCount : 0].image : products[products.length > 1 ? slideCount : 0]}
              className="w-[250px] h-[250px] object-contain rounded-xl"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation + Dots */}
        {products?.length > 1 && (
          <div className="flex justify-center w-full xs:scale-[0.8]  relative gap-3 mt-4">
            <ArrowBackIosNewIcon
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: "1px 1px 9px 0.5px grey",
                width: "30px",
                height: "30px",
                padding: 0.7,
                cursor: "pointer",
                display: { xs: "none", sm: "flex" },
              }}
              onClick={handleBackSliding}
            />

            {/* Dots */}
            <span className="flex gap-2 items-center">
              {products.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ring-1 ring-gray-600 ${
                    slideCount === index ? "bg-gray-900" : ""
                  }`}
                ></span>
              ))}
            </span>

            <ArrowForwardIosIcon
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: "1px 1px 9px 0.5px grey",
                width: "30px",
                height: "30px",
                padding: 0.7,
                cursor: "pointer",
                display: { xs: "none", sm: "flex" },
              }}
              onClick={handleSliding}
            />
          </div>
        )}
      </div>
    )
  );
};

OrderCarosels.propTypes = {
  products: propType.array.isRequired,
  loading: propType.bool.isRequired,
  SlideCount: propType.func.isRequired,
};

export default OrderCarosels;
