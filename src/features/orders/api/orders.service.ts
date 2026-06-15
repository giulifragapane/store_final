import { api } from "@/shared/api/client";
import type {
  CreateMercadoPagoPaymentPayload,
  IOrder,
  IPayment,
  PaymentMethod,
} from "../types/order.types";

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

export const createMercadoPagoPayment = async (
  payload: CreateMercadoPagoPaymentPayload,
): Promise<IPayment> => {
  const response = await api.post<IPayment>("/api/v1/pagos/crear", payload);
  return response.data;
};

export const getPaymentByOrder = async (pedidoId: number): Promise<IPayment> => {
  const response = await api.get<IPayment>(`/api/v1/pagos/${pedidoId}`);
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
