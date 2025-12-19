import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
const Dotprogress = ({ delay, totalDuration ,fn }) => {
  const progress = useRef(0);
  const barStyle = useRef(null);
  useEffect(() => {
    const increament = 100 / (totalDuration / delay);
    progress.current = 40;
    if (barStyle.current) {
      barStyle.current.style.width = `15%`;
    }
    let interval = setInterval(() => {
      if (progress.current >= 100) {
        progress.current = 100;
        barStyle.current.style.width = `100%`;
        fn();
      } else {
        progress.current += increament;
        if (barStyle.current) {
          barStyle.current.style.width = `${progress.current}%`;
        }
      }
    }, delay);
    return () => clearInterval(interval);
  }, [delay,totalDuration]);

  return (
    <>
      <motion.div initial={{width:8}} animate={{width:50}} transition={{duration:0.5,type:"spring",stiffness:500,damping:15}} className="h-3 bg-slate-300  rounded-full transition-all duration-400 ease-in-out">
        <div
          ref={barStyle}
          className={`h-3 bg-stone-900 w-max flex flex-shrink-0 rounded-full transition-all duration-300 ease-in-out`}
          
        ></div>
      </motion.div>
    </>
  );
};

export default Dotprogress;
