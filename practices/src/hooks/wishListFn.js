import { useMutation } from "@tanstack/react-query";
import { addToWishList } from "../api/wishList";
import { toast } from "react-toastify";
export const useAddToWishList = () => {
  return useMutation({
    mutationKey: ["addToWishList"],
    mutationFn: ({ userId, productId }) => addToWishList(userId, productId),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    },
  });
};


