import { app } from "../firebaseConfig";
import { getFirestore, getDoc, doc } from "firebase/firestore";
const db = getFirestore(app);

export const verification = async (userId) => {
  try {
    if (!userId) {
      console.log("userId not found");
    }
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return {data:userSnap.data()};
    }
  } catch (err) {
    return {dataMessage:`${err.message}`};
  }
};
