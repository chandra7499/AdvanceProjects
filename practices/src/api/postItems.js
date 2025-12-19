import { app } from "../firebaseConfig";
import axios from "axios";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

import { generateCODID } from "../functions/handlePayments";

const db = getFirestore(app);

export const addTocart = async (item, userId) => {
  if (!item || !userId) return [];
  try {
    const userCartRef = doc(db, "user", userId);
    const cartItemSnapShot = await getDoc(userCartRef);
    let cartData = cartItemSnapShot.data().cartData || [];
    let placeOrders = cartItemSnapShot.data().placeOrders || [];
    const existingOrders = placeOrders.find((orders) => orders.id === item.id);
    const existingItems = cartData.find((cartItem) => cartItem.id === item.id);
    if (existingItems) {
      if (existingOrders) {
        existingOrders.qty += 1;
        existingOrders.totalPrice = existingOrders.qty * existingOrders.price;
        await updateDoc(userCartRef, { placeOrders });
      }
      existingItems.qty += 1;
    } else {
      cartData.unshift(item);
    }
    await updateDoc(userCartRef, { cartData });
    // console.log("Cart Updated:", cartItemSnapShot.data());
    return { cartItems: cartItemSnapShot.data() };
  } catch (err) {
    console.log(err.message);
  }
};

//place order Items

export const placeOrderItem = async (item, userId) => {
  // console.log(item,userId);
  if (!item || !userId) return [];
  try {
    const userItemRef = doc(db, "user", userId);
    const placeItemSnapShot = await getDoc(userItemRef);
    let placeOrders = [];
    if (placeItemSnapShot.exists()) {
      const userData = placeItemSnapShot.data();
      placeOrders = userData.placeOrders || [];
    }

    //prevent duplicates
    const existingItems = placeOrders.findIndex(
      (placeItem) => placeItem.id === item.id
    );
    if (existingItems !== -1) {
      placeOrders.splice(existingItems, 1);
      await updateDoc(userItemRef, { placeOrders });
      console.log("item removed");
      return { message: "item removed" };
    }
    placeOrders.unshift(item);
    await updateDoc(userItemRef, { placeOrders });
    return { message: "user items was updated in cart" };
  } catch (err) {
    return {
      error: err.message,
    };
  }
};

//select items in cart

export const selectAllSelection = async (userId, cartData) => {
  if (!userId) return [];
  try {
    const userDoc = doc(db, "user", userId);
    const existingDoc = await getDoc(userDoc);
    if (existingDoc.exists()) {
      const placeOrders = await existingDoc.data().placeOrders;
      if (cartData.length === 0) {
        return;
      }
      if (placeOrders.length === 0) {
        const updatePlaceOrders = cartData.map((catItems) => ({
          id: catItems.id,
          qty: catItems.qty,
          price: catItems.price,
        }));

        await updateDoc(userDoc, {
          placeOrders: arrayUnion(...updatePlaceOrders),
        });
        console.log("all items were added");
      } else {
        const existingUniqueId = new Set(placeOrders.map((item) => item.id));
        const newItems = cartData.filter(
          (item) => !existingUniqueId.has(item.id)
        );
        const newUpdataItems = newItems.map((Items) => ({
          id: Items.id,
          qty: Items.qty,
          price: Items.price,
        }));
        await updateDoc(userDoc, {
          placeOrders: arrayUnion(...newUpdataItems),
        });
        console.log("remaing items were added...");
      }
    } else {
      console.log("no user exists");
    }
  } catch (err) {
    console.log(err.message);
  }
};

// Delivery Form function

export const DeliveryFormDetails = async (userId, formData) => {
  try {
    if (!userId) {
      return {
        notDeliverdMessage: "User ID not found. Please try again.",
      };
    }

    const userRef = doc(db, "user", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { notDeliverdMessage: "User does not exist." };
    }

    const { zipcode, state, country, dialcode, phone_no } = formData;
    const fullNumber = `${dialcode}${phone_no}`;
    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${zipcode}`
    );
    const phoneVerification = await axios.get(
      `https://lookups.twilio.com/v1/PhoneNumbers/${fullNumber}`,
      {
        auth: {
          username: import.meta.env.VITE_Twilo_sid,
          password: import.meta.env.VITE_Twilo_Auth_Token,
        },
      }
    );

    const isValid = phoneVerification?.status;
    if (isValid !== 200) {
      return { notDeliverdMessage: "Invalid phone number." };
    }

    const apiData = res.data?.[0];
    if (!apiData || apiData.Status !== "Success") {
      return { notDeliverdMessage: "Invalid or unrecognized ZIP code." };
    }

    const postOffices = apiData.PostOffice;
    if (!postOffices || postOffices.length === 0) {
      return { notDeliverdMessage: "No address data found for this ZIP code." };
    }

    const matchedOffice = postOffices[0]; // or choose one based on region/area

    if (matchedOffice.State !== state) {
      return {
        notDeliverdMessage: `State mismatch: ZIP code ${zipcode} belongs to ${matchedOffice.State}.`,
      };
    }

    if (matchedOffice.Country !== country) {
      return {
        notDeliverdMessage: `Country mismatch: ZIP code ${zipcode} belongs to ${matchedOffice.Country}.`,
      };
    }

    await updateDoc(userRef, {
      addresses: arrayUnion({ ...formData, deliveryPoint: false }),
    });

    return { deliverdMessage: "New address verified and added successfully." };
  } catch (err) {
    console.error("Address verification error:", err.message);
    return {
      notDeliverdMessage: `Error occurred during submission: ${err.message}`,
    };
  }
};

//change delivery point

export const changeDeliveryPoint = async (id, userId) => {
  try {
    // console.log(id,userId);
    const userDoc = doc(db, "user", userId);
    const userData = await getDoc(userDoc);
    const addresses = userData.data().addresses || [];
    const exisitingId = addresses.find((item) => item.id === id);
    // console.log(exisitingId);
    if (userData.exists()) {
      if (!exisitingId) {
        console.log("no address were found");
        return;
      }
      addresses.forEach((item) => {
        item.deliveryPoint = item.id === id;
      });
      await updateDoc(userDoc, { addresses });

      return { deliveryPoint: "delivery address change successfully" };
      // console.log(addresses);
    } else {
      return { deliveryPoint: "delivery address" };
      // console.log("user not found");
    }
  } catch (err) {
    return { deliveryPoint: err.message };
  }
};

//feed back submission function

export const FeedSubmission = async (formData) => {
  try {
    if (!formData.userId) return { submitted: "no userFound please try again" };
    const feedbackRef = doc(db, "userFeedBacks", formData.userId);
    const docRef = doc(db, "user", formData.userId);
    const docSnap = await getDoc(docRef);
    const feedBackSnap = await getDoc(feedbackRef);
    if (feedBackSnap.exists() && docSnap.exists()) {
      await updateDoc(feedbackRef, {
        feedbacks: arrayUnion({
          email: formData.email,
          name: docSnap.ref, //reference to user doc
          feedback: formData.feedback,
          response: [],
          timestamp: new Date(),
        }),
      });
    } else {
      await setDoc(feedbackRef, {
        feedBacks: [
          {
            email: formData.email,
            feedback: formData.feedback,
            name: docSnap.ref,
            response: [],
            timestamp: new Date(),
          },
        ],
      });
    }

    console.log(feedbackRef.id);
    return { submitted: true };
  } catch (err) {
    console.log("error adding data", err.message);
  }
};

//payment id verification function

export const PaymentsIdVerifying = async (requestOrderDetails, userId) => {
  console.log(requestOrderDetails, userId);
  try {
    const collectionsDetails = doc(db, "usersPayments", userId);
    const gettingDetails = await getDoc(collectionsDetails);
    const orderId = requestOrderDetails.id;
    const newOrderID = {
      [`${orderId}`]: {
        amount: requestOrderDetails.amount / 100,
        paid: requestOrderDetails.amount_paid,
        status: requestOrderDetails.status,
        createdAt: new Date(),
      },
    };

    if (gettingDetails.exists()) {
      const orderDetails = gettingDetails.data().requestOrderDetails || [];
      const existingOrder = orderDetails.some((orderObj) =>
        Object.prototype.hasOwnProperty.call(orderObj, orderId)
      );
      if (existingOrder) {
        return {
          posted: false,
          message:
            "order id already used so please make a new request to continue payment seriveces",
          orderID: "duplicate",
        };
      }
      await updateDoc(collectionsDetails, {
        requestOrderDetails: arrayUnion(newOrderID),
      });
    } else {
      await setDoc(collectionsDetails, {
        requestOrderDetails: [newOrderID],
      });
    }
    return { posted: true, message: "order id posted" };
  } catch (err) {
    console.log("err", err.message);
    return { posted: false, message: err.message };
  }
};

//online payment details function

