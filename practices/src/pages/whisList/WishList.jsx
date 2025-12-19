import { useContext, useEffect, useState } from "react";
import { myContext } from "../../components/GlobalStates/contextHooks";
import AddToCart from "../../components/features/AddToCart";
import AddToWishList from "../../components/features/AddToWishList";
import { motion, AnimatePresence } from "framer-motion";
import { listVariant, ItemVariant } from "../../components/styles/style";
import RatingComp from "../../components/Rating";
import { Inputs } from "../../components/layouts/layouts";
import { useNavigate } from "react-router-dom";
import { useSelection, filterProducts } from "../../functions/searchFunction";
import { WishListSkeleton } from "../../components/loading";

const WishList = () => {
  let {
    userData,
    wishList,
    userLogin,
    GlobalFilters: sortList,
  } = useContext(myContext);

  const [originalWishList, setOriginalWishList] = useState(null);
  const [filterCategoryState, setFilterCategoryState] = useState([]);
  const [loadingWishList, setLoadingWishList] = useState(true);
  const naviagte = useNavigate();
  const productSelection = useSelection();

  useEffect(() => {
    if (wishList === undefined) return;
    setOriginalWishList(wishList ?? []);
    setLoadingWishList(false);
    if (wishList?.length) {
      const filterCategoryProducts = [
        ...new Set(wishList?.map((item) => item?.category)),
      ];
      const makeItFalse = filterCategoryProducts.map((item) => {
        return {
          category: item,
          state: false,
        };
      });
      setFilterCategoryState(makeItFalse);
    }
  }, [wishList]);

  const uniqueCatItems = filterCategoryState;

  if (loadingWishList) return <WishListSkeleton />;

  if (!loadingWishList && originalWishList?.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No Items in your wishList
      </div>
    );
  }

  function navigation(id) {
    productSelection(id, naviagte);
  }

  function toggleSortItems(key) {
    setFilterCategoryState((prev) => {
      const updateCategory = prev?.map((item) => {
        return item?.category === key ? { ...item, state: !item?.state } : item;
      });
      console.log("updateCategory", updateCategory);

      const isActive = updateCategory
        .filter((item) => item?.state)
        .map((i) => i.category);

      if (isActive.length > 0) {
        const filtered = wishList.filter((item) =>
          isActive.includes(item.category)
        );
        setOriginalWishList(filtered);
      } else {
        setOriginalWishList(wishList);
      }

      return updateCategory;
    });
  }

  function sorting(section) {
    const sortingItems = [...originalWishList].sort((a, b) => {
      if (section === "price") {
        return b?.price - a?.price;
      } else if (section === "rating") {
        return b?.rating - a?.rating;
      } else if (section === "name") {
        return a?.name.localeCompare(b?.name);
      }
      return 0;
    });
    setOriginalWishList(sortingItems);
  }

  return (
    <>
      <div className="flex flex-col justify-center  gap-4 items-center  md:p-5 p-2">
        <div className="flex w-full  md:flex-row flex-col p-2 gap-2 items-center">
          <span className="font-semibold">Filters:</span>
          <div className="p-2 flex gap-3 w-full overflow-auto">
            {uniqueCatItems?.map((item, index) => (
              <span
                key={index}
                onClick={() => {
                  toggleSortItems(item?.category);
                }}
                className={`bg-gray-300 p-2 rounded-lg cursor-pointer ${
                  item?.state &&
                  "bg-gradient-to-tr  from-cyan-600 to-cyan-900 text-white"
                }`}
              >
                {item?.category}
              </span>
            ))}
          </div>

          <div className="flex w-full p-2 gap-2 items-center ">
            <span className="font-semibold">sort:</span>
            <div className="flex gap-3 w-full overflow-auto items-center">
              {sortList.map((items, index) => (
                <span
                  key={index}
                  className="flex gap-3 bg-gray-200 p-2 *:cursor-pointer rounded-md"
                >
                  <Inputs
                    type="radio"
                    name="sort"
                    id={items?.id}
                    onChange={() => sorting(items?.id)}
                  />
                  <label htmlFor={items?.id}>{items?.name} </label>
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className="bg-slate-900" />
        {wishList?.length > 0 && (
          <motion.div
            variants={listVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5 lg:gap-16  lg:grid-cols-[repeat(auto-fit,minmax(430px,1fr))]"
          >
            <AnimatePresence mode="popLayout">
              {originalWishList?.map((item,index) => {
                const discountPrice = originalWishList[index]?.price - (originalWishList[index]?.price * originalWishList[index]?.discount?.percentage) / 100;
                const isDiscountIsActive = originalWishList[index]?.discount?.isActive;
                const generalPrice = isDiscountIsActive ? discountPrice : originalWishList[index]?.price - originalWishList[index]?.discount?.percentage;
                return (<motion.div
                  variants={ItemVariant}
                  key={item.id}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    damping: 20,
                    type: "spring",
                    stiffness: 80,
                  }}
                  className="flex bg-white flex-col cursor-pointer hover:bg-gray-400/20 shadow-xl p-3 rounded-lg gap-5"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        Array.isArray(item?.image)
                          ? item?.image[0]
                          : item?.image
                      }
                      className="w-[270px] h-[250px] xs:w-[170px] xs:h-[150px] shadow-xl rounded-lg"
                      onClick={() => navigation(item?.id)}
                      alt={item?.name}
                    />
                    <div className="flex flex-col shadow-inner shadow-slate-900 rounded-lg p-2 gap-2">
                      <h1 className="font-semibold  antialiased">
                        {item?.name}
                      </h1>
                      <p className="font-mono">₹{generalPrice.toFixed(2)}</p>
                      <p className="line-clamp-2 font-serif">
                        {item?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mb-0 gap-3 mt-auto">
                    <RatingComp
                      size="small"
                      value={item?.rating}
                      color="#053B5AFF"
                    />
                    <AddToCart
                      userData={userData}
                      product={item}
                      userLogin={userLogin}
                    />
                    <AddToWishList
                      userData={userData}
                      wishList={wishList}
                      userLogin={userLogin}
                      product={item}
                    />
                  </div>
                </motion.div>);
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default WishList;
