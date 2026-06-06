import type { ICategory } from "./category.types";
import type { IIngredient } from "./ingredient.types";

export interface IProductCategoryLink {
  categoria: ICategory;
  es_principal: boolean;
}

export interface IProductIngredientLink {
  ingrediente: IIngredient;
  es_removible: boolean;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  available: boolean;
  categories: IProductCategoryLink[];
  ingredients: IProductIngredientLink[];
}
