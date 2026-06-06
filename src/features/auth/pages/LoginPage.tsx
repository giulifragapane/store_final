import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();

  const loginUser = useAuthStore((state) => state.loginUser);
  const hasRole = useAuthStore((state) => state.hasRole);

  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormValues,
    onSubmit: async ({ value }) => {
      try {
        setError("");

        await loginUser(value.email, value.password);

        if (!hasRole(["CLIENT"])) {
          setError("Necesitás iniciar sesión con una cuenta de cliente.");
          return;
        }

        navigate("/checkout");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo iniciar sesión",
        );
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">🍕🍸</div>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ingresá para finalizar tu pedido
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "El email es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <span className="text-xs text-red-600">
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "La contraseña es obligatoria" : undefined,
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <span className="text-xs text-red-600">
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="font-medium text-blue-600">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};
