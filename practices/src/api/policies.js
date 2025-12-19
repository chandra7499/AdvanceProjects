import { app } from "../firebaseConfig";
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore(app);

export const policies = async ({type}) => {
  try {
    const policyRef = doc(db, "policies", `${type}`);
    const policySnap = await getDoc(policyRef);
    if (policySnap.exists()) {
      return { data: policySnap.data()};
    }
  } catch (err) {
    return { data: `${err.message}` };
  }
};



export const ReasonSubmission = async (userId, reasonObj) => {
  try {
    if (!userId || !reasonObj) {
      console.log("userId or reasonObj not found");
      return { error: "userId or reasonObj not found" };
    }

    // Validate that reasonObj has the required structure
    const { orderId, finalReason } = reasonObj;
    if (!orderId || !finalReason ) {
      return { error: "Invalid reasonObj structure" };
    }


    // Check if user exists
    const userDocRef = doc(db, "user", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return { error: "User not found" };
    }

    // Reference to the user's reasons document
    const reasonDocRef = doc(db, "returnReasons", userId);
    const reasonDocSnap = await getDoc(reasonDocRef);

    if (reasonDocSnap.exists()) {
      const data = reasonDocSnap.data();

      // Check if orderId is already present
      if (data.reasons && data.reasons[orderId]) {
        return { warning: "This order is already under return process" };
      }

      // Update the document by adding the new reason
      await updateDoc(reasonDocRef, {
        [`reasons.${orderId}`]: finalReason
      });
      return { message: "Reason updated successfully" };
    } else {
      // Create a new document with the reason
      await setDoc(reasonDocRef, {
        reasons: { [orderId]: finalReason }
      });
      return { message: "Reason created successfully" };
    }
  } catch (err) {
    return { error: err.message };
  }
};
