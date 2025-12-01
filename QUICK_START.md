# 🚀 Quick Start - MFEL Obrador

## Para Probar Localmente (AHORA)

```bash
cd "/Users/eduardoloyola/Downloads/Pedidos PanIsVite"
npm run dev
```

Abre: **http://localhost:3000**

### Credenciales Admin
- Email: `admin@mfelobrador.com`
- Password: `Admin123!`

---

## Para Desplegar en Producción (5 minutos)

### 1. GitHub (2 min)
```bash
# Configurar Git
git config user.email "eduloyola@gmail.com"
git config user.name "Eduardo Loyola"

# Crear repo en: https://github.com/new
# Nombre: mfel-obrador

# Subir código
git remote add origin https://github.com/TU_USUARIO/mfel-obrador.git
git push -u origin main
```

### 2. Turso (2 min)
```bash
# Instalar
brew install tursodatabase/tap/turso

# Crear DB
turso auth signup
turso db create mfel-obrador

# Obtener credenciales
turso db show mfel-obrador --url
turso db tokens create mfel-obrador
```

### 3. Vercel (1 min)
1. Ir a: https://vercel.com/signup
2. Importar repositorio `mfel-obrador`
3. Añadir variables de entorno:
   - `DATABASE_URL` = URL de Turso
   - `TURSO_AUTH_TOKEN` = Token de Turso
   - `NEXTAUTH_SECRET` = (genera con: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = https://tu-proyecto.vercel.app
4. Deploy!

---

## Documentación Completa

- **GOOD_MORNING.md** - Resumen de bienvenida
- **NIGHT_WORK_SUMMARY.md** - Todo lo implementado
- **DEPLOYMENT.md** - Guía detallada de despliegue
- **README.md** - Documentación técnica

---

## ¿Problemas?

1. Revisa los logs en la terminal
2. Lee DEPLOYMENT.md para más detalles
3. Verifica que el servidor esté corriendo

---

**¡Listo para recibir pedidos!** 🥖✨
