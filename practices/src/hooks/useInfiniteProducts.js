import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "../api/budgetProducts";

export const useInfiniteProducts = (filters) => {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam = null }) =>
      getFilteredProducts({ ...filters, lastDoc: pageParam }),
    getNextPageParam: (lastPage) => lastPage.lastVisible ?? undefined,
  });
};