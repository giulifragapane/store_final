import { api } from "@/shared/api/client";
import type {
  AddressListResponse,
  AddressPayload,
  IAddress,
} from "../types/address.types";

export const getAddresses = async (): Promise<AddressListResponse> => {
  const response = await api.get<AddressListResponse>("/api/v1/direcciones/");
  return response.data;
};

export const createAddress = async (
  payload: AddressPayload,
): Promise<IAddress> => {
  const response = await api.post<IAddress>("/api/v1/direcciones/", payload);
  return response.data;
};

export const updateAddress = async (
  id: number,
  payload: Partial<AddressPayload>,
): Promise<IAddress> => {
  const response = await api.patch<IAddress>(
    `/api/v1/direcciones/${id}`,
    payload,
  );

  return response.data;
};

export const setMainAddress = async (id: number): Promise<IAddress> => {
  const response = await api.patch<IAddress>(
    `/api/v1/direcciones/${id}/principal`,
  );

  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/direcciones/${id}`);
};
