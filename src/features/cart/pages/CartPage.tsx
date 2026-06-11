import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "../store/cart.store";

export const CartPage = () => {
  const navigate = useNavigate();

  const {
    items,
    removeProduct,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalPrice,
  } = useCartStore();

  const { isAuthenticated, isLoading } = useAuthStore();

  const handleContinueCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Agregá productos para comenzar tu pedido.
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrito</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Revisá los productos antes de confirmar el pedido
          </p>
        </div>

        <button
          onClick={clearCart}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {items.map((item) => {
            const removedIds = item.removedIngredientIds ?? [];

            const removedIngredientNames = item.product.ingredients
              .filter((ingredientItem) =>
                removedIds.includes(Number(ingredientItem.ingrediente.id)),
              )
              .map((ingredientItem) => ingredientItem.ingrediente.name)
              .join(", ");

            return (
              <div
                key={`${item.product.id}-${removedIds.join("-")}`}
                className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0"
              >
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">
                    {item.product.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.product.description || "Sin descripción"}
                  </p>

                  {removedIds.length > 0 && (
                    <p className="text-xs text-amber-700 mt-1">
                      Sin: {removedIngredientNames || "ingredientes seleccionados"}
                    </p>
                  )}

                  <p className="font-bold text-gray-900 mt-2">
                    ${item.product.price.toLocaleString("es-AR")}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQuantity(item.product.id, removedIds)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      -
                    </button>

                    <span className="text-sm font-medium text-gray-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.product.id, removedIds)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeProduct(item.product.id, removedIds)}
                      className="ml-auto px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">
            Resumen del pedido
          </h2>

          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${getTotalPrice().toLocaleString("es-AR")}
            </span>
          </div>

          {!isAuthenticated && (
            <p className="mt-3 text-xs text-gray-500">
              Para finalizar la compra necesitás iniciar sesión o registrarte.
            </p>
          )}

          <button
            onClick={handleContinueCheckout}
            disabled={isLoading}
            className="w-full mt-5 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verificando sesión..." : "Continuar compra"}
          </button>
        </aside>
      </div>
    </div>
  );
};