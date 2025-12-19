import {useMutations} from "@tanstack/react-query";
import {toast} from "react-toastify";

export const useSuccessOrFail = (data) => {
    return useMutations({
        onSuccess:(data)=>{
            if(data?.message){
                toast.success(data.message)
            }else{
                toast.error(data.error)
            }
        }
    })
}
