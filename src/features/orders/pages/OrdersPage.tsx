import { Link } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import type { OrderStatus } from "../types/order.types";
import { useCancelOrder } from "../hooks/useCancelOrder";
import { useOrders } from "../hooks/useOrders";

const statusLabels: Record<OrderStatus, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const statusClasses: Record<OrderStatus, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  EN_PREP: "bg-purple-100 text-purple-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

const canCancelOrder = (status: OrderStatus) => {
  return status === "PENDIENTE" || status === "CONFIRMADO";
};

const paymentLabels = {
  EFECTIVO: "Efectivo",
  MERCADOPAGO: "Mercado Pago",
  TRANSFERENCIA: "Transferencia",
};

const paymentStatusText = (status: OrderStatus) => {
  if (status === "CONFIRMADO" || status === "EN_PREP" || status === "ENTREGADO") {
    return "Pago acreditado";
  }

  if (status === "CANCELADO") {
    return "Pedido cancelado";
  }

  return "Pago pendiente";
};

const paymentStatusClasses = (status: OrderStatus) => {
  if (status === "CONFIRMADO" || status === "EN_PREP" || status === "ENTREGADO") {
    return "bg-green-100 text-green-700";
  }

  if (status === "CANCELADO") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

export const OrdersPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrders();

  const cancelMutation = useCancelOrder();

  if (isAuthLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-12 text-center">
          <p className="text-5xl mb-4">🔐</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Iniciá sesión para ver tus pedidos
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Para consultar tu historial de pedidos necesitás ingresar con una cuenta de cliente.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Cargando pedidos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-6 py-8">
          <p className="text-red-600 font-medium">
            No se pudieron cargar los pedidos.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Intentá recargar la página o volver a iniciar sesión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Historial de pedidos realizados
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-bold text-gray-900">
            Todavía no tenés pedidos
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Cuando confirmes una compra, aparecerá en esta sección.
          </p>
          <Link
            to="/"
            className="inline-flex mt-6 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-gray-900">
                      Pedido #{order.id}
                    </h2>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusClasses[order.estado]
                      }`}
                    >
                      {statusLabels[order.estado]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Forma de pago: {paymentLabels[order.forma_pago]}
                    </span>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusClasses(
                        order.estado,
                      )}`}
                    >
                      {paymentStatusText(order.estado)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                {order.detalles.map((detail) => (
                  <div
                    key={detail.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {detail.producto_nombre}
                      </p>

                      <div className="text-gray-500">
                        Cantidad: {detail.cantidad} · Precio unitario: $
                        {Number(detail.precio_unitario).toLocaleString(
                          "es-AR",
                        )}

                        {detail.personalizacion?.length > 0 && (
                          <div className="text-xs text-amber-700 mt-1">
                            Personalización: sin ingredientes #
                            {detail.personalizacion.join(", #")}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="font-medium text-gray-900">
                      ${Number(detail.subtotal).toLocaleString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>

              {canCancelOrder(order.estado) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => cancelMutation.mutate(order.id)}
                    disabled={cancelMutation.isPending}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelMutation.isPending
                      ? "Cancelando..."
                      : "Cancelar pedido"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
