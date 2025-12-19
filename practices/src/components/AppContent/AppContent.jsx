import { Main } from "../layouts/layouts";
import { motion } from "framer-motion";
import { Image, Slide, SkeletonLoadingHome } from "../../components/loading";
import Rating from "../../components/Rating";
import AddToCart from "../features/AddToCart";
import AddToWishList from "../features/AddToWishList";
import { useNavigate } from "react-router-dom";
import { useSelection } from "../../functions/searchFunction";
import VerifiedBadge from "../verifiedBadge";
import { priceFormatter } from "../../functions/eventHandlingFn";
import { optimizedCloudinaryImage } from "../../functions/optimization";
const HomeContent = ({
  displayProduct,
  productsPending,
  wishList,
  userLogin,
  userData,
}) => {
  const navigate = useNavigate();
  const productSelection = useSelection();
  function Navigation(id) {
    productSelection(id, navigate);
  }

  return (
    <>
      <Main className={`HomeContent bg-white h-auto`}>
        <div className="data">
          {productsPending ? (
            <motion.ul
              className=" grid  grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(287px,1fr))]   md:gap-8 gap-5 *:ring-1 *:ring-slate-200   *:shadow-lg *:rounded-md *:p-2 md:px-7 py-1 px-1 md:py-5 *:cursor-pointer transition ease-linear duration-150"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {displayProduct?.map((product) => {
                return (
                  <motion.li
                    whileHover={{
                      boxShadow: "1px 1px 15px 0.10px gray",
                      scale: 1.03,
                    }}
                    key={product?.id}
                    className="flex flex-col bg-white transition-all duration-300   text-sm 2xl:text-md gap-5"
                  >
                    <div className="flex justify-between text-slate-700 w-full font-semibold 2xl:text-lg md:text-md">
                      <span className="w-full line-clamp-1">{product.name ? product.name : <Slide />}</span>
                    </div>

                    <motion.div
                      className="flex p-3 flex-col flex-grow"
                      onClick={() => Navigation(product?.id)}
                    >
                      {product?.images ? (
                        <img
                          fetchPriority="high"
                          className="w-[19rem] h-full flex mr-auto ml-auto rounded-md aspect-auto object-contain"
                          src={
                            Array.isArray(product?.images)
                              ? optimizedCloudinaryImage(product.images[0])
                              : product.images
                          }
                          alt={product.name}
                        />
                      ) : (
                        <Image />
                      )}
                    </motion.div>

                    <div className="flex flex-col justify-between gap-2 ">
                      <div className="flex  p-2 items-center flex-col gap-2">
                        <span className="flex justify-start w-full gap-2 font-bold text-gray-400">
                          {
                            <Rating
                              size={"small"}
                              value={product?.rating.toFixed(1)}
                              color={"#053B5AFF"}
                            />
                          }
                          {product?.ratingCount && <span className="text-gray-500 font-medium">[{product?.ratingCount}]</span>}
                        </span>
                        <span className="md:text-lg font-semibold flex w-full justify-end">
                          ₹{priceFormatter(product?.price)}
                        </span>
                      </div>
                      <article className="">
                        <p className="line-clamp-3 text-gray-600  px-1 mb-2 font-medium text-sm">
                          {product?.description}
                        </p>
                      </article>
                      {product?.verified && <VerifiedBadge />}
                      <div className="flex gap-3 justify-end">
                        <AddToCart
                          userData={userData}
                          product={product}
                          type="plus"
                          userLogin={userLogin}
                        />
                        <AddToWishList
                          userLogin={userLogin}
                          wishList={wishList}
                          userData={userData}
                          product={product}
                        />
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <SkeletonLoadingHome />
          )}
        </div>
      </Main>
    </>
  );
};

export const AboutContent = () => {
  return (
    <>
      <Main className="AboutContent flex flex-col px-5 py-5">
        <h1 className="text-xl font-mono">
          Welcome to Tazon store which is best online e-commerce website
        </h1>
      </Main>
    </>
  );
};

export default HomeContent;
