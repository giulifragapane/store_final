import { Route, Routes } from "react-router-dom";
import { ProductsPage, ProductDetailPage } from "@/features/catalog";
import { CartPage } from "@/features/cart";
import {
  LoginPage,
  RegisterPage,
  ProfilePage,
} from "@/features/auth";
import { CheckoutPage, AddressesPage } from "@/features/checkout";
import { OrdersPage } from "@/features/orders";
import { NavBar } from "@/shared/components/layout/NavBar";

export const AppRouter = () => {
  return (
    <>
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </>
  );
};
