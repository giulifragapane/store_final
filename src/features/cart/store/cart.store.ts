import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProduct } from "@/features/catalog/types/product.types";

export type CartItem = {
  product: IProduct;
  quantity: number;
  removedIngredientIds: number[];
};

type CartState = {
  items: CartItem[];
  addProduct: (product: IProduct, removedIngredientIds?: number[]) => void;
  removeProduct: (productId: string, removedIngredientIds?: number[]) => void;
  increaseQuantity: (productId: string, removedIngredientIds?: number[]) => void;
  decreaseQuantity: (productId: string, removedIngredientIds?: number[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const sameCustomization = (a: number[] = [], b: number[] = []) => {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product, removedIngredientIds = []) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) =>
            item.product.id === product.id &&
            sameCustomization(item.removedIngredientIds, removedIngredientIds),
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id &&
              sameCustomization(item.removedIngredientIds, removedIngredientIds)
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
          return;
        }

        set({
          items: [
            ...currentItems,
            {
              product,
              quantity: 1,
              removedIngredientIds,
            },
          ],
        });
      },

      removeProduct: (productId, removedIngredientIds = []) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                sameCustomization(item.removedIngredientIds, removedIngredientIds)
              ),
          ),
        });
      },

      increaseQuantity: (productId, removedIngredientIds = []) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId &&
            sameCustomization(item.removedIngredientIds, removedIngredientIds)
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        });
      },

      decreaseQuantity: (productId, removedIngredientIds = []) => {
        set({
          items: get()
            .items.map((item) =>
              item.product.id === productId &&
              sameCustomization(item.removedIngredientIds, removedIngredientIds)
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "store-cart",
    },
  ),
);