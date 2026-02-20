
# Prototipo de E-Commerce

![Estado](https://img.shields.io/badge/Estado-Prototipo-orange)


## 📋 Descripción

Este proyecto es un prototipo funcional de una tienda en línea desarrollado como proyecto final de Ingeniería de Software. Simula el ciclo completo de una compra: desde buscar productos y agregarlos al carrito, hasta el pago seguro con PayPal y la generación de la orden.

**Funcionalidades Principales:**
*   Catálogo con búsqueda y filtros.
*   Carrito de compras persistente (no se borra al recargar).
*   Pagos reales simulados con **PayPal Sandbox**.
*   Control de stock automático tras la compra.

---

## 🛠 Tecnologías Utilizadas

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Lenguaje:** TypeScript (Modo Estricto)
*   **Base de Datos:** PostgreSQL (vía Supabase)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand) (con Middleware de Persistencia)
*   **Pagos:** PayPal JavaScript SDK
*   **Estilos:** Tailwind CSS & Shadcn/UI

---

## 🚀 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu computadora.

### Requisitos Previos
*   Node.js 18+ instalado.
*   Una base de datos PostgreSQL (se recomienda Supabase).
*   Una cuenta de desarrollador de PayPal (Sandbox).

### 1. Clonar el repositorio

```bash
git clone https://github.com/useraj875/ecommerce-prototype.git
cd ecommerce-prototype
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales:

```env
# Conexión a Base de Datos (Supabase/PostgreSQL)
POSTGRES_PRISMA_URL="url_de_conexion_aqui"
POSTGRES_URL_NON_POOLING="url_directa_aqui"

# PayPal Sandbox (Cuenta de Desarrollador)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="cliente_id_sandbox_aqui"
```

### 3. Preparar la Base de Datos

Ejecuta estos comandos para crear las tablas y cargar los productos de prueba:

```bash
# Crear tablas en la base de datos
npx prisma db push

# Cargar productos de ejemplo (Semilla)
npx prisma db seed
```

### 4. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📂 Estructura del Proyecto

```text
/app
  /(storefront)      # Rutas públicas (Catálogo, Carrito, Checkout)
  /api               # Endpoints de API (si fueran necesarios)
  layout.tsx         # Layout raíz (Navbar, Providers)

/components
  /catalog           # Tarjetas de producto, Filtros, Skeletons
  /cart              # Ítems del carrito, Resumen, Lógica visual
  /checkout          # Botones de PayPal, Lógica de pago
  /ui                # Componentes reutilizables (Shadcn)

/lib
  actions.ts         # Server Actions (Lógica Backend y Mutaciones)
  store.ts           # Store de Zustand (Estado del Cliente)
  prisma.ts          # Singleton de Base de Datos
  utils.ts           # Funciones auxiliares (Formato de moneda)

/prisma
  schema.prisma      # Definición del Esquema de Base de Datos
  seed.ts            # Script de población de datos
```
---

## 🧪 Cómo Probar el Pago

1.  Agrega productos al carrito.
2.  Ve al Checkout.
3.  Usa una cuenta de **PayPal Sandbox Personal** para pagar.

4.  Al finalizar, serás redirigido a la página de confirmación y el stock del producto se reducirá automáticamente.
---

## 🚢 Despliegue

Este proyecto está optimizado para **Vercel**.

1.  Sube el código a GitHub.
2.  Importa el proyecto en Vercel.
3.  **Crucial:** Agrega las Variables de Entorno en el Panel de Vercel (Settings -> Environment Variables).
4.  Despliega.

---