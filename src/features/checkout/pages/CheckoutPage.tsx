import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "@/features/cart";
import type { PaymentMethod } from "@/features/orders/types/order.types";
import type { AddressPayload } from "../types/address.types";
import { useAddresses } from "../hooks/useAddresses";
import { useCreateAddress } from "../hooks/useCreateAddress";
import { useCreateOrder } from "../hooks/useCreateOrder";

type AddressFormValues = AddressPayload;

export const CheckoutPage = () => {
  const navigate = useNavigate();

  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, isLoading } = useAuthStore();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EFECTIVO");
  const [error, setError] = useState("");
  const [isRedirectingToMercadoPago, setIsRedirectingToMercadoPago] = useState(false);

  const {
    data: addressesResponse,
    isLoading: isLoadingAddresses,
    isError: isErrorAddresses,
  } = useAddresses(isAuthenticated);

  const addresses = addressesResponse?.data ?? [];

  const createAddressMutation = useCreateAddress({
    onSuccessSelect: setSelectedAddressId,
    onError: setError,
  });

  const createOrderMutation = useCreateOrder({
    onSuccess: ({ order, payment }) => {
      if (order.forma_pago === "MERCADOPAGO") {
        const checkoutUrl = payment?.sandbox_init_point || payment?.init_point;

        if (!checkoutUrl) {
          clearCart();
          setError(
            "El pedido fue creado, pero no se pudo obtener el link de pago de MercadoPago.",
          );
          navigate("/orders");
          return;
        }

        setIsRedirectingToMercadoPago(true);
        clearCart();

        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 100);

        return;
      }

      clearCart();
      navigate("/orders");
    },
    onError: (message) => {
      setIsRedirectingToMercadoPago(false);
      setError(message);
    },
  });

  const form = useForm({
    defaultValues: {
      alias: "",
      linea1: "",
      linea2: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      es_principal: addresses.length === 0,
    } as AddressFormValues,
    onSubmit: async ({ value }) => {
      setError("");
      await createAddressMutation.mutateAsync(value);
    },
  });

  const handleConfirmOrder = () => {
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    if (!selectedAddressId) {
      setError("Seleccioná o creá una dirección de entrega.");
      return;
    }

    createOrderMutation.mutate({
      direccion_entrega_id: selectedAddressId,
      forma_pago: paymentMethod,
      detalles: items.map((item) => ({
        producto_id: Number(item.product.id),
        cantidad: item.quantity,
        personalizacion: item.removedIngredientIds ?? [],
      })),
    });
  };

  if (isRedirectingToMercadoPago) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">💳</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Redirigiendo a Mercado Pago...
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Estamos abriendo el checkout seguro para completar el pago.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Necesitás iniciar sesión
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Para finalizar la compra necesitás ingresar o registrarte.
          </p>

          <Link
            to="/login"
            className="inline-flex mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Agregá productos antes de confirmar un pedido.
          </p>

          <Link
            to="/"
            className="inline-flex mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finalizar compra</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Elegí una dirección, forma de pago y confirmá el pedido
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Dirección de entrega
            </h2>

            {isLoadingAddresses && (
              <p className="text-sm text-gray-500">Cargando direcciones...</p>
            )}

            {isErrorAddresses && (
              <p className="text-sm text-red-600">
                No se pudieron cargar las direcciones.
              </p>
            )}

            {addresses.length > 0 && (
              <div className="space-y-3 mb-5">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1"
                      />

                      <div>
                        <p className="font-medium text-gray-900">
                          {address.alias || "Dirección"}
                          {address.es_principal ? " • Principal" : ""}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.linea1}
                          {address.linea2 ? `, ${address.linea2}` : ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {address.ciudad}, {address.provincia}{" "}
                          {address.codigo_postal || ""}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Agregar nueva dirección
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <form.Field name="alias">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Alias
                      </label>
                      <input
                        placeholder="Casa"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="linea1"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim()
                        ? "La dirección es obligatoria"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Dirección
                      </label>
                      <input
                        placeholder="Av. Siempre Viva 742"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="text-xs text-red-600">
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="linea2">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Piso / Depto
                      </label>
                      <input
                        placeholder="Piso 2 / Depto B"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="ciudad"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim() ? "La ciudad es obligatoria" : undefined,
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Ciudad
                      </label>
                      <input
                        placeholder="Córdoba"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="text-xs text-red-600">
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="provincia"
                  validators={{
                    onChange: ({ value }) =>
                      !value.trim()
                        ? "La provincia es obligatoria"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Provincia
                      </label>
                      <input
                        placeholder="Córdoba"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="text-xs text-red-600">
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="codigo_postal">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-600">
                        Código postal
                      </label>
                      <input
                        placeholder="5000"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="es_principal">
                  {(field) => (
                    <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        onBlur={field.handleBlur}
                      />
                      Marcar como dirección principal
                    </label>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={
                        !canSubmit ||
                        isSubmitting ||
                        createAddressMutation.isPending
                      }
                      className="sm:col-span-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {createAddressMutation.isPending
                        ? "Guardando..."
                        : "Guardar dirección"}
                    </button>
                  )}
                </form.Subscribe>
              </form>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Forma de pago
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "EFECTIVO"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="EFECTIVO"
                  checked={paymentMethod === "EFECTIVO"}
                  onChange={() => setPaymentMethod("EFECTIVO")}
                  className="mr-2"
                />
                Efectivo
              </label>

              <label
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "MERCADOPAGO"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="MERCADOPAGO"
                  checked={paymentMethod === "MERCADOPAGO"}
                  onChange={() => setPaymentMethod("MERCADOPAGO")}
                  className="mr-2"
                />
                Mercado Pago
              </label>
              <label
                className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                  paymentMethod === "TRANSFERENCIA"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="TRANSFERENCIA"
                  checked={paymentMethod === "TRANSFERENCIA"}
                  onChange={() => setPaymentMethod("TRANSFERENCIA")}
                  className="mr-2"
                />
                Transferencia
              </label>
            </div>

            {paymentMethod === "MERCADOPAGO" && (
              <p className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                Al confirmar el pedido te redirigiremos al checkout seguro de
                Mercado Pago.
              </p>
            )}
          </section>
        </div>

        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">
            Resumen final
          </h2>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-gray-500">Cantidad: {item.quantity}</p>
                </div>

                <span className="font-medium text-gray-900">
                  $
                  {(item.product.price * item.quantity).toLocaleString(
                    "es-AR",
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${getTotalPrice().toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={createOrderMutation.isPending}
            className="w-full mt-5 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createOrderMutation.isPending
              ? paymentMethod === "MERCADOPAGO"
                ? "Redirigiendo a Mercado Pago..."
                : "Confirmando..."
              : paymentMethod === "MERCADOPAGO"
                ? "Confirmar y pagar"
                : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </div>
  );
};
