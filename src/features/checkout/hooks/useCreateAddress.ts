import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "../api/addresses.service";

type UseCreateAddressOptions = {
  onSuccessSelect: (addressId: number) => void;
  onError: (message: string) => void;
};

export const useCreateAddress = ({
  onSuccessSelect,
  onError,
}: UseCreateAddressOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      onSuccessSelect(newAddress.id);
    },
    onError: (err: Error) => {
      onError(err.message || "No se pudo crear la dirección.");
    },
  });
};
