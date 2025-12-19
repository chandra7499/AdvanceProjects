import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRef, useState, useEffect } from "react";

const SlideOverflow = ({ children }) => {
  const slideScroll = useRef();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkOverflow = () => {
    const container = slideScroll.current;
    if (!container) return;
    setIsOverflowing(container.scrollWidth > container.clientWidth);
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 1);
  };

  const handleScroll = () => checkOverflow();

  const scrollLeft = () => {
    const container = slideScroll.current;
    const childWidth = container.firstChild?.offsetWidth || 150;
    container.scrollBy({ left: -childWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = slideScroll.current;
    const childWidth = container.firstChild?.offsetWidth || 150;
    container.scrollBy({ left: childWidth, behavior: "smooth" });
  };

  // run on first render and whenever window resizes
  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]); // dynamic update when children count changes

  return (
    <>
      <section className="relative flex flex-col bg-white overflow-hidden snap-center py-2 px-2">
        {/* Scroll Left */}
        {isOverflowing && !isAtStart && (
          <span
            className="absolute rounded-full lg:flex hidden  bg-slate-900/80 text-white cursor-pointer top-0 bottom-0 left-0  items-center justify-center h-max my-auto z-10"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon sx={{ fontSize: "3rem" }} />
          </span>
        )}

        {/* Scroll Container */}
        <div
          ref={slideScroll}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-5 w-full px-5 py-5 snap-center"
        >
          {children}
        </div>

        {/* Scroll Right */}
        {isOverflowing && !isAtEnd && (
          <span
            className="absolute rounded-full lg:flex hidden bg-slate-900/80 text-white cursor-pointer top-0 bottom-0 right-0  items-center justify-center h-max my-auto z-10"
            onClick={scrollRight}
          >
            <ChevronRightIcon sx={{ fontSize: "3rem" }} />
          </span>
        )}
      </section>
    </>
  );
};

export default SlideOverflow;
