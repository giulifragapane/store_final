import { Link } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import { useProfile } from "../hooks/useProfile";

export const ProfilePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const {
    data: user,
    isLoading,
    isError,
  } = useProfile();

  if (isAuthLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-12 text-center">
          <p className="text-5xl mb-4">👤</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Iniciá sesión para ver tu perfil
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Desde tu perfil podés consultar tus datos de cliente y el estado de tu cuenta.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-6 py-8">
          <p className="text-red-600 font-medium">
            No se pudo cargar el perfil.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Intentá recargar la página o volver a iniciar sesión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-5">
          <p className="text-4xl mb-2">👤</p>
          <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
          <p className="text-sm text-gray-500 mt-1">
            Datos de tu cuenta de cliente
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Nombre
              </p>
              <p className="mt-1 font-semibold text-gray-900">{user.nombre}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Apellido
              </p>
              <p className="mt-1 font-semibold text-gray-900">{user.apellido}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-1 font-semibold text-gray-900 break-all">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Celular
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.celular || "No informado"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Estado
              </p>
              <span
                className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  user.disabled
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.disabled ? "Deshabilitado" : "Activo"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              Ver mis pedidos
            </Link>

            <Link
              to="/addresses"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Ver mis direcciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
