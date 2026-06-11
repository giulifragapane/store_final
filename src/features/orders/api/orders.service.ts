import { api } from "@/shared/api/client";
import type { IOrder, PaymentMethod } from "../types/order.types";

export type CreateOrderPayload = {
  direccion_entrega_id: number;
  forma_pago: PaymentMethod;
  detalles: {
    producto_id: number;
    cantidad: number;
    personalizacion: number[];
  }[];
};

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<IOrder> => {
  const response = await api.post<IOrder>("/api/v1/pedidos/", payload);
  return response.data;
};

export const getOrders = async (): Promise<IOrder[]> => {
  const response = await api.get<{ data: IOrder[]; total: number }>(
    "/api/v1/pedidos/",
  );

  return response.data.data;
};

export const cancelOrder = async (id: number): Promise<IOrder> => {
  const response = await api.patch<IOrder>(`/api/v1/pedidos/${id}/cancelar`);
  return response.data;
};
