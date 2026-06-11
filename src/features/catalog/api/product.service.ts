import { api } from "@/shared/api/client";
import type { IProduct } from "../types/product.types";

const BASE_URL = "/productos/";

type UnitMeasureApi = {
  id: number;
  nombre: string;
  abreviatura: string;
};

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
    stock_cantidad: number;
  };
  cantidad: string;
  unidad_medida_id: number | null;
  unidad_medida: UnitMeasureApi | null;
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
  unidad_venta_id: number | null;
  unidad_venta: UnitMeasureApi | null;
  categorias: ProductApiCategory[];
  ingredientes: ProductApiIngredient[];
};

type ProductsApiResponse = {
  data: ProductApi[];
  total: number;
};

const mapUnitMeasureFromApi = (unit: UnitMeasureApi | null) => {
  if (!unit) return null;

  return {
    id: String(unit.id),
    nombre: unit.nombre,
    abreviatura: unit.abreviatura,
  };
};

const mapProductFromApi = (product: ProductApi): IProduct => ({
  id: String(product.id),
  name: product.nombre,
  description: product.descripcion,
  price: Number(product.precio_base),
  images: product.imagenes_url ?? [],
  stock: product.stock_cantidad,
  available: product.disponible,
  unitMeasureId: product.unidad_venta_id
    ? String(product.unidad_venta_id)
    : null,
  unitMeasure: mapUnitMeasureFromApi(product.unidad_venta),

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
      stock: item.ingrediente.stock_cantidad ?? 0,
    },
    cantidad: Number(item.cantidad),
    unidad_medida_id: item.unidad_medida_id
      ? String(item.unidad_medida_id)
      : null,
    unidad_medida: mapUnitMeasureFromApi(item.unidad_medida),
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