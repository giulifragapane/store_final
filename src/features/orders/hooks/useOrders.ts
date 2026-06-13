import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders.service";
import { useOrdersRealtime } from "./useOrdersRealtime";

export const useOrders = () => {
  useOrdersRealtime();

  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 30,
  });
};
