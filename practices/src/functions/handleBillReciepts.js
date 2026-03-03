import axios from "axios";
import { toast } from "react-toastify";


export const pdfRecieptGenerator = async(orderData)=>{
    try{
        if(!orderData || orderData === null || orderData === undefined) return;
        const data = JSON.stringify(orderData);
        const api_url = import.meta.env.VITE_API_BASE_URL;
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        console.log(data);
        // const responseData = await axios.post(`${api_url}/uploads/purchases-bill`,data,config);
    }catch(err){
        toast.error(err.message);
        console.log(err);
    }
}