// hooks/useAuth.js
import { useMutation } from "@tanstack/react-query";
import {
  signUp,
  login,
  logout,
  forgetPassword,
  googleAuth,
  facebookAuth,
  githubAuth,
} from "../api/auth";
import { useContext } from "react";
import { myContext } from "../components/GlobalStates/contextHooks";
import { queryClient } from "../main";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const useSignUp = () => {
  const { setAuthError } = useContext(myContext);
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data?.message) {
        console.log(data.message);
        queryClient.invalidateQueries(["users"]);
        setAuthError({ type: "success", text: data.message, cat: "signup" });
      } else {
        console.log(data.invalid);
        setAuthError({ type: "error", text: data.invalid, cat: "signup" });
      }
    },
    onError: (error) => {
      console.error("Sign up failed:", error);
      setAuthError({
        type: "error",
        text: "Unexpected error occurred",
        cat: "signup",
      });
      // Pass error to UI
    },
  });
};

export const useLogin = () => {
  const { setAuthError } = useContext(myContext);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) {
        console.log(data.message);
        document.cookie = `tarzon_client_token=${data.token};path=/; max-age = 86400; secure; samesite = Strict`;
        window.dispatchEvent(new Event("authChange"));
        queryClient.invalidateQueries(["users"]);
        toast.success(data.message);
      } else if (data?.invalid) {
        setAuthError({ type: "error", text: data.invalid, cat: "login" });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error?.error || error);
      setAuthError(error?.invalid || "login failed");
    },
  });
};

export const useGoogleLogin = () => {
  const { setAuthError } = useContext(myContext);
  return useMutation({
    mutationFn: googleAuth,
    onSuccess: (data) => {
      if (data?.user) {
        document.cookie = `tarzon_client_token=${data.user.accessToken};path=/; max-age = 86400; secure; samesite = Strict`;
        window.dispatchEvent(new Event("authChange"));
        queryClient.invalidateQueries(["users"]);
        toast.success(data.message);
      } else {
        setAuthError(data.invalid);
      }
    },
  });
};

export const useFb = () => {
  const { setAuthError } = useContext(myContext);
  return useMutation({
    mutationFn: facebookAuth,
    onSuccess: (data) => {
      if (data?.user) {
        document.cookie = `tarzon_client_token=${data.user.accessToken};path=/; max-age = 86400; secure; samesite = Strict`;
        window.dispatchEvent(new Event("authChange"));
        queryClient.invalidateQueries(["users"]);
        toast.success(data.message);
      } else {
        setAuthError(data.invalid);
      }
    },
  });
};

export const useGitHub = () => {
  const { setAuthError } = useContext(myContext);
  return useMutation({
    mutationFn: githubAuth,
    onSuccess: (data) => {
      if (data?.user) {
        document.cookie = `tarzon_client_token=${data.user.accessToken};path=/; max-age = 86400; secure; samesite = Strict`;
        window.dispatchEvent(new Event("authChange"));
        queryClient.invalidateQueries(["users"]);
        toast.success(data.message);
      } else {
        setAuthError(data.invalid);
      }
    },
  });
};

export const useForgetPassword = () => {
  const { setAuthError, loginPopUp } = useContext(myContext);
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      if (data?.message) {
        loginPopUp.current.close();
        toast.success(data.message);
      } else if (data?.invalid) {
        setAuthError(data.invalid);
      }
    },
    onError: (error) => {
      console.error("forget password failed:", error?.error || error);
      setAuthError(error?.invalid || "forget password failed");
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      document.cookie = `tarzon_client_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite = Strict`;
      window.dispatchEvent(new Event("authChange"));
      queryClient.clear();
      toast.success(data.message);
    },
    onError: (error) => {
      console.error("Logout failed:", error?.message || error);
    },
  });
};
