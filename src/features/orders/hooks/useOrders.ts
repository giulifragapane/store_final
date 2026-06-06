import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders.service";
import type { IOrder } from "../types/order.types";

export const useOrders = () => {
  return useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
};
