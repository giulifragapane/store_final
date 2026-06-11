import type { IAddress } from "@/features/checkout/types/address.types";

type Props = {
  address: IAddress;
  handleCloseModal: VoidFunction;
};

export const AddressDetailModal = ({ address, handleCloseModal }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Detalle de dirección
          </h2>

          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Alias
            </span>

            <p className="text-sm text-gray-700">
              {address.alias || "Sin alias"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Dirección
            </span>

            <p className="text-sm text-gray-700">{address.linea1}</p>
          </div>

          {address.linea2 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Línea adicional
              </span>

              <p className="text-sm text-gray-700">{address.linea2}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Ciudad
            </span>

            <p className="text-sm text-gray-700">{address.ciudad}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Provincia
            </span>

            <p className="text-sm text-gray-700">{address.provincia}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Código postal
            </span>

            <p className="text-sm text-gray-700">
              {address.codigo_postal || "No especificado"}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Dirección principal
            </span>

            <p className="text-sm text-gray-700">
              {address.es_principal ? "Sí" : "No"}
            </p>
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
