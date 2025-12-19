import { DialogActions, Button } from "@mui/material";
import list from "../../functions/DoubleLinkedList";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { motion } from "framer-motion";
import { slideFocus } from "../../functions/eventHandlingFn";
import Dotprogress from "./dotProgress";
import { Minislide } from "../loading";
const MainCarosels = ({ items }) => {
  const [carosels, setCarosels] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const List = new list();
    items?.forEach((item) => {
      List.add(item);
    });
    setCarosels(List);
    setCurrent(List.getCurrent());
  }, [items]);

  const goNext = () => {
    if (carosels) {
      carosels.moveNext();
      setCurrent(carosels.getCurrent());
      slideFocus("dot-scroll", "right", 500);
    }
  };

  const goPrev = () => {
    if (carosels) {
      carosels.movePrev();
      setCurrent(carosels.getCurrent());
      slideFocus("dot-scroll", "left", 500);
    }
  };

  // Helper to get adjacent images
  const getPrev = () => carosels?.current?.prev?.value;
  const getNext = () => carosels?.current?.next?.value;

  const getCurrentIndex = () => {
    if (!carosels || !carosels?.current) return 0;
    let node = carosels?.head;
    let index = 0;
    while (node && node !== carosels?.current) {
      index++;

      node = node?.next;
    }
    return index;
  };

  return (
    <>
      <div className="flex justify-center  w-full md:px-7 items-center overflow-x-scroll">
        {items && (
          <div
            className="flex gap-5 w-full justify-center items-center transition-all duration-100 ease-in-out md:h-[32rem] xlll:h-[42rem] h-[20rem] "
            style={{ perspective: "2560px" }}
          >
            {/* Previous Image - visible only on medium+ screens */}

            {getPrev() && (
              <motion.div
                key={getPrev()?.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: 50, zIndex: 1 }}
                animate={{ opacity: 1, scale: 0.9, rotateY: 95, zIndex: 2 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block w-[40%] origin-left"
              >
                <Link to={getPrev()?.link}>
                  <img
                    src={getPrev()?.image}
                    className="w-full h-full object-contain rounded-xl shadow-md"
                  />
                </Link>
              </motion.div>
            )}
            {/* Current Image */}

            <motion.div
              key={current?.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: 1, zIndex: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 2, zIndex: 10 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.9 }}
              drag="x"
              dragConstraints={{ left: 5, right: 5 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 4) {
                  goPrev();
                } else if (info.offset.x < -4) {
                  goNext();
                }
              }}
              className="w-[95%] z-10 absolute "
            >
              <Link to={current?.link}>
                <img
                  src={current?.image}
                  className="w-full md:h-[30rem] xlll:h-[40rem]   h-[18rem] object-fill rounded-xl "
                />
              </Link>
            </motion.div>

            {/* Next Image - visible only on medium+ screens */}

            {getNext() && (
              <motion.div
                key={getNext()?.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -40, zIndex: 1 }}
                animate={{ opacity: 1, scale: 0.9, rotateY: -95, zIndex: 2 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.8 }}
                className="hidden md:block w-[40%] origin-right"
              >
                <Link to={getNext()?.link}>
                  <img
                    src={getNext()?.image}
                    className="w-full h-full object-contain rounded-xl shadow-md"
                  />
                </Link>
              </motion.div>
            )}
          </div>
        )}
        {!items && (
          <div className="flex gap-5 w-full justify-center rounded-lg items-center relative md:h-[32rem] h-[20rem]" style={{ perspective: "1500px" }}>
            {" "}
           <div className="w-full h-full px-3 rounded-lg py-2"> 
            <Minislide
              height={"100%"}
              width={"100%"}
              baseColor="#CFD1D4FF"
              duration={1.2}
            />
            </div>
          </div>
        )}
      </div>

      <DialogActions
        sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}
      >
        <Button
          variant="link"
          onClick={goPrev}
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}
        >
          <ArrowBackIosIcon />
        </Button>
        <div
          className="flex justify-center items-center  transition-all duration-75 ease-in-out  overflow-scroll scale-[0.7] md:scale-[1]  gap-2"
          id="dot-scroll"
        >
          {Array.from({ length: carosels?.getSize() || 0 })?.map((_, index) => (
            <div key={index} className="flex">
              {index !== getCurrentIndex() ? (
                <div className="w-3 h-3 bg-slate-300 transition-all duration-100 ease-in-out rounded-full"></div>
              ) : (
                <Dotprogress
                  key={current?.id}
                  totalDuration={15000}
                  delay={32}
                  fn={() => goNext()}
                />
              )}
            </div>
          ))}
        </div>
        <Button
          variant="link"
          onClick={goNext}
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}
        >
          <ArrowBackIosIcon sx={{ transform: "rotate(180deg)" }} />
        </Button>
      </DialogActions>
    </>
  );
};

export default MainCarosels;
