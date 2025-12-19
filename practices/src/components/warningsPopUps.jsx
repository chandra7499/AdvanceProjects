import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import DialogActions from "@mui/material/DialogActions";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { TitleToolTip } from "../components/layouts/layouts";
import propType from "prop-types";

const WarningsPopUps = ({ naviagationUrl,naviagationUrl2, message, title }) => {
  const navigate = useNavigate();
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ y: 0, opacity: 1, zIndex: 9999, position: "absolute" }}
          exit={{ opacity: 0, y: 100 }}
          className="z-[9999]  h-[100vh] backdrop-blur-md flex justify-center  items-center w-full"
        >
          <dialog
            open
            className="flex flex-col flex-wrap  md:max-w-[50%] mx-5 md:mx-auto justify-center items-center absolute bottom-0  bg-yellow-500 rounded-md p-3  gap-4 shadow-xl"
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: "2.5rem" }}>
              {<ReportProblemIcon />}
              {`${title}`}
            </DialogTitle>
            <p className="font-mono text-2xl  text-start px-2">{message}</p>
            <DialogActions   sx={{ marginLeft: "auto", marginRight: "0" }}>
              <TitleToolTip 
                 title="if you want to select items go to cart page before payment"
                 placement="top-start"
                 sx={{zIndex:9999}}
                 disableInteractive
              >
                <Button
                  variant="contained"
                  onClick={() => navigate(`/${naviagationUrl}`)}
                >
                   Cart
                </Button>
              </TitleToolTip>
              <TitleToolTip 
                 title="if you already selected items go to delivery-details page and continue your payment"
                 placement="top-start"
                 sx={{zIndex:9999}}
                 disableInteractive
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor:"purple" }}
                  onClick={() => navigate(`/${naviagationUrl2}`)}
                >
                  delivery-details
                </Button>
              </TitleToolTip>
            </DialogActions>
          </dialog>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

WarningsPopUps.propTypes = propType.node.isRequired;

export default WarningsPopUps;
