import { useSearchParams } from "react-router-dom";
import { useEffect, useState,useContext} from "react";
import { motion } from "framer-motion";
import { useFilterByCategory } from "../../../api/getItems";
import { PopUpLoading } from "../../loading";
import {useSelection} from "../../../functions/searchFunction";
import { useNavigate } from "react-router-dom";
import { RupeeSymbol } from "../../layouts/layouts";
import RatingComp from "../../Rating";
import AddToCart from "../../features/AddToCart";
import AddToWishList from "../../features/AddToWishList";
import { myContext } from "../../GlobalStates/contextHooks";
import {priceFormatter} from "../../../functions/eventHandlingFn";

export const CategoryProducts = () => {
  const [catFilter, setCatFilter] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { products: filterProducts } = useFilterByCategory(category);
  const productSelection = useSelection();
  const navigate = useNavigate();
  const {userLogin, wishList, userData} = useContext(myContext);

  function Navigation(id){
    productSelection(id,navigate);
  }

  useEffect(() => {
    if (category && filterProducts?.length > 0) {
      const imagesArray = filterProducts.map((p) => {
         return p[1]?.image;
      })
      setCatFilter(imagesArray);
    }
  }, [category, filterProducts]);
  console.log("filterProducts", catFilter);

 if(!filterProducts){
    return <PopUpLoading size={60}/>
 }

  return (
    <>
      <main className="flex">
        <div className="flex m-5">
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] 2xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]  lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]   md:gap-5 gap-8 *:ring-1 *:ring-slate-200   *:shadow-lg *:rounded-md  *:p-2 md:px-7 py-1 px-1 md:py-5 *:cursor-pointer">
            {filterProducts?.map((items) => {
            const product = Array.isArray(items) ? items[1] : items;
              return (
                <motion.li
                  key={items?.id}
                  className="transition  ease-linear flex max-w flex-col justify-between hover:shadow-2xl hover:ring-2 hover:ring-slate-300 text-sm 2xl:text-3xl gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-lg font-medium">{product?.name}</span>
                  <img className="flex flex-grow" onClick={() => Navigation(items?.id)} src={Array.isArray(product?.images) ? product?.images[0] : product?.image} alt={product.name} />
                  <div className="flex flex-col gap-5">
                  <span className="font-medium text-lg"><RupeeSymbol/>{priceFormatter(product?.price)}</span>
                  <span className="flex w-full justify-end"><RatingComp size="small" value={product?.rating.toFixed(1)} color={"#001750FF"}/></span>
                  <p className="line-clamp-2 text-lg px-2">{items?.description}</p>
                     
                  </div>
                  <div className="flex justify-end gap-5 items-center">
                      <AddToCart
                          userData={userData}
                          product={items}
                          type="plus"
                          userLogin={userLogin}
                        />
                        <AddToWishList
                          userLogin={userLogin}
                          wishList={wishList}
                          userData={userData}
                          product={items}
                        />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
};
