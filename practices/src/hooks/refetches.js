import { useEffect, useState } from "react";
import {useQueryClient} from "@tanstack/react-query"
export const useOnlineStatus = () => {
  const [isOnline, setOnline] = useState(window.navigator.onLine);
  useEffect(() => {
    function handleOnlineStatusChange() {
      setOnline(window.navigator.onLine);
    }
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);
  return isOnline;
};

export const useRefetches = () => {
  const queryClient = useQueryClient();
  const refetch = () => {
    queryClient.invalidateQueries(["users"]);
  };
  return refetch;
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    let interval = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearInterval(interval);
    };
  }, [value, delay]);
  return debouncedValue;
};
