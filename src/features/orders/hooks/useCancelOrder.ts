import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../api/orders.service";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
