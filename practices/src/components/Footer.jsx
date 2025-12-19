import { Link } from "react-router-dom";
import { Main } from "../components/layouts/layouts";
import { FollowUs } from "./contactInfo/followUs";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="bg-stone-900 h-max text-stone-50 h-full p-2 w-full">
        <Main className="flex py-2 px-2 flex-col md:flex-row mb-3">
          <div className="flex md:flex-col mr-2 mb-3 md:mb-0 xs:justify-between">
            <h1 className="text-lg font-[cursive]">Tarzon-Store</h1>
            <img
              src="Flux_Dev_a_dynamic_illustration_of_Tarzan_with_a_lush_green_fo_0 Background Removed.png"
              className="md:w-[12rem] md:h-[12rem] w-[2rem] h-[2rem] xs:mr-auto ml-0"
            />
           <FollowUs props="social-media  flex-col max-w justify-center items-center  xs:rounded-md   xs:ring-gray-300 md:flex gap-3"/>
          </div>
          <div className="grid grid-cols-3 gap-2 shadow-inner shadow-white  rounded-md w-full p-6">
            <Link to="/about">About us</Link>
          </div>
        </Main>
         <p className="text-start text-sm font-medium justify-center items-center p-2 flex text-gray-200">
              copyright@{year} reserved
            </p>
      </footer>
    </>
  );
};

export default Footer;
