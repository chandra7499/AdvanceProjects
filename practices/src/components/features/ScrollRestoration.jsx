import {useLocation,useNavigationType} from "react-router-dom";
import { setSessionStorage,getSessionStorage } from "../../functions/localStorage";

import {useEffect} from 'react'

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") {
     const pop =  window.scrollTo(0, getSessionStorage(location.key));
     if(pop) window.scrollTo(0, parseInt(pop,10));
    } else {
      window.scrollTo(0,0);
    }
  }, [location]);

  useEffect(()=>{
     return()=>{
        setSessionStorage(location.key,window.scrollY);
     }   
 
  },[location]);

  return null;
}

export default ScrollRestoration