import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/features/orders/api/orders.service";

type UseCreateOrderOptions = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

export const useCreateOrder = ({ onSuccess, onError }: UseCreateOrderOptions) => {
  return useMutation({
    mutationFn: createOrder,
    onSuccess,
    onError: (err: Error) => {
      onError(err.message || "No se pudo crear el pedido.");
    },
  });
};
