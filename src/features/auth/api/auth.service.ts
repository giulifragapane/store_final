import { api } from "@/shared/api/client";
import type { IUser } from "../types/user.types";

type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
};

export const login = async ({
  email,
  password,
}: LoginPayload): Promise<IUser> => {
  const formData = new FormData();

  formData.append("username", email);
  formData.append("password", password);

  await api.post("/api/v1/auth/login", formData);

  const user = await getMe();
  return user;
};

export const register = async (payload: RegisterPayload): Promise<IUser> => {
  const response = await api.post<IUser>("/api/v1/auth/register", payload);
  return response.data;
};

export const getMe = async (): Promise<IUser> => {
  const response = await api.get<IUser>("/api/v1/auth/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/v1/auth/logout");
};
