import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/product.service";
import type { IProduct } from "../types/product.types";

export const useProducts = () => {
  return useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};
