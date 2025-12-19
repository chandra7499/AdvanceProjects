import { NavLink } from "react-router-dom";
import { style } from "../styles/style";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useContext, useEffect, useRef } from "react";
import { myContext } from "../GlobalStates/contextHooks";
import { useLogout } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TitleToolTip } from "../../components/layouts/layouts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ToggleSider from "../sidebar/toggleSider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export const SideBar = () => {
  const { userLogin, navSlide, userData, setNavSlide, setFeedFormPopUp } =
    useContext(myContext);
  const slideRef = useRef(null);

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      toast.success("logged out successfully");
    },

    onError: () => {
      toast.error("no some thing went wrong");
    },
  });

  function FeedPopup() {
    setFeedFormPopUp(true);
  }

  useEffect(() => {
    if (navSlide) {
      document.documentElement.style.overflow = "hidden"; // For some browsers
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [navSlide]);

  // useEffect(() => {
  //   if (navSlide) {
  //     document.addEventListener("mousedown", handleOutSideClick);
  //   } else {
  //     document.removeEventListener("mousedown", handleOutSideClick);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleOutSideClick);
  //   };
  // }, [navSlide]);

  const sideBarMobileVariants = [
    { name: "Home", icon: <HomeIcon />, path: "/" },
    { name: "Orders", icon: <Inventory2Icon />, path: "/orders" },
    { name: "cart", icon: <ShoppingCartIcon />, path: "/cartItems" },
    {
      name: "Account",
      icon: <AccountCircleIcon />,
      path: `/userProfile/${userData?.uid}`,
    },
    { name: "wishList", icon: <FavoriteBorderIcon />, path: "/wishList" },
    { name: "settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const sideBarBtnVariants = [
    { name: "notification", icon: <NotificationsIcon />, fn: () => {} },
    {
      name: "Feedback",
      icon: <FeedbackIcon />,
      fn:FeedPopup,
    },
    { name: "bug", icon: <BugReportIcon />, fn:{}},
  ];

  const sideBarWebVariants = [
    {
      name: "Account",
      icon: <AccountCircleIcon />,
      path: `/userProfile/${userData?.uid}`,
    },
    { name: "settings", icon: <SettingsIcon />, path: "/settings" }
  ];

  function handleOutSideClick(e) {
    if (navSlide && slideRef.current && !slideRef.current.contains(e.target)) {
      setNavSlide(false);
    }
  }

  return (
    <>

      <aside
        ref={slideRef}
        className="lg:w-[4rem]  lg:h-screen hidden lg:flex lg:sticky lg:top-0  z-50 rounded-r-lg "
      >
        <div className=" w-full h-full bg-slate-100 shadow-inner shadow-gray-400  px-3 overflow-hidden ">
          <div className="w-full flex flex-row my-2 mb-5  text-nowrap"></div>
          <ul className="w-full  h-full flex flex-col gap-5 overflow-x-hidden">
            {sideBarWebVariants.map((items,index)=>(<TitleToolTip
              title={items.name}
              placement="right-start"
              disableInteractive
              key={index}
            >
              <span>
                <NavLink
                  to={`${items.path}`}
                  className={({ isActive }) =>
                    isActive
                      ? `${style.activatedLink} md:flex lg:flex`
                      : `${style.generalHover} md:flex lg:flex`
                  }
                >
                
                  {items.icon}
                </NavLink>
              </span>
            </TitleToolTip>))}
            {/* <TitleToolTip
              title="settings"
              placement="right-start"
              disableInteractive
            >
              <span>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? `${style.activatedLink} md:flex lg:flex `
                      : `${style.generalHover} md:flex lg:flex`
                  }
                >
                  <SettingsIcon />
                </NavLink>
              </span>
            </TitleToolTip> */}
            {sideBarBtnVariants.filter((items)=>(items.name!=="notification")).map((items,index)=>(<TitleToolTip
              title={items.name}
              placement="right-start"
              disableInteractive
              key={index}
            >
              <button className={`${style.btnStyle}`} onClick={()=>items?.fn()}>
      
               {items.icon}
              </button>
            </TitleToolTip>))}
            {/* <TitleToolTip
              title="Bug Report"
              placement="right-start"
              disableInteractive
            >
              {" "}
              <button className={`${style.btnStyle}`}>
                {" "}
                <BugReportIcon />
              </button>
            </TitleToolTip> */}

            {userLogin && (
              <TitleToolTip
                title="Logout"
                placement="right-start"
                disableInteractive
              >
                <button
                  className={`${style.btnStyle} mt-auto mb-10`}
                  onClick={() => logout()}
                >
                  {" "}
                  <LogoutIcon /> logout
                </button>
              </TitleToolTip>
            )}
          </ul>
        </div>
      </aside>

      <AnimatePresence mode="wait">
        {navSlide && (
          <motion.div
            initial={{ opacity: 0, zIndex: -1 }}
            animate={{ opacity: 1, zIndex: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }} // Added easing
            className=" w-[100%] h-[100%] fixed bg-transparent   backdrop-blur-lg lg:hidden  2xl:hidden xll:hidden "
          >
            <ToggleSider
              rotation="-180"
              event={handleOutSideClick}
              sx={{
                position: "fixed",
                background: "#4545",
                backdropFilter: "blur(12px)",
                color: "navy",
                zIndex: -1,
                fontSize: 40,
                top: 58,
                left: 250,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                transform: `rotate(-180deg)`,
                display: { lg: "none" },
              }}
            />
            <motion.aside
              className="w-[16rem] h-screen min-h-[100%] lg:hidden 2xl:hidden  xll:hidden "
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className=" w-full h-full  bg-slate-100 shadow-xl  py-2 px-3 overflow-y-scroll">
                <h1 className="text-xl mb-5 font-mono w-full text-start px-2">
                  Tazon-Store
                </h1>

                <ul className="w-full  h-screen flex flex-col gap-5 ">
                  {sideBarMobileVariants?.map((item, index) => (
                    <NavLink
                      to={item?.path}
                      key={index}
                      onClick={handleOutSideClick}
                      className={({ isActive }) =>
                        isActive
                          ? `${style.activatedLink} lg:hidden md:flex`
                          : `${style.generalHover} lg:hidden md:flex`
                      }
                    >
                      {item?.icon}
                      {item?.name}
                    </NavLink>
                  ))}

                  {sideBarBtnVariants.map((items, index) => (
                    <button
                      key={index}
                      className={`${style.btnStyle} lg:hidden md:hidden`}
                      onClick={()=>items?.fn()}
                    >
                      {items?.icon}
                      {items?.name}
                      
                    </button>
                  ))}

                  {userLogin && (
                    <button
                      className={`${style.btnStyle} mt-auto lg:mb-20 mb-4`}
                      onClick={() => logout()}
                      onMouseDown={handleOutSideClick}
                    >
                      {" "}
                      <LogoutIcon /> logout
                    </button>
                  )}
                </ul>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
