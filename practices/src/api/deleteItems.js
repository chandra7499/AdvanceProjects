import {getDoc,doc,updateDoc} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {app} from "../firebaseConfig";

const db = getFirestore(app);

export const ReduceQty_then_delete = async (id, userId) => {
    console.log("reduceQty_then_delete", id, userId);
    const docRef = doc(db, "user", userId);
    const docSnap = await getDoc(docRef);
    let message = "";

    if (docSnap.exists()) {
        const cartData = docSnap.data().cartData || [];
        const placeOrders = docSnap.data().placeOrders || [];
        
        const existingCartItem = cartData.find(cartItem => cartItem.id === id);
        const existingPlaceOrder = placeOrders.find(order => order.id === id);

      

        if (existingCartItem) {
            existingCartItem.qty -= 1;

            if (existingCartItem.qty === 0) {
                cartData.splice(cartData.indexOf(existingCartItem), 1);
                message = "Item removed from cart";
            } else {
                message = "Quantity reduced in cart";
            }
        }

        if (existingPlaceOrder) {
            existingPlaceOrder.qty -= 1;
            existingPlaceOrder.totalPrice = existingPlaceOrder.qty * existingPlaceOrder.price;

            if (existingPlaceOrder.qty === 0) {
                placeOrders.splice(placeOrders.indexOf(existingPlaceOrder), 1);
                message += (message ? " and " : "") + "item removed from placeOrder";
            } else {
                message += (message ? " and " : "") + "quantity reduced in placeOrder";
            }
        }
        // Update Firestore with the modified cartData and placeOrders
        await updateDoc(docRef, { cartData, placeOrders });
        return {cartItems:message}
    }
}



export const clearAllSelections = async (userId)=>
{
    if(!userId) return [];
    try
    {
        const userDoc = doc(db,"user",userId);
        const docSnap = await getDoc(userDoc);
        if(docSnap.exists())
        {
              const clearAll = await updateDoc(userDoc,{placeOrders : []});
              console.log("all orders cleared",clearAll);

        }else
        {
                 console.log("userdocument does not exixts");
        }


    }catch(err)
    {
         console.log(err.message);
    }
}
