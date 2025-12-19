import { useMutation } from "@tanstack/react-query";
import { policies,ReasonSubmission } from "../api/policies";
import { useEffect, useState } from "react";
export const usePolicies = ({type}) =>{
    const [policy, setPolicy] = useState("");
    useEffect(()=>{
        const fetchData = async ()=>{
            const result = await policies({type});
            console.log(result?.data);
            setPolicy(result?.data);
        }
        fetchData();
    },[]);

    return policy;
    
}

export const useReasonSubmission = ()=>{
   return useMutation({
        mutationKey:["ReasonSubmission"],
        mutationFn:({userId,reasonObj})=>ReasonSubmission(userId,reasonObj)
    })
}