import { motion } from "framer-motion";

const RoutesVariants = {
    hidden: {opacity:0,x:100},
    enter: {opacity:1,x:0},
    exit: {opacity:0,x:100},
};

export const PageTransition = ({children}) => {
  return (
    <>
      <motion.div
        variants={RoutesVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.8 }}
     
      >
        {children}
      </motion.div>
    </>
  );
};
