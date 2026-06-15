export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREP"
  | "ENTREGADO"
  | "CANCELADO";

export type PaymentMethod = "EFECTIVO" | "MERCADOPAGO" | "TRANSFERENCIA";

export interface IOrderDetail {
  id: number;
  producto_id: number;
  cantidad: number;
  producto_nombre: string;
  precio_unitario: string;
  subtotal: string;
  personalizacion: number[];
}

export interface IOrder {
  id: number;
  usuario_id: number;
  direccion_entrega_id: number;
  estado: OrderStatus;
  forma_pago: PaymentMethod;
  total: string;
  detalles: IOrderDetail[];
}

export interface IPayment {
  id: number;
  pedido_id: number;
  forma_pago_codigo: PaymentMethod;
  mp_payment_id: number | null;
  mp_status: string;
  mp_status_detail: string | null;
  transaction_amount: string;
  payment_method_id: string | null;
  external_reference: string;
  idempotency_key: string;
  init_point: string | null;
  sandbox_init_point: string | null;
  preference_id: string | null;
}

export type CreateMercadoPagoPaymentPayload = {
  pedido_id: number;
  token: string | null;
  payment_method_id: string | null;
  installments: number;
  issuer_id: string | null;
};
