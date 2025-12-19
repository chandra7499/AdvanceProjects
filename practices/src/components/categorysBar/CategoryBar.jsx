import { NavLink, useSearchParams } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { myContext } from "../../components/GlobalStates/contextHooks";
import { useRef, useContext, useState} from "react";
import { motion } from "framer-motion";
import {useRealTimeCategories} from "../../api/getItems";


export const CategoryBar = () => {
  const categoryBar = useRef(null);
  const { catVisible } = useContext(myContext);
  const [hoverIndex,setHoverIndex] = useState(null);
  const AllProducts = useRealTimeCategories();

  const scrollLeft = () => {
    categoryBar.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    categoryBar.current.scrollBy({ left: 150, behavior: "smooth" });
  };


  // let uniqueImage = AllProducts.map(
  //   (item) =>
  //     AllProducts?.filter((product) => product.category === item)[0].image
  // );

  const [searchParms] = useSearchParams();
  let currentCategory = searchParms.get("category");
  

  return (
    <>
      <div
        className={`categoryBar fixed z-40 lg:left-16   lg:w-[calc(100%-4rem)]  w-full border-b-slate-700  border-b-[0.5px]  top-0  flex-row bg-white flex   transition-transform duration-300 ease-in-out ${
          catVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {
          <ChevronLeftIcon
            sx={{
              fontSize: { xl: "2rem", md: "2rem" },
              cursor: "pointer",
              display: { display: "none", sm: "none", lg: "flex", xl: "flex" },
              marginTop: "auto",
              marginBottom: "auto",
            }}
            onClick={scrollLeft}
          />
        }

        <ul
          ref={categoryBar}
          className="flex flex-row w-full   justify-evenly py-1 scrollbar-hide  px-2 items-center  text-lg overflow-x-scroll  gap-6 snap-x snap-mandatory"
        >
          {AllProducts?.map((item, index) => {
            return (
              <motion.li
                key={index}
                onHoverStart={() => setHoverIndex(index)}
                onHoverEnd={() => setHoverIndex(null)}
                className="lg:text-sky-950 group z-[9999] flex-shrink-0 bg-gray-300 relative hover:cursor-pointer  lg:hover:text-slate-100 rounded-lg max-w  text-sm xlll:text-lg lg:overflow-hidden  flex flex-row"
              >
               
               <motion.div initial={{x:-200}} animate={{x:hoverIndex === index ? 0 : -200,opacity:hoverIndex === index ? 1 : 0}} exit={{x:200}} transition={{type:"tween",duration:0.3}} className={`absolute w-full h-full lg:flex hidden  rounded-lg  top-0 left-0 -z-10 bg-gradient-to-r from-sky-900 to-sky-600`}></motion.div>
                <NavLink
                  className={
                    currentCategory === item?.category
                      ? "text-slate-900 underline font-bold hover:text-white tracking-normal "
                      : "text-grey-500 "
                  }
                  to={`/products?category=${encodeURIComponent(item?.category)}`}
                >
                  <div className="flex gap-3 w-max p-2 items-center max-h">
                   
                      <img
                        className="w-8 h-7 rounded-full"
                        src={Array.isArray(item?.image) ? item?.image[0] : item?.image}
                        alt="img"
                      />
                  
                    <p className="max-w ">{item?.category}</p>
                   
                  </div>
                </NavLink>
               
              </motion.li>
            );
          })}
        </ul>
        <ChevronRightIcon
          sx={{
            fontSize: { xl: "2rem", md: "2rem" },
            cursor: "pointer",
            display: { display: "none", sm: "none", lg: "flex", xl: "flex" },
            marginTop: "auto",
            marginBottom: "auto",
          }}
          onClick={scrollRight}
        />
      </div>
    </>
  );
};
