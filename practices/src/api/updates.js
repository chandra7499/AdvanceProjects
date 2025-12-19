import axios from "axios";
import { getFirestore, getDoc, doc, updateDoc,onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useEffect,useState } from "react";
const db = getFirestore(app);
const api_url = import.meta.env.VITE_API_BASE_URL;

export const userDetailsUpdate = async (userId, formData) => {
  try {
    if (!userId || !formData) return;
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    const userGeneralData = userSnap.data();
    if (!userSnap.exists()) return;
    const length = Object.keys(formData).length;
      const findRequired = {};
      let notEqualCounter = 0;
      for(const [key,value] of Object.entries(formData)){
        console.log(userGeneralData[key],value);
        if(userGeneralData[key] !== value){
          findRequired[key] = value;
        }else{
           notEqualCounter++;
        }

        if(notEqualCounter === length){
          return { warning: "No changes found" };
        }
    }
    await updateDoc(userRef, formData);
    return { message: "User details updated successfully"};
  } catch (err) {
    return { error: err.message };
  }
};

export const userAddressDetailsupdate = async (userId, formData) => {
  try {
    if (!userId || !formData) return;

    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userAddressData = userSnap.data().addresses;
    const deliveryAddressPoint = userAddressData.findIndex(
      (address) => address.deliveryPoint === true
    );

    if (deliveryAddressPoint === -1) {
      return { error: "No delivery point found." };
    }

    const address = userAddressData[deliveryAddressPoint];

    for(const [key,value] of Object.entries(formData)){
      if(address[key] !== value){
        address[key] = value;
      }
    }

    await updateDoc(userRef, { addresses: userAddressData });

    return { message: "Address updated successfully" };
  } catch (err) {
    return { error: err.message };
  }
};


export const userProfileUpdate = async(userId,formData)=>{
  try{
     if(!userId || !formData) return;
     const userRef = doc(db,"user",userId);
     const userSnap = await getDoc(userRef);
     if(!userSnap.exists()) return;
     const newProfileUrl = await axios.post(`${api_url}/uploads/profile-upload`,formData);
     console.log(userSnap.data().profile);
     await updateDoc(userRef,{profile:newProfileUrl.data.profileUrl});
     console.log(userSnap.data().profile);
     
     return {message:"Profile updated successfully"}
  }catch(e){
     return {error:e.message}
  }

}

export const useProfileupdate = (userId)=>{
  const [profileUrl,setProfileUrl] = useState("");
  useEffect(()=>{
    if(!userId) return;
    const unSubscribe = onSnapshot(doc(db,"user",userId),(userSnap)=>{
      if(userSnap.exists()){
        setProfileUrl(userSnap.data().profile);
      }
      return ()=>unSubscribe();
    },[userId]);
  })
  return profileUrl;
}



  