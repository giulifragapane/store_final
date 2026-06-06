# Store App - Parcial Frontend Parte 2

Frontend público para clientes desarrollado con React, TypeScript y Vite.

La aplicación permite ver productos, consultar detalles, armar un carrito, registrarse o iniciar sesión como cliente y realizar pedidos contra el backend.

## Documentación

- Documentación general: `DOCUMENTACION-STORE-APP.md`
- Guía de transición de arquitectura: `GUIA-TRANSICION-ARQUITECTURA.md`

## Tecnologías

- React + TypeScript + Vite
- React Router DOM
- TanStack Query
- TanStack Form
- Zustand
- Axios
- Tailwind CSS

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crear un archivo `.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

## Ejecutar el proyecto

```bash
pnpm dev
```

## Funcionalidades

- Listado público de productos.
- Búsqueda y filtro por categoría.
- Detalle de producto con ruta dinámica `/products/:id`.
- Carrito con Zustand y persistencia en localStorage.
- Modificación de cantidades, eliminación de productos y total del carrito.
- Registro e inicio de sesión de clientes.
- Checkout con dirección de entrega y forma de pago.
- Creación real de pedidos con `POST /api/v1/pedidos/`.
- Pantalla de pedidos del cliente.
- Cancelación de pedidos en estado permitido.

## Flujo de compra

La tienda es pública para navegar productos, ver detalles y usar el carrito.

La autenticación solo se solicita al finalizar la compra, porque el backend necesita asociar el pedido a un usuario cliente y a una dirección de entrega.

Flujo:

1. El cliente navega productos sin login.
2. Agrega productos al carrito.
3. Al continuar compra:
   - si no está logueado, va a `/login`;
   - si está logueado, va a `/checkout`.
4. Selecciona o crea una dirección.
5. Elige forma de pago.
6. Confirma el pedido.
7. El carrito se vacía y se redirige a `/orders`.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Listado de productos |
| `/products/:id` | Detalle de producto |
| `/cart` | Carrito |
| `/login` | Inicio de sesión |
| `/register` | Registro de cliente |
| `/checkout` | Finalizar compra |
| `/orders` | Pedidos del cliente |
| `/profile` | Información del cliente |

## Estructura principal

```txt
src/
  main.tsx
  App.tsx
  router/
    AppRouter.tsx
  shared/
    api/client.ts
    components/layout/NavBar.tsx
  features/
    catalog/       # productos (api, hooks, pages, types)
    cart/          # carrito (store, pages)
    auth/          # login, registro, perfil (api, store, hooks, pages)
    checkout/      # finalizar compra (api, hooks, pages)
    orders/        # pedidos del cliente (api, hooks, pages)
```

Imports con alias `@/` → `src/` (ej. `@/features/catalog`).

## Requisitos cumplidos

- Axios centralizado con `baseURL` desde `.env` y `withCredentials`.
- Interceptor básico de errores.
- React Router DOM con rutas y parámetro dinámico.
- TanStack Query para consultas y mutaciones.
- TanStack Form en formularios.
- Zustand para carrito y sesión.
- Tailwind CSS funcional.
- Carrito persistente con localStorage.
- Checkout y creación de pedidos.
- Pantalla de pedidos del cliente.