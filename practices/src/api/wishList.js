
import { getFirestore,getDoc,doc, updateDoc, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useEffect, useState } from "react";
const db = getFirestore(app);

export const addToWishList = async (userId,productsDetails)=>{
   try {
      if(!userId || !productsDetails) return;
      const userRef = doc(db,'user',userId);
      const userSnap = await getDoc(userRef);
      if(!userSnap.exists()) return;
      const wishList = userSnap.data().wishlist || [];
      const exists = wishList.find((item)=>String(item.id) === String(productsDetails.id));
      if(exists){
          const updateList = wishList.filter((item)=>String(item.id) !== String(productsDetails.id));
          await updateDoc(userRef,{wishlist:updateList});
          return {message:"Product removed from wishlist"}

      }else{
          const newList = [...wishList,productsDetails];
          await updateDoc(userRef,{wishlist:newList});
          return {message:"Product added to wishlist"}
      }
        
     
   } catch (error) {
      console.log(error.message);
      return {error:error.message}
   }
}

export const useSnapOfWishList = (userId)=>{
 const [wishlist,setWishlist] = useState([]);
  useEffect(()=>{
        if(!userId) return;
        const userRef = doc(db,'user',userId);
        const unSubscribe = onSnapshot(userRef,(doc)=>{
            if(doc.exists()){
                const wishlist = doc.data().wishlist || [];
                setWishlist(wishlist);
            }
        })
        return () => unSubscribe();
  },[userId]);
   return wishlist;
    
}