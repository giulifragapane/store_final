import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "@/features/cart";
import { useProductDetail } from "../hooks/useProductDetail";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const addProduct = useCartStore((state) => state.addProduct);

  const {
    data: product,
    isLoading,
    isError,
  } = useProductDetail(id);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <p className="text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <p className="text-red-600">No se pudo cargar el producto.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full max-h-80 object-cover"
          />
        ) : (
          <div className="h-72 bg-gray-100 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {product.categories.map((item) => (
              <span
                key={`detail-cat-${item.categoria.id}`}
                style={{ backgroundColor: item.categoria.color || "#E5E7EB" }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800"
              >
                {item.categoria.name}
                {item.es_principal ? " ★ principal" : ""}
              </span>
            ))}
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Descripción
            </span>
            <p className="text-sm text-gray-700 leading-relaxed mt-1">
              {product.description || "Sin descripción"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Precio
              </span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                ${product.price.toLocaleString("es-AR")}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Stock
              </span>
              <p className="text-sm text-gray-700 mt-1">
                {product.stock} unidades
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Estado
              </span>
              <p
                className={`inline-flex mt-1 items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.available ? "Disponible" : "No disponible"}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Ingredientes
            </span>

            <div className="flex flex-wrap gap-2 mt-2">
              {product.ingredients.length > 0 ? (
                product.ingredients.map((item) => (
                  <span
                    key={`detail-ing-${item.ingrediente.id}`}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.ingrediente.isAllergen
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.ingrediente.name}
                    {item.ingrediente.isAllergen ? " • alérgeno" : ""}
                    {item.es_removible ? " • removible" : ""}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Sin ingredientes</span>
              )}
            </div>
          </div>

          <button
            onClick={() => addProduct(product)}
            disabled={!product.available || product.stock <= 0}
            className="w-full sm:w-fit px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