export const UpdatePaymentDetails = async (
  paymentObj,
  userId,
  section,
  selectedItems
) => {
  try {
    // Validate inputs
    if (!paymentObj || !userId || !section || !selectedItems) {
      return { message: "Arguments not found..." };
    }

    // Get user document
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { message: "User not found" };
    }

    const userData = userSnap.data();

    // Setup new order status
    const orderId = paymentObj.id;
    const newOrderStatus = {
      orderId,
      deliveryPoints: {
        points: [
          "Order Placed",
          "Packed",
          "Shipped",
          "Out for Delivery",
          "Delivered",
        ],
        currentStep: 0,
      },
    };

    let updates = {
      paymentsStatus: arrayUnion(paymentObj),
      orderStatus: arrayUnion(newOrderStatus),
    };

    // Determine section-specific updates
    if (section === "cartSection") {
      const cartItems = userData.cartData || [];
      const placeOrderList = userData.placeOrders || [];

      // Remove ordered items from cart
      const updatedCart = cartItems.filter(
        (item) => !placeOrderList.some((p) => p.id === item.id)
      );

      const newPendingOrder = {
        orderId,
        placeOrderList,
        status: "pending",
        cancelledAt: "",
        deliverdAt: "",
      };

      updates = {
        ...updates,
        pendingOrder: arrayUnion(newPendingOrder),
        cartData: updatedCart,
        placeOrders: [],
      };
    } else if (section === "BuyAgain" || section === "singleProduct") {
      const placeOrderList = selectedItems;

      const newPendingOrder = {
        orderId,
        placeOrderList,
        status: "pending",
        cancelledAt: "",
        deliverdAt: "",
      };

      updates = {
        ...updates,
        pendingOrder: arrayUnion(newPendingOrder),
      };
    } else {
      return { message: "Invalid section specified" };
    }

    // Perform update
    await updateDoc(userRef, updates);

    return { message: "Order placed successfully" };
  } catch (err) {
    console.error("Update error:", err.message);
    return { message: err.message || "An unexpected error occurred" };
  }
};

//order cancellation function

export const handleCancellation = async (userId, orderId) => {
  try {
    if (!userId || !orderId) {
      console.log(
        (!userId && "No userId found") || (!orderId && "No orderId found")
      );
    }
    const userDetails = doc(db, "user", userId);
    const userSnap = await getDoc(userDetails);
    if (!userSnap.exists()) {
      return { message: "no user exisits" };
    }
    const userData = userSnap.data();
    const pendingOrder = userData.pendingOrder || [];
    const orderIndex = pendingOrder.findIndex(
      (order) => order.orderId === orderId
    );
    if (!orderIndex === -1) {
      return { message: "no order found with this id" };
    }
    console.log(pendingOrder[orderIndex]);
    pendingOrder[orderIndex].status = "cancel";
    pendingOrder[orderIndex].cancelledAt = new Date().toISOString();

    await updateDoc(userDetails, { pendingOrder });
    return { message: "pending order status is updated" };
  } catch (err) {
    return { message: err.message };
  }
};

//cashOndelivery function

export const CashOnDelivery = async (
  userId,
  finalPrice,
  section,
  selectedItems
) => {
  try {
    if (!userId || !finalPrice || !section || !selectedItems) {
      return { message: "Arguments not found..." };
    }

    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { message: "No user exists" };
    }

    const userData = userSnap.data();
    const CodId = generateCODID();

    // Common order status and payment status
    const orderStatus = {
      orderId: CodId,
      deliveryPoints: {
        points: [
          "Order Placed",
          "Packed",
          "Shipped",
          "Out for Delivery",
          "Delivered",
        ],
        currentStep: 0,
      },
    };

    const paymentStatus = {
      amount: finalPrice,
      createdAt: new Date().toISOString(),
      id: CodId,
      status: "COD",
      currency: "INR",
    };

    if (section === "cartSection") {
      // Get items to order from placeOrders (already in cart)
      const placeOrders = userData.placeOrders || [];
      if (placeOrders.length === 0) {
        return { message: "No items in placeOrders to process!" };
      }

      // Remove ordered items from cart
      const updatedCartData = (userData.cartData || []).filter(
        (item) => !placeOrders.some((p) => p.id === item.id)
      );

      const newPendingOrder = {
        cancelledAt: "",
        deliverdAt: "",
        orderId: CodId,
        status: "pending",
        placeOrderList: placeOrders,
      };

      await updateDoc(userRef, {
        pendingOrder: arrayUnion(newPendingOrder),
        paymentsStatus: arrayUnion(paymentStatus),
        placeOrders: [],
        cartData: updatedCartData,
        orderStatus: arrayUnion(orderStatus),
      });

      console.log("New Pending Order:", newPendingOrder);
      console.log("Updated Cart:", updatedCartData);

      return { message: "Cart items moved to pending orders successfully!" };
    } else if (section === "BuyAgain" || section === "singleProduct") {
      // Directly create a new pending order for the selected item
      const newPendingOrder = {
        cancelledAt: "",
        deliverdAt: "",
        orderId: CodId,
        status: "pending",
        placeOrderList: selectedItems, // Add only the selected items
      };

      await updateDoc(userRef, {
        pendingOrder: arrayUnion(newPendingOrder),
        paymentsStatus: arrayUnion(paymentStatus),
        orderStatus: arrayUnion(orderStatus),
      });

      console.log(
        "New Pending Order (BuyAgain/singleProduct):",
        newPendingOrder
      );

      return {
        message: `${section} items added to pending orders successfully!`,
      };
    }
  } catch (err) {
    console.error(err);
    return { message: err.message };
  }
};

