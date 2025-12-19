import { addTocart, placeOrderItem,placeAgain} from "../api/postItems";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ReduceQty_then_delete } from "../api/deleteItems";
import {
  PaymentsIdVerifying,
  UpdatePaymentDetails,
  handleCancellation,
  CashOnDelivery,
  // BuyAgain,
} from "../api/postItems";
import { PaymentStatus,fetchPendingOrders} from "../api/getItems";
import axios from "axios";
import {
  DeliveryFormDetails,
  changeDeliveryPoint,
  FeedSubmission,
} from "../api/postItems";

const api_url = import.meta.env.VITE_API_BASE_URL;

export const useCartProducts = () => {
  return useMutation({
    mutationKey: (product) => ["addTocart", product.id],
    mutationFn: ({ cartItems, userId }) => addTocart(cartItems, userId),
    onSuccess: (data) => {
      if (data?.cartItems) {
        toast.success("item added successfully");
      } else {
        toast.error("item not added");
      }
    },
    onError: () => {
      toast.loading("an error occured in cart please try again later...");
    },
  });
};

export const useDeleteCartItem = () => {
  return useMutation({
    mutationKey: (id) => {
      ["deleteItem", id];
    },
    mutationFn: ({ id, userId }) => ReduceQty_then_delete(id, userId),
    onSuccess: (data) => {
      if (data?.cartItems) {
        toast.success(data.cartItems);
      } else {
        toast.error(data?.error);
      }
    },
    onError: () => {
      toast.play("an error occured in cart please try again later...");
    },
  });
};

export const usePlaceOrderItems = () => {
  return useMutation({
    mutationKey: ["placeOrderItems"],
    mutationFn: ({ item, userId }) => placeOrderItem(item, userId),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        console.log(data?.message);
      } else {
        toast.error(data?.error);
        console.log(data?.error);
      }
    },
  });
};

export const useDeliverFormDetails = () => {
  return useMutation({
    mutationKey: ["deliveryformDetails"],
    mutationFn: ({ userId, formData }) => DeliveryFormDetails(userId, formData),
    onSuccess: (data) => {
      if (data?.deliverdMessage) {
        // console.log(data?.deliverdMessage);
        toast.success(data?.deliverdMessage);
      } else {
        // console.log(data?.notDeliverdMessage);
        toast.error(data?.notDeliverdMessage);
      }
    },
  });
};

export const useChangeDeliveryPoint = () => {
  return useMutation({
    mutationKey: ["deliveryPoint"],
    mutationFn: ({ id, userId }) => changeDeliveryPoint(id, userId),
    onSuccess: (data) => {
      if (data?.deliveryPoint) {
        toast.success(data?.deliveryPoint);
      } else {
        toast.error(data?.deliveryPoint);
      }
    },
  });
};

export const useSubmitFeed = () => {
  return useMutation({
    mutationKey: ["userFeed"],
    mutationFn: (submissionStructure) => FeedSubmission(submissionStructure),
    onSuccess: (data) => {
      if (data?.submitted) {
        toast.success("submission Successfull");
      } else {
        toast.error("Feed is not submitted");
      }
    },
  });
};

export const useOrderDetails = (orderId) => {
  console.log(orderId);
  const [orderDetails, setDetails] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    axios
      .get(`${api_url}/get-order/${orderId}`)
      .then((response) => setDetails(response.data))
      .catch((err) => {
        console.log("error fetaching order:", err);
      });
  }, [orderId]);

  return orderDetails;
};

export function handleUpdatedOrderDetails(id) {
  console.log(id);

  axios
    .get(`${api_url}/get-order/${id}`)
    .then((response) => {
      let orderDetails = response.data;
      console.log(orderDetails);
      return orderDetails;
    })
    .catch((err) => [console.log(err.message)]);
}

export function usePaymentIdVerification() {
  return useMutation({
    mutationKey: ["paymentId"],
    mutationFn: ({ paymentDetails, userId }) =>
      PaymentsIdVerifying(paymentDetails, userId),
  });
}

export async function updateOrders(paymentResponse, userId, section, selectedItems) {
  try {
    if (!paymentResponse || !userId) {
      console.log("please pass paymentResponse,placeOrderList");
    }
    const { data: paymentDetails } = await axios.get(
      `${api_url}/get-order/${paymentResponse.razorpay_order_id}`
    );
    const paymentObj = {
      id: paymentDetails.id,
      amount: paymentDetails.amount / 100,
      status: paymentDetails.status,
      amount_paid: paymentDetails.amount_paid,
      currency: paymentDetails.currency,
      createdAt: new Date().toISOString(),
    };

    let stateMent = await UpdatePaymentDetails(paymentObj, userId, section, selectedItems);
    console.log(stateMent);
  } catch (err) {
    console.log("an error occured", err.message);
  }
}

export const useUserOrders = (userId, filterType = "pending") => {
  return useQuery({
    queryKey: ["pendingOrders", userId, filterType],
    queryFn: () => fetchPendingOrders({ userId, filterType }),
    enabled: !!userId,
    // always give the component an array
    select: (data) => (Array.isArray(data) ? data : []),
    // nice-to-have caching
    staleTime: 30_000,
  });
};

export const usePaymentStatus = (userId) => {
  return useQuery({
    queryKey: ["paymentStatus", userId],
    queryFn: () => PaymentStatus(userId),
    enabled: !!userId,
  });
};

export const useCancelOrder = () => {
  return useMutation({
    mutationKey: ["CancleOrder"],
    mutationFn: ({ userId, orderId }) => handleCancellation(userId, orderId),
    onSuccess: (data) => {
      if (data?.message) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    },
  });
};

export const useCashonDelivery = () => {

  return useMutation({
    mutationKey: ["cashOnDelivery"],
    mutationFn: ({ userId, finalPrice,section,selectedItems }) => CashOnDelivery(userId, finalPrice,section,selectedItems),
    onSuccess: (data) => {
      if (data?.message) {
         toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
  });
};

export const usePlaceAgain = ()=>{
  return useMutation({
    mutationKey: ["placeAgain"],
    mutationFn: ({ userId, OrderId }) => placeAgain(userId,OrderId),
  });
}







