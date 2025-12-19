import Dialog from "@mui/material/Dialog";
import { useContext } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import DialogTitle from "@mui/material/DialogTitle";
export const PopUps = ({ open, setOpen, title, fullWidth,children }) => {
  const { setEnquiryCallSlide } = useContext(myContext);
  function handlePopClose() {
    setOpen(false);
    setEnquiryCallSlide(false);

  }




  return (
    <>
      <Dialog
        open={open}
        onClose={handlePopClose}
        disableEnforceFocus
        disableRestoreFocus
        disableScrollLock={false}
        fullWidth={fullWidth}
               
      >
        <DialogTitle
          sx={{
            fontSize: { md: "2.1rem", xs: "1.5rem", sm: "1.5rem" },
            fontFamily: "sans",
            flexDirection: "row",
            display: "flex",
            transition: "all 0.2s ease-in-out",
            justifyContent: "center",
            alignItems: "center",
            overflow:"hidden"
          }}
          width="100%"
        >
          {title}
        </DialogTitle>

        {children}
      </Dialog>
    </>
  );
};
