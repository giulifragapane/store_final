import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/features/cart";
import { useProducts } from "../hooks/useProducts";

export const ProductsPage = () => {
  const addProduct = useCartStore((state) => state.addProduct);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: products = [],
    isLoading,
    isError,
  } = useProducts();

  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    products.forEach((product) => {
      product.categories.forEach((item) => {
        categoryMap.set(item.categoria.id, item.categoria.name);
      });
    });

    return Array.from(categoryMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.categories.some(
          (item) => item.categoria.id === selectedCategory,
        );

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-red-600">Hubo un error al cargar los productos.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredProducts.length} productos disponibles
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-52 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <p className="text-4xl mb-3">🍔</p>
          <p className="font-medium text-gray-600">
            No se encontraron productos
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.categories.map((item) => (
                    <span
                      key={`${product.id}-${item.categoria.id}`}
                      style={{
                        backgroundColor: item.categoria.color || "#E5E7EB",
                      }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800"
                    >
                      {item.categoria.name}
                    </span>
                  ))}
                </div>

                <h2 className="font-semibold text-gray-900">
                  {product.name}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-10">
                  {product.description || "Sin descripción"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      ${product.price.toLocaleString("es-AR")}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock} {product.unitMeasure?.abreviatura ?? "uds."}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      product.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.available ? "Disponible" : "Sin stock"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 px-3 py-2 text-center text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver detalle
                  </Link>

                  <button
                    onClick={() => addProduct(product)}
                    disabled={!product.available || product.stock <= 0}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
