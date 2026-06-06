import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/product.service";
import type { IProduct } from "../types/product.types";

export const useProductDetail = (id: string | undefined) => {
  return useQuery<IProduct>({
    queryKey: ["product-detail", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
