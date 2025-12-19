import axios from "axios";
import {nanoid} from "nanoid";

const api_url = import.meta.env.VITE_API_BASE_URL;

export const handlePayments = async (finalPrice,navigate,setPaymentModeLoader,section,selectedItems,) => {
  console.log("inside", "finalPrice",finalPrice, "section",section, "selectedItems",selectedItems);
  try {
    setPaymentModeLoader?.(true);
    const response = await axios.post(`${api_url}/create-order`, {
      amount: finalPrice,
      currency: "INR",
    });

    const order = response.data;
    console.log(order);

    if (!order.id) {
      setPaymentModeLoader?.(false);
      console.log("data is not recieved");
      return;
    }
    setPaymentModeLoader?.(false);
    navigate(`/checkout/${order.id}`,{state:{order:order,section:section,selectedItems:selectedItems}});
  } catch (err) {
    console.log("Payment error ", err.message);
  }
};

export const generateCODID = ()=>{
  const id = nanoid(12);
  return `COD_${id}`;
}
