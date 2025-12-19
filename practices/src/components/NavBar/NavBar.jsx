import { Link } from "react-router-dom";
import { myContext } from "../GlobalStates/contextHooks.js";
import { useContext, useState, useEffect, useRef, lazy, Suspense } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
// import products from "../JsonData/data.json";
import { TitleToolTip } from "../../components/layouts/layouts";
import Cartbtn from "../AppContent/Cartbtn.jsx";
const SearchRoller = lazy(() =>
  import("../AppContent/search/searchRoller.jsx")
);
const WishList = lazy(() => import("../AppContent/navigationBtn/wishList.jsx"));
const Orderbtn = lazy(() => import("../AppContent/navigationBtn/Orderbtn.jsx"));
import { useProfileupdate } from "../../api/updates.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchFunction } from "../../functions/searchFunction.js";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {useNavigate} from "react-router-dom"
export const NavBar = () => {
  const {
    loginPopUp,
    userLogin,
    userData,
    catVisible,
    setCatvisible,
    setFilter,
    prevScrollY,
    searchItems, 
    setSearchItems,
    setPrevScrollY,
    filter:SearchPreviews
  } = useContext(myContext);
  const [search, setSearch] = useState(false); //search animation
  const AutoFocus = useRef(null);
  const FilterProducts = useSearchFunction(searchItems);
  const navigate = useNavigate();

  function popUp() {
    if (loginPopUp?.current) {
      loginPopUp.current.showModal();
    }
  }

  const fastProfile = useProfileupdate(userData?.uid);

  const profile =
    userData?.profile === "" ||
    userData?.profile === null ||
    userData?.profile === undefined ||
    userData?.profile === "unknown";
  const email =
    userData?.email === "" ||
    userData?.email === null ||
    userData?.email === undefined ||
    userData?.email === "unknown";

  function searchState() {
    AutoFocus.current.focus();
    setSearch((prev) => !prev);
    setSearchItems((AutoFocus.current.value = ""));
  }

  function handleSearch(e) {
    setSearchItems(e.target.value.trim());
  }

  useEffect(() => {
    setFilter(FilterProducts);
  }, [FilterProducts, searchItems, setFilter]);

  useEffect(() => {
    const handleScroll = () => {
      let currentScroll = window.scrollY;
      if (currentScroll > prevScrollY) {
        setCatvisible(false);
      } else {
        setCatvisible(true);
      }
      setPrevScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY, setPrevScrollY, setCatvisible]);

  useEffect(()=>{
    function handleSearch(e){
    
        if(e.key === "Enter" && searchItems.trim() !== ""){
           navigate(`/search`,{state:{searchName:searchItems,partialSearch:true}});
           setSearchItems("");
        }
    }

    document.addEventListener("keydown",handleSearch);
    return () => document.removeEventListener("keydown",handleSearch);

  },[searchItems,SearchPreviews,navigate]);

 

  return (
    <>
      <Suspense
        fallback={
          <CircularProgress
            size={30}
            sx={{ color: "#FFFFFFFF", width: "100%", height: "100%" }}
          />
        }
      >
        <SearchRoller />
      </Suspense>

      <nav
        className={`nav lg:w-[calc(100%-4rem)] lg:left-16  items-center bg-sky-950 flex flex-row  fixed top-0 w-full  z-50 lg:py-[0.4rem] py-[0.2rem]  justify-between  md:px-8  xll:px-8 px-3 2xl:py-1 transition-transform duration-300 ease-in-out ${
          catVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link
          to="/"
          className="title text-white font-[cursive] text-2xl flex justify-center items-center gap-2  text-nowrap "
        >
          Tarzon-store
          <img
            src="Flux_Dev_a_dynamic_illustration_of_Tarzan_with_a_lush_green_fo_0 Background Removed.png"
            className="w-[2.5rem] xs:w-[2rem] xs:h-[2rem] h-[2.5rem] scale-[1.5]"
          />
        </Link>
        <div className="md:flex  lg:mr-1 max-w md:justify-start flex   items-center bg-slate-900  md:mr-2 ml-auto z-50 md:relative md:top-0 md:bg-transparent  justify-center  md:right-0 scale-[0.7] gap-1 md:scale-[1]  py-1   rounded-full">
          <span
            className={`flex flex-row max-w justify-center px-2 py-1  rounded-md w-full items-center ${
              search && "md:ring-1 md:ring-gray-500"
            }`}
          >
            <motion.input
              type="search"
              placeholder="Search"
              onChange={handleSearch}
              defaultValue={searchItems}
              ref={AutoFocus}
              className="outline-none bg-transparent placeholder:text-white    md:placeholder:text-white text-white"
              initial={{ width: 0, opacity: 0 }}
              animate={
                search
                  ? { width: 180, opacity: 1, paddingLeft: "9px" }
                  : { width: 0, opacity: 0 }
              }
              transition={{ duration: 0.5 }}
            />
            <TitleToolTip title="search" arrow disableInteractive>
              <SearchIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  zIndex: "1",
                  fontSize: 28,
                }}
                onClick={searchState}
              />
            </TitleToolTip>
          </span>
        </div>
        {userLogin && (
          <div className="cart  *:text-white mr-3 md:justify-center md:items-center lg:flex gap-4  *:rounded-full   xll:*:px-1 xll:*:text-lg lg:*:text-lg  xlll:*:py-1  hidden w-max transition ease-in-out duration-200">
            <Suspense
              fallback={
                <CircularProgress
                  size={30}
                  sx={{ color: "#FBFBFBFF", width: "auto", height: "auto" }}
                />
              }
            >
              <Cartbtn />
            </Suspense>

            <Suspense
              fallback={
                <CircularProgress
                  size={30}
                  sx={{ color: "#FBFBFBFF", width: "auto", height: "auto" }}
                />
              }
           >
              <Orderbtn />
            </Suspense>

            <Suspense
              fallback={
                <CircularProgress
                  size={30}
                  sx={{ color: "#FBFBFBFF", width: "auto", height: "auto" }}
                />
              }
            >
              <WishList />
            </Suspense>

            <TitleToolTip title="notifications" arrow disableInteractive>
              <span className="text-white hidden  md:hidden lg:flex">
                <NotificationsNoneOutlinedIcon sx={{ cursor: "pointer" }} />
              </span>
            </TitleToolTip>
          </div>
        )}
        {!userLogin && (
          <div className="text-slate-50 ">
            <button
              onClick={popUp}
              className="hover:bg-gray-600 p-1 rounded-md px-2"
            >
              Login
            </button>
          </div>
        )}
        {userLogin && userData && (
          <div className="text-slate-50 cursor-pointer rounded-full bg-gray-600 *:text-2xl mx-2 flex justify-center items-center">
            {!profile ? (
              <img
                src={fastProfile || userData?.profile}
                className="w-9 h-9 rounded-full"
              />
            ) : !email ? (
              <TitleToolTip title={userData.email} arrow>
                <p className="px-2">{userData.email[0]?.toUpperCase()}</p>
              </TitleToolTip>
            ) : (
              <p className="px-2">
                {userData?.role?.[0]?.toUpperCase() || "?"}
              </p>
            )}
          </div>
        )}
      </nav>
    </>
  );
};
