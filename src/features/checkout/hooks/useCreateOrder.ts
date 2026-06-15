import { useMutation } from "@tanstack/react-query";
import {
  createOrder,
  createMercadoPagoPayment,
} from "@/features/orders/api/orders.service";
import type { IOrder, IPayment } from "@/features/orders/types/order.types";
import type { CreateOrderPayload } from "@/features/orders/api/orders.service";

type CreateOrderResult = {
  order: IOrder;
  payment?: IPayment;
};

type UseCreateOrderOptions = {
  onSuccess: (result: CreateOrderResult) => void;
  onError: (message: string) => void;
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }

  return "No se pudo crear el pedido.";
};

export const useCreateOrder = ({ onSuccess, onError }: UseCreateOrderOptions) => {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<CreateOrderResult> => {
      const order = await createOrder(payload);

      if (order.forma_pago !== "MERCADOPAGO") {
        return { order };
      }

      const payment = await createMercadoPagoPayment({
        pedido_id: order.id,
        token: null,
        payment_method_id: null,
        installments: 1,
        issuer_id: null,
      });

      return { order, payment };
    },
    onSuccess,
    onError: (err: Error) => {
      onError(getErrorMessage(err));
    },
  });
};
