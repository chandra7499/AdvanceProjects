import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const MiniCarosels = ({ data, typeView = true, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  function slideLeft() {
    setSlideIndex((prevIndex) => {
      const next = prevIndex - 1 + (data?.length % data?.length);
      onSlideChange?.(next);
      return next;
    });
  }

  function slideRight() {
    setSlideIndex((prevIndex) => {
      const next = (prevIndex + 1) % data?.length;
      onSlideChange?.(next);
      return next;
    });
  }

  return (
    <>
      <div className="overflow-hidden flex  items-center  relative  rounded-lg w-full">
        <div
          className="flex transition-transform h-full  items-center ease-in-out duration-500 "
          id="productView"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {data?.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full w-full justify-center  flex rounded-xl items-center"
            >
              <img
                src={item}
                alt={`$View${index + 1}`}
                className="w-max-[40rem] h-max-[40rem] aspect-auto items-center object-contain flex bg-white rounded-xl"
              />
            </div>
          ))}
        </div>
        <div className="absolute flex w-full p-2 justify-between h-full  items-center">
          {data?.length > 1 && (
            <ArrowBackIosIcon
              onClick={slideLeft}
              className="bg-gray-400  rounded-full"
              sx={{
                fontSize: { xs: "2rem", md: "2rem", lg: "3rem" },
                cursor: "pointer",
                padding: { xs: "0.4rem", md: "0.7rem", lg: "0.7rem" },
              }}
            />
          )}
          {data?.length > 1 && (
            <ArrowForwardIosIcon
              onClick={slideRight}
              className="rounded-full bg-gray-400"
              sx={{
                fontSize: { xs: "2rem", md: "2rem", lg: "3rem" },
                cursor: "pointer",
                padding: { xs: "0.4rem", md: "0.7rem", lg: "0.7rem" },
              }}
            />
          )}
        </div>
      </div>

      {data && typeView && (
        <div className="flex h-full gap-5 mt-5 w-full  items-center  md:justify-normal overflow-scroll  mr-auto ml-auto ">
          {data?.map((item, index) => (
            <img
              key={index}
              src={item}
              alt={`$View${index + 1}`}
              onClick={() => {
                setSlideIndex(index);
              }}
              className={`w-20 h-20   cursor-pointer p-1 rounded-md ${
                slideIndex === index
                  ? "border-2 transition duration-500 border-sky-700"
                  : ""
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MiniCarosels;
