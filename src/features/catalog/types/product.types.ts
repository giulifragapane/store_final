import type { ICategory } from "./category.types";
import type { IIngredient } from "./ingredient.types";

export interface IUnitMeasure {
  id: string;
  nombre: string;
  abreviatura: string;
}

export interface IProductCategoryLink {
  categoria: ICategory;
  es_principal: boolean;
}

export interface IProductIngredientLink {
  ingrediente: IIngredient;
  es_removible: boolean;
  cantidad: number;
  unidad_medida_id: string | null;
  unidad_medida: IUnitMeasure | null;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  available: boolean;
  unitMeasureId: string | null;
  unitMeasure: IUnitMeasure | null;
  categories: IProductCategoryLink[];
  ingredients: IProductIngredientLink[];
}