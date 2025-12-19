import { useState, useRef, useCallback,useContext} from "react";
import { Form, Inputs } from "../layouts/layouts";
import { Button, DialogActions } from "@mui/material";
import { wordCounter } from "../../functions/eventHandlingFn";
import {useReasonSubmission} from "../../hooks/usePolicy";
import { myContext } from "../GlobalStates/contextHooks";
import { toast } from "react-toastify";
import ReturnEnqueryCall from "../contactInfo/returnEnqueryCall";


const ReasonSelection = ({handleClose,orderId}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonValue, setOtherReasonValue] = useState("");
  const wordCount = useRef(0);
  const {userData,setEnquiryCallSlide} = useContext(myContext);

  const { mutate:ReasonSubmission,isPending:reasonPending,isSuccess:reasonSuccess} = useReasonSubmission();

  const reasons = [
    "The item arrived with physical damage or manufacturing defects.",
    "The product delivered doesn't match what was ordered (wrong size, color, or model).",
    "The product quality does not meet your expectations or description.",
    "You changed your mind, or no longer require the item.",
    "The product arrived much later than promised, making it useless for your needs.",
    "The item didn't match the description or images provided by the seller.",
  ];

  const handleLiClick = useCallback((reason) => {
    setSelectedReason(reason);
  }, []);

  const handleOtherReasonChange = useCallback((e) => {
    const inputValue = e.target.value;
    const currentWordCount = wordCounter(inputValue);
    
    // Allow typing if under limit or if deleting text
    if (currentWordCount <= 25 || e.nativeEvent.inputType === "deleteContentBackward") {
      setOtherReasonValue(inputValue);
      wordCount.current = currentWordCount;
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const otherReason = e.target.elements["otherReason"]?.value;
    const finalReason = otherReason 
      ? { otherReason, selectedReason }
      : selectedReason;

    console.log("Selected Reason:",finalReason);
    setSelectedReason(finalReason);
    
    if (otherReason) {
      e.target.elements["otherReason"].value = "";
      setOtherReasonValue("");
      wordCount.current = 0;
    }

    ReasonSubmission({userId:userData?.uid,reasonObj:{orderId,finalReason}},{
    onSuccess:(data)=>{
        if(data?.message){ 
          toast.success(data?.message);
          setOtherReasonValue("");
          setSelectedReason("");
          setEnquiryCallSlide(true);
        }else{
          if(data?.error){
          toast.error(data?.error);
        }else{
            toast.warning(data?.warning);
            setEnquiryCallSlide(true);
        }
        }
    }
  });

  }, [selectedReason]);

  return (
    <div className="w-full flex flex-col">
      {!reasonSuccess ? <Form onSubmit={handleSubmit} className="w-full">
        <ul className="*:p-3 *:shadow-inner *:shadow-slate-600 *:rounded-md flex flex-col gap-4 *:font-serif">
          {reasons.map((reason, index) => (
            <li
              key={index}
              className={`cursor-pointer ${
                selectedReason === reason ? "bg-sky-900 text-white" : ""
              }`}
              onClick={() => handleLiClick(reason)}
            >
              {reason}
            </li>
          ))}
        </ul>

        <div className="flex w-full gap-3 mt-5 items-center font-serif">
          <label htmlFor="reason">Other:</label>
          <Inputs
            type="text"
            name="otherReason"
            placeholder="Other reason"
            onChange={handleOtherReasonChange}
            value={otherReasonValue}
            className="flex p-2 outline-none border-b-4 w-full"
          />
        </div>
        <span className={`flex justify-end w-full ${
          wordCount.current >= 25 ? "text-green-600" : ""
        }`}>
          {wordCount.current}/25
        </span>
        <DialogActions className="mt-4" sx={{paddingLeft:0,paddingRight:0}}>
        <Button variant="text" onClick={handleClose} >
          cancle
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={reasonPending}
          disabled={!selectedReason||(otherReasonValue &&  wordCount.current < 10) || wordCount.current > 25 || reasonPending}
          sx={{ backgroundColor: "#0c4a6e" }}
        >
          Submit
        </Button>
        </DialogActions>
      </Form>:<ReturnEnqueryCall/>}
    </div>
  );
};

export default ReasonSelection;