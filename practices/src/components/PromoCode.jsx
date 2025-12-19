import { Inputs, Form } from "../components/layouts/layouts";
import { useContext, useRef} from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import {setSessionStorage} from "../functions/localStorage" 
import {toast} from "react-toastify";

const PromoCode = () => {
  const { offerdetails } = useContext(myContext);
  const inputData = useRef(null);
  function promoCode(e) {
    e.preventDefault();
    let code = inputData.current.value;
    if (code === offerdetails[0]?.promoCode[0]) {
        let currentDate = new Date();
        let expiryDate = offerdetails[0]?.promoCode[2];
        let expireAt = new Date(expiryDate);
        console.log(expireAt<=currentDate);
        if (expireAt <= currentDate) {
           toast.warning("offer expired please try another promo code");
          return;
        }
        setSessionStorage("promoCode",offerdetails[0]?.promoCode[0]);
        // console.log("offer applied");
        toast.success("offer applied");
        window.dispatchEvent(new Event(("storage")));
        inputData.current.value = "";
      }else{
        toast.warning("invalid code");
       
    }
  }





  return (
    <>
      <span className="promo w-max ">
        <Form onSubmit={promoCode} id="promocode" className="rounded-full shadow-lg  w-fit">
          <Inputs
            type="text"
            placeholder="Enter code"
            name="promocode"
            className="p-2 pl-4 outline-none "
            ref={inputData}
            required
          />
          <button
            type="submit"
            className="bg-yellow-600 rounded-full p-2 px-4 "
          >
            Apply
          </button>
        </Form>
      </span>
    </>
  );
};

export default  PromoCode;
