# MFEL Obrador - Aplicación de Pedidos de Panadería

Aplicación web completa para gestionar pedidos semanales de una panadería artesanal.

## 🌟 Características

### Para Clientes
- ✅ Catálogo de productos con imágenes
- ✅ Carrito de compras
- ✅ Registro de usuarios
- ✅ Cálculo automático de fecha de entrega (jueves)
- ✅ Opciones de envío y recogida
- ✅ Múltiples métodos de pago

### Para Administradores
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de productos (CRUD)
- ✅ Sistema de carga de imágenes
- ✅ Gestión de pedidos con filtros
- ✅ Actualización de estados de pedidos
- ✅ Vista móvil responsive

## 🚀 Tecnologías

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Vanilla CSS con variables CSS
- **Base de Datos**: SQLite (local) / Turso (producción)
- **ORM**: Prisma 5
- **Autenticación**: NextAuth.js
- **Despliegue**: Vercel

## 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma migrate dev

# Sembrar datos iniciales
npx tsx src/lib/seed-db.ts

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Credenciales de Admin
- **Email**: admin@mfelobrador.com
- **Contraseña**: Admin123!

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/           # Panel de administración
│   ├── api/             # API routes
│   ├── login/           # Página de login
│   ├── register/        # Página de registro
│   └── checkout/        # Página de checkout
├── components/          # Componentes reutilizables
├── context/             # React Context (Cart)
├── lib/                 # Utilidades y configuración
└── types/               # TypeScript types

prisma/
├── schema.prisma        # Esquema de base de datos
└── migrations/          # Migraciones

public/
├── products/            # Imágenes de productos (estáticas)
└── uploads/             # Imágenes subidas por admin
```

## 🗄️ Base de Datos

### Modelos

- **User**: Usuarios y administradores
- **Product**: Catálogo de productos
- **Order**: Pedidos de clientes

Ver `prisma/schema.prisma` para detalles completos.

## 🌐 Despliegue

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue en Vercel con Turso.

## 📝 Variables de Entorno

Crea un archivo `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secret-key-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

Para producción, ver DEPLOYMENT.md.

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npx prisma studio    # GUI de base de datos
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Rutas de admin protegidas con middleware
- Validación de sesiones con JWT
- Sanitización de inputs

## 📄 Licencia

Proyecto privado - MFEL Obrador

## 👨‍💻 Desarrollado por

Eduardo Loyola (eduloyola@gmail.com)

---

**¡Disfruta gestionando tus pedidos!** 🥖✨
