# Guia de transicion de estructura (store-app)

Este documento explica el cambio desde una estructura "por capas tecnicas" a una estructura "por features" en `store-app`.

Objetivo: encontrar rapido donde esta cada responsabilidad hoy, si conoces el proyecto con la estructura anterior.

---

## 1) Que cambio y por que

### Antes

El codigo estaba agrupado por tipo de archivo:

- `src/pages/` para pantallas.
- `src/api/` para servicios HTTP.
- `src/store/` para estado global.
- `src/types/` para tipos compartidos.
- `src/components/` para componentes.
- `src/routes/` para ruteo.

### Ahora

La app se organiza por dominios funcionales en `src/features/`, con infraestructura comun en `src/shared/` y rutas en `src/router/`.

Beneficios del nuevo esquema:

- Cada feature concentra su UI, hooks, servicios y tipos.
- Menos acoplamiento entre dominios.
- Mejor mantenibilidad.
- Mas facil escalar sin mezclar responsabilidades.

---

## 2) Estructura actual de referencia

```txt
src/
  App.tsx
  main.tsx
  router/
    AppRouter.tsx
  shared/
    api/client.ts
    components/layout/NavBar.tsx
  features/
    catalog/
      api/product.service.ts
      hooks/useProducts.ts
      hooks/useProductDetail.ts
      pages/ProductsPage.tsx
      pages/ProductDetailPage.tsx
      types/{product,category,ingredient}.types.ts
    cart/
      store/cart.store.ts
      pages/CartPage.tsx
    auth/
      api/auth.service.ts
      store/auth.store.ts
      hooks/useProfile.ts
      pages/{LoginPage,RegisterPage,ProfilePage}.tsx
      types/user.types.ts
    checkout/
      api/addresses.service.ts
      hooks/{useAddresses,useCreateAddress,useCreateOrder}.ts
      components/modals/
        ModalAddresses/ModalAddresses.tsx
        AddressDetailModal/AddressDetailModal.tsx
      pages/{CheckoutPage,AddressesPage}.tsx
      types/address.types.ts
    orders/
      api/orders.service.ts
      hooks/{useOrders,useCancelOrder}.ts
      pages/OrdersPage.tsx
      types/order.types.ts
```

---

## 3) Mapa rapido: antes -> ahora

### Carpetas

- `src/pages/*` -> `src/features/<dominio>/pages/*`
- `src/api/*` -> `src/features/<dominio>/api/*` y `src/shared/api/client.ts`
- `src/store/*` -> `src/features/<dominio>/store/*`
- `src/types/*` -> `src/features/<dominio>/types/*`
- `src/routes/*` -> `src/router/AppRouter.tsx`
- `src/components/NavBar/*` -> `src/shared/components/layout/NavBar.tsx`
- `src/components/modals/*` -> `src/features/<dominio>/components/modals/*`

### Ruteo

- Antes: importaciones directas desde `src/pages/*`.
- Ahora: `src/router/AppRouter.tsx` importa desde `@/features/*` (barrels `index.ts` de cada feature).

### Rutas actuales

| Ruta | Pagina | Feature |
|------|--------|---------|
| `/` | `ProductsPage` | catalog |
| `/products/:id` | `ProductDetailPage` | catalog |
| `/cart` | `CartPage` | cart |
| `/login` | `LoginPage` | auth |
| `/register` | `RegisterPage` | auth |
| `/checkout` | `CheckoutPage` | checkout |
| `/orders` | `OrdersPage` | orders |
| `/addresses` | `AddressesPage` | checkout |
| `/profile` | `ProfilePage` | auth |

---

## 4) Equivalencia de archivos (nombre viejo -> nombre nuevo)

### Catalogo

- `src/pages/ProductsPage.tsx` -> `src/features/catalog/pages/ProductsPage.tsx`
- `src/pages/ProductDetailPage.tsx` -> `src/features/catalog/pages/ProductDetailPage.tsx`
- `src/api/product.service.ts` -> `src/features/catalog/api/product.service.ts`

### Carrito

- `src/pages/CartPage.tsx` -> `src/features/cart/pages/CartPage.tsx`
- `src/store/cart.store.ts` -> `src/features/cart/store/cart.store.ts`

### Auth

- `src/pages/LoginPage.tsx` -> `src/features/auth/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx` -> `src/features/auth/pages/RegisterPage.tsx`
- `src/pages/UserPage.tsx` -> `src/features/auth/pages/ProfilePage.tsx` (cambio de nombre)
- `src/api/auth.service.ts` -> `src/features/auth/api/auth.service.ts`
- `src/store/auth.store.ts` -> `src/features/auth/store/auth.store.ts`

