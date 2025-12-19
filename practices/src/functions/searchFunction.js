// import { useEffect, useState } from "react";
// import { useContext } from "react";
// import { myContext } from "../components/GlobalStates/contextHooks";

import { useSearch } from "../api/getItems";

export const useSearchFunction = (value) => {
  const FilterProducts = useSearch(value);
  return FilterProducts;
};

export const useSelection = () => {
  async function productSelection(id, navigate) {
    try {
      if(!id) return;
      await navigate(`/productView/${id}`);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  return productSelection;
};

export const getCookie = (name) => {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
};

export const filterProducts = (dataSet,value,key)=>{
   if(!dataSet || !key  || value === null || value === undefined) return [];
    return dataSet.filter((item)=>item[key] === value);
   
}
