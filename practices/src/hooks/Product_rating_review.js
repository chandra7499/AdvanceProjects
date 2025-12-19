import { useMutation } from "@tanstack/react-query";
import { product_rating_Reviews } from "../api/rating_Reviews";
import { toast } from "react-toastify";
import { addReplayToReview } from "../api/rating_Reviews";
export const useProductRatingReview = () => {
  return useMutation({
    mutationKey: ["rating_Review"],
    mutationFn: ({ userId,productId,rating,review }) => product_rating_Reviews(userId,productId,rating,review),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
      } else if (data?.warning) {
        toast.warning(data.warning);
      } else {
        toast.error(data.error);
      }
    },
  });
};

export const useReplayToReview = () => {
  return useMutation({
    mutationKey: ["replyToReview"],
    mutationFn: ({ userId,currentUserId,productId,replayObj }) => addReplayToReview(userId,currentUserId,productId,replayObj),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
      } else if (data?.warning) {
        toast.warning(data.warning);
      } else {
        toast.error(data.error);
      }
    },
  });
};
