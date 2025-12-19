import { Form } from "../components/layouts/layouts";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useSubmitFeed } from "../hooks/useItems.js";
import { useContext, useEffect, useRef } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, AnimatePresence } from "framer-motion";

const FeedBackForm = () => {
  const { FeedFormPopUp, userData,setFeedFormPopUp} = useContext(myContext);
  const reset = useRef(null);

  function handleClose() {
    setFeedFormPopUp(false);
    console.log(FeedFormPopUp);
  }

  const { mutate: submitFeedback, isPending, isSuccess } = useSubmitFeed();

  const feedFormHanlde = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const form = Object.fromEntries(formData.entries());
    const submissionStructure = {
      userId: userData?.uid,
      email: form.email,
      feedback: form.feedback,
    };

    console.log(submissionStructure);
    submitFeedback(submissionStructure);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      handleClose();
      reset.current.reset();
    }
  }, [isPending, isSuccess]);

  return (
    <>
  <AnimatePresence>{FeedFormPopUp &&
   (<motion.div initial={{opacity:0,zIndex:9999,y:100}} animate={{y:0,zIndex:9999,opacity:1,position:"fixed"}} exit={{opacity:0,y:100}} className="z-[9999] h-[100vh] backdrop-blur-md flex justify-center items-center w-full">
     <motion.dialog
        open
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y:0 ,zIndex:"100"}}
        exit={{ opacity: 0, y: 100 }}
        className="z-50 px-2 py-2 rounded-xl flex flex-col min-w-[350px] md:w-[500px]"
      >
        <DialogTitle
          sx={{
            fontSize: 38,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            fontFamily: "cursive",
          }}
        >
          {"Feedback"}
          {<FeedbackIcon />}
        </DialogTitle>

        <Form
          onSubmit={feedFormHanlde}
          ref={reset}
          className="bg-white w-full h-max flex flex-col gap-5 px-5"
        >
          <TextField
            label="E-mail"
            type="email"
            name="email"
            variant="outlined"
            autoComplete="off"
            required
          />
          <TextField
            label="Feedback"
            type="text"
            name="feedback"
            variant="filled"
            multiline
            rows={4}
            required
          />
          <DialogActions>
            <Button onClick={handleClose} variant="link">
              cancle
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isPending === true}
              sx={{ backgroundColor: "#003450FF" }}
            >
              {isPending ? (
                <CircularProgress size={20} sx={{ color: "#0c4a6e" }} />
              ) : (
                "submit"
              )}
            </Button>
          </DialogActions>
        </Form>
      </motion.dialog>
      </motion.div>)
   }</AnimatePresence>
  
    </>
  );
};

export default FeedBackForm;