### Checkout y direcciones

- `src/pages/CheckoutPage.tsx` -> `src/features/checkout/pages/CheckoutPage.tsx`
- `src/pages/AddressesPage.tsx` -> `src/features/checkout/pages/AddressesPage.tsx`
- `src/api/addresses.service.ts` -> `src/features/checkout/api/addresses.service.ts`
- `src/types/IAddress.ts` -> `src/features/checkout/types/address.types.ts`
- `src/components/modals/ModalAddresses/ModalAddresses.tsx` -> `src/features/checkout/components/modals/ModalAddresses/ModalAddresses.tsx`
- `src/components/modals/AddressDetailModal/AddressDetailModal.tsx` -> `src/features/checkout/components/modals/AddressDetailModal/AddressDetailModal.tsx`

### Pedidos

- `src/pages/OrdersPage.tsx` -> `src/features/orders/pages/OrdersPage.tsx`
- `src/api/orders.service.ts` -> `src/features/orders/api/orders.service.ts`

### Infraestructura compartida

- `src/api/api.ts` -> `src/shared/api/client.ts` (cliente Axios base)
- `src/components/NavBar/NavBar.tsx` -> `src/shared/components/layout/NavBar.tsx`
- `src/routes/AppRouter.tsx` -> `src/router/AppRouter.tsx`

---

## 5) Donde se hace ahora lo que antes se hacia en otros lados

- **Llamadas HTTP**
  - Antes: concentradas en `src/api/`.
  - Ahora: por dominio en `src/features/*/api/` + cliente comun en `src/shared/api/client.ts`.

- **Queries y mutaciones (TanStack Query)**
  - Antes: mas mezcladas dentro de paginas.
  - Ahora: extraidas a `src/features/*/hooks/` (salvo logica muy especifica de una pantalla, como en `AddressesPage`).

- **Estado global (Zustand)**
  - Antes: `src/store/`.
  - Ahora: `src/features/cart/store/` y `src/features/auth/store/`.

- **Pantallas**
  - Antes: `src/pages/`.
  - Ahora: `src/features/*/pages/`.

- **Modales de un dominio**
  - Antes: `src/components/modals/`.
  - Ahora: `src/features/<dominio>/components/modals/`.

- **Tipos**
  - Antes: `src/types/` compartido.
  - Ahora: `src/features/*/types/` cerca de su dominio.

- **Rutas**
  - Antes: en `src/routes/`.
  - Ahora: en `src/router/AppRouter.tsx`.

---

## 6) Direcciones: donde vive hoy

No existe un feature `addresses/` separado. Todo lo relacionado con direcciones queda en **`features/checkout/`**:

| Responsabilidad | Ubicacion actual |
|-----------------|------------------|
| Listar, ver, editar y eliminar direcciones | `checkout/pages/AddressesPage.tsx` |
| Seleccionar direccion al comprar | `checkout/pages/CheckoutPage.tsx` |
| Llamadas HTTP a `/api/v1/direcciones/` | `checkout/api/addresses.service.ts` |
| Tipos `IAddress`, `AddressPayload`, `AddressListResponse` | `checkout/types/address.types.ts` |
| Modal de edicion | `checkout/components/modals/ModalAddresses/` |
| Modal de detalle | `checkout/components/modals/AddressDetailModal/` |
| Link "Mis direcciones" en la barra | `shared/components/layout/NavBar.tsx` |
| Ruta `/addresses` | `router/AppRouter.tsx` |

---

## 7) Convenciones de la nueva estructura

1. Ubicar cada funcionalidad por dominio (`catalog`, `cart`, `auth`, `checkout`, `orders`).
2. Dentro del dominio:
   - UI en `pages/`
   - API en `api/`
   - Query hooks en `hooks/`
   - Modales/componentes del dominio en `components/`
   - Tipos en `types/`
   - Estado en `store/` (solo si hace falta)
3. Usar imports con alias `@/` (ej. `@/features/catalog`).
4. Exponer paginas y APIs publicas desde `index.ts` de cada feature.

---

## 8) Regla practica para ubicarse rapido

Si buscas algo concreto:

- Productos -> `features/catalog`
- Carrito -> `features/cart`
- Login o perfil -> `features/auth`
- Checkout o direcciones -> `features/checkout`
- Pedidos -> `features/orders`
- Axios o NavBar -> `shared`
- Rutas -> `router/AppRouter.tsx`
