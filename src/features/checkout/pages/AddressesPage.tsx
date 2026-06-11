import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../api/addresses.service";
import type {
  AddressListResponse,
  AddressPayload,
  IAddress,
} from "../types/address.types";
import { AddressModal } from "../components/modals/ModalAddresses/ModalAddresses";
import { AddressDetailModal } from "../components/modals/AddressDetailModal/AddressDetailModal";

export const AddressesPage = () => {
  const queryClient = useQueryClient();

  const [addressActive, setAddressActive] = useState<IAddress | null>(null);
  const [addressToView, setAddressToView] = useState<IAddress | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<IAddress | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleCloseModal = () => {
    setAddressActive(null);
    setOpenModal(false);
  };

  const handleOpenModal = (address: IAddress | null = null) => {
    setAddressActive(address);
    setOpenModal(true);
  };

  const handleCloseDeleteModal = () => {
    setAddressToDelete(null);
    setDeleteError("");
  };

  const { data, isLoading, isError } = useQuery<AddressListResponse>({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });

  const addresses = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AddressPayload>;
    }) => updateAddress(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      handleCloseDeleteModal();
    },

    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { detail?: string } };
      };

      setDeleteError(
        axiosError.response?.data?.detail ||
          "No se pudo eliminar la dirección.",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <p className="text-gray-600">Cargando direcciones...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <p className="text-red-600">Hubo un error al cargar las direcciones.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis direcciones</h1>

            <p className="text-sm text-gray-500 mt-0.5">
              {addresses.length} direcciones registradas
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva dirección
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">Alias</th>
                <th className="px-4 py-3 text-left font-medium">Dirección</th>
                <th className="px-4 py-3 text-left font-medium">Ciudad</th>
                <th className="px-4 py-3 text-center font-medium">Estado</th>
                <th className="px-4 py-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {addresses.map((address) => (
                <tr
                  key={address.id}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">
                      {address.alias || "Sin alias"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {address.linea1}
                    {address.linea2 ? ` - ${address.linea2}` : ""}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {address.ciudad}, {address.provincia}
                    {address.codigo_postal ? ` (${address.codigo_postal})` : ""}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        address.es_principal
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {address.es_principal ? "Principal" : "Secundaria"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setAddressToView(address)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => handleOpenModal(address)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => {
                          setDeleteError("");
                          setAddressToDelete(address);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {addresses.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-5xl mb-3">📍</p>

              <p className="font-medium text-gray-600">
                No tenés direcciones registradas
              </p>

              <p className="text-sm mt-1">
                Agregá una dirección luego de continuar la compra para realizar
                tu pedido.
              </p>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <AddressModal
          addressActive={addressActive}
          handleCloseModal={handleCloseModal}
          handleCreate={(data: AddressPayload) => createMutation.mutateAsync(data)}
          handleUpdate={(id, data) =>
            updateMutation.mutateAsync({
              id,
              data,
            })
          }
        />
      )}

      {addressToView && (
        <AddressDetailModal
          address={addressToView}
          handleCloseModal={() => setAddressToView(null)}
        />
      )}

      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirmar eliminación
              </h2>

              <button
                onClick={handleCloseDeleteModal}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-gray-700">
                ¿Seguro que querés eliminar la dirección{" "}
                <span className="font-semibold">
                  {addressToDelete.alias || addressToDelete.linea1}
                </span>
                ?
              </p>

              {deleteError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={() => deleteMutation.mutate(addressToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
