import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { userDetailsUpdate } from "../api/updates";
import { userAddressDetailsupdate, userProfileUpdate } from "../api/updates";
export const useUserDetailsUpdate = () => {
  return useMutation({
    mutationKey: ["userDetailsUpdate"],
    mutationFn: ({ userId, formData }) => userDetailsUpdate(userId, formData),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
      } else if (data?.warning) {
        toast.warning(data?.warning);
      } else {
        toast.error(data?.error);
      }
    },
  });
};

export const useAddressDetailUpdate = () => {
  return useMutation({
    mutationKey: ["userAddressUpdate"],
    mutationFn: ({ userId, formData }) =>
      userAddressDetailsupdate(userId, formData),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
      } else {
        toast.error(data?.error);
      }
    },
  });
};

export const useProfileUpdate = () => {
  return useMutation({
    mutationKey: ["userProfileUpdate"],
    mutationFn: ({ userId, formData }) => userProfileUpdate(userId, formData),
  });
};
