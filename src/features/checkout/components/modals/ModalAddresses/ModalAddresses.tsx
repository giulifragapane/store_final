import { useState, type SyntheticEvent } from "react";
import type {
  AddressPayload,
  IAddress,
} from "@/features/checkout/types/address.types";

type Props = {
  addressActive: IAddress | null;
  handleCloseModal: VoidFunction;
  handleCreate: (data: AddressPayload) => Promise<IAddress>;
  handleUpdate: (
    id: number,
    data: Partial<AddressPayload>,
  ) => Promise<IAddress>;
};

export const AddressModal = ({
  addressActive,
  handleCloseModal,
  handleCreate,
  handleUpdate,
}: Props) => {
  const [alias, setAlias] = useState(addressActive?.alias ?? "");
  const [linea1, setLinea1] = useState(addressActive?.linea1 ?? "");
  const [linea2, setLinea2] = useState(addressActive?.linea2 ?? "");
  const [ciudad, setCiudad] = useState(addressActive?.ciudad ?? "");
  const [provincia, setProvincia] = useState(addressActive?.provincia ?? "");
  const [codigoPostal, setCodigoPostal] = useState(
    addressActive?.codigo_postal ?? "",
  );
  const [esPrincipal, setEsPrincipal] = useState(
    addressActive?.es_principal ?? false,
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setError("");

    if (!linea1.trim()) {
      setError("La dirección es obligatoria");
      return;
    }

    if (!ciudad.trim()) {
      setError("La ciudad es obligatoria");
      return;
    }

    if (!provincia.trim()) {
      setError("La provincia es obligatoria");
      return;
    }

    try {
      const payload: AddressPayload = {
        alias,
        linea1,
        linea2,
        ciudad,
        provincia,
        codigo_postal: codigoPostal,
        es_principal: esPrincipal,
      };

      if (addressActive) {
        await handleUpdate(addressActive.id, payload);
      } else {
        await handleCreate(payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {addressActive ? "Editar dirección" : "Nueva dirección"}
          </h2>

          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form id="address-form" onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Alias</label>

              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Casa"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Dirección
              </label>

              <input
                type="text"
                value={linea1}
                onChange={(e) => setLinea1(e.target.value)}
                placeholder="Av. Siempre Viva 742"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Piso / Depto
              </label>

              <input
                type="text"
                value={linea2}
                onChange={(e) => setLinea2(e.target.value)}
                placeholder="Piso 2 - Depto B"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Ciudad
                </label>

                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Mendoza"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Provincia
                </label>

                <input
                  type="text"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  placeholder="Mendoza"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Código postal
              </label>

              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="5500"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={esPrincipal}
                onChange={(e) => setEsPrincipal(e.target.checked)}
              />
              Dirección principal
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="address-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {addressActive ? "Guardar cambios" : "Crear dirección"}
          </button>
        </div>
      </div>
    </div>
  );
};
