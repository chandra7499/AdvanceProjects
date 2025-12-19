import SlideOverflow from "../features/SlideOverflow";
import { Main, RupeeSymbol } from "../layouts/layouts";
import { motion } from "framer-motion";
import { DiscountTag } from "../layouts/layouts";
import { Link, useNavigate } from "react-router-dom";
import RatingComp from "../Rating";
import { useSelection } from "../../functions/searchFunction";
import { countConverter } from "../../functions/eventHandlingFn";
import { priceFormatter } from "../../functions/eventHandlingFn";

const PopularCat = ({ products }) => {
  const navigate = useNavigate();
  const productSelection = useSelection();

  function productNavigation(id) {
    productSelection(id, navigate);
  }

  return (
    <Main className="w-full justify-self-center relative  mb-5">
      <SlideOverflow>
        {products?.map((item) => (
          <motion.section
            whileHover={{ boxShadow: "0 0 8px rgba(0,0,0,0.2)" }}
            key={item.categoryName}
            className="
              flex flex-col flex-shrink-0 gap-4 p-4 rounded-xl border border-gray-200 bg-white
              
            "
          >
            {/* Category title & More */}
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-lg ">{item.categoryName}</p>
              <Link className="text-md text-sky-700 hover:underline">
                more..
              </Link>
            </div>

            {/* Products */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item?.subProducts?.map((subItem) => (
                <div
                  key={subItem?.id}
                  className="flex flex-col gap-3 p-2 rounded-lg border border-gray-300"
                >
                  {/* Product name */}
                  <p className="font-semibold text-sm max-w-[70%] line-clamp-1 sm:text-md">
                    {subItem?.name}
                  </p>

                  {/* Product image with discount tag */}
                  <div className="relative">
                    <img
                      className="w-full h-32 sm:h-36 md:h-40 object-contain object-center cursor-pointer"
                      src={subItem.image}
                      onClick={() => productNavigation(subItem?.id)}
                      alt={subItem.name}
                    />
                    <span className="absolute top-1 right-1">
                      <DiscountTag discount={subItem?.discount} />
                    </span>
                  </div>

                  {/* MRP */}
                  <span className="flex items-center gap-1 text-xs sm:text-sm">
                    <span className="font-medium">M.R.P:</span>
                    <span className="line-through text-gray-500 flex items-center">
                      <RupeeSymbol />
                      {priceFormatter(subItem?.price)}
                    </span>
                  </span>

                  {/* Rating */}
                  <span className="flex gap-3 ">
                    <RatingComp size="small" value={subItem?.rating} />
                    {subItem?.ratingCount && (
                      <span className="text-gray-700">
                        [{countConverter(subItem?.ratingCount)}]
                      </span>
                    )}
                  </span>

                  {/* Final price */}
                  <p className="flex justify-end items-center font-bold">
                    <RupeeSymbol />
                    {priceFormatter(subItem?.discountPrice)}
                  </p>
                </div>
              ))}
            </section>
          </motion.section>
        ))}
      </SlideOverflow>
    </Main>
  );
};

export default PopularCat;