// export const BuyAgain = async(userId,amount,orderDetails,paymentMode,setPaymentModeLoader,navigate)=>{
//   try{
//     if(!userId || !amount || !orderDetails || !paymentMode)
//     {
//       return {errMessage:`Buy-Again not successfull`};
//     }
//     if(paymentMode === "cashOnDelivery")
//     {
//       const userRef = doc(db,"user",userId);
//       const userSnap = await getDoc(userRef);
//       if(!userSnap.exists()){
//         return {errMessage:`Buy-Again not successfull`};
//       }
//       const cashOnDeliveryRes = await CashOnDelivery(userId,amount);

//       const userSnap2 = await getDoc(userRef);
//       const pendingOrders = userSnap2.data().pendingOrder || [];
//       const pendingOrderIndex = pendingOrders.findIndex((order) => order.orderId === cashOnDeliveryRes?.orderId);
//       console.log(pendingOrderIndex);
//       if(pendingOrderIndex === -1)
//       {
//         return {errMessage:`Buy-Again not successfull`};
//       }
//      const updatePendingOrders = [...pendingOrders];
//      console.log(orderDetails);
//      updatePendingOrders[pendingOrderIndex].placeOrderList.push(...orderDetails);
//      await updateDoc(userRef,{pendingOrder:updatePendingOrders});
//      return {message:cashOnDeliveryRes.message};
//     }else if(paymentMode === "online"){
//        await handlePayments(amount,navigate,setPaymentModeLoader);
//        return {message:"payment is initiated"};
//     }

//   }catch(err){
//     setPaymentModeLoader(false);
//     return {errMessage:`Buy-Again not successfull ${err.message}`};
//   }
// }

export const placeAgain = async (userId, OrderId) => {
  try {
    if (!userId || !OrderId)
      return { warningMessage: "please check you userId or OrderId" };
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { warningMessage: "user not found" };
    }
    const pendingOrders = userSnap.data().pendingOrder || [];
    const findOrder = pendingOrders.find((order) => order.orderId === OrderId);
    if (!findOrder) return { warningMessage: "order not found" };
    findOrder.status = "pending";
    findOrder.cancelledAt = "";
    await updateDoc(userRef, { pendingOrder: pendingOrders });
    return { message: "order placed again" };
  } catch (err) {
    return { errMessage: `Buy-Again not successfull ${err.message}` };
  }
};

//Recently used Products
export const RecentlyViewedProducts = async (userId, ViewProduct) => {
  if (!userId || !ViewProduct) return;

  try {
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    let recentlyViewed = userSnap.data().recentlyViewedProducts || [];

    // Check if the product already exists
    const index = recentlyViewed.findIndex(
      (item) => item.productId === ViewProduct.productId
    );

    if (index >= 0) {
      // If product exists, update only timestamp and move it to the end
      recentlyViewed[index].date = new Date().toISOString();
      const updatedItem = recentlyViewed.splice(index, 1)[0];
      recentlyViewed.push(updatedItem);
    } else {
      // If limit reached, remove first element
      if (recentlyViewed.length >= 9) {
        recentlyViewed.shift();
      }
      // Add new product
      recentlyViewed.push({ ...ViewProduct, date: new Date() });
    }

    // Update firebase database
    await updateDoc(userRef, { recentlyViewedProducts: recentlyViewed });

  } catch (e) {
    console.log("error", e.message);
  }
};

