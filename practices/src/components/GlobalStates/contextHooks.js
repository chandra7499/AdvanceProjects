import { createContext, useContext } from "react";


const myContext = createContext();


export const useCart = () => useContext(myContext);
export const useFilter = () => useContext(myContext);
export const useOrderSelection = () => useContext(myContext);
export const useProducts = () => useContext(myContext);



export { myContext };
