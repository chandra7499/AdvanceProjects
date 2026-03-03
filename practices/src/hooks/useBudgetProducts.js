import { useQuery } from "@tanstack/react-query";
import { getBudgetProducts } from "../api/budgetProducts";

export const useBudgetProducts = (price) => {
  return useQuery({
    queryKey: ["budget-products", price],
    queryFn: () => getBudgetProducts(price),
    enabled: !!price,
    keepPreviousData: true,
  });
};