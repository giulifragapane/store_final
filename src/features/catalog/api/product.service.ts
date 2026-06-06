import { api } from "@/shared/api/client";
import type { IProduct } from "../types/product.types";

const BASE_URL = "/productos/";

type ProductApiCategory = {
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    color: string | null;
    parent_id: number | null;
  };
  es_principal: boolean;
};

type ProductApiIngredient = {
  ingrediente: {
    id: number;
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
  };
  es_removible: boolean;
};

type ProductApi = {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categorias: ProductApiCategory[];
  ingredientes: ProductApiIngredient[];
};

type ProductsApiResponse = {
  data: ProductApi[];
  total: number;
};

const mapProductFromApi = (product: ProductApi): IProduct => ({
  id: String(product.id),
  name: product.nombre,
  description: product.descripcion,
  price: Number(product.precio_base),
  images: product.imagenes_url ?? [],
  stock: product.stock_cantidad,
  available: product.disponible,
  categories: (product.categorias ?? []).map((item) => ({
    categoria: {
      id: String(item.categoria.id),
      name: item.categoria.nombre,
      description: item.categoria.descripcion,
      color: item.categoria.color ?? "",
      imageUrl: item.categoria.imagen_url,
      parentId: item.categoria.parent_id
        ? String(item.categoria.parent_id)
        : null,
    },
    es_principal: item.es_principal,
  })),
  ingredients: (product.ingredientes ?? []).map((item) => ({
    ingrediente: {
      id: String(item.ingrediente.id),
      name: item.ingrediente.nombre,
      description: item.ingrediente.descripcion,
      isAllergen: item.ingrediente.es_alergeno,
    },
    es_removible: item.es_removible,
  })),
});

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await api.get<ProductsApiResponse>(BASE_URL);
  return response.data.data.map(mapProductFromApi);
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const response = await api.get<ProductApi>(`${BASE_URL}${id}`);
  return mapProductFromApi(response.data);
};
