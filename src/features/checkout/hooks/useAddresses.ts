import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../api/addresses.service";
import type { AddressListResponse } from "../types/address.types";

export const useAddresses = (isAuthenticated: boolean) => {
  return useQuery<AddressListResponse>({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled: isAuthenticated,
  });
};
