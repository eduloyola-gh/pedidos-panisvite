# 🚀 Guía de Despliegue - MFEL Obrador

## ✅ Estado del Proyecto

**Todas las funcionalidades de Phase 3 están completas:**
- ✅ Sistema de carga de imágenes
- ✅ Persistencia de pedidos en base de datos
- ✅ Registro de usuarios
- ✅ Perfil y autenticación
- ✅ Admin dashboard completo con estadísticas reales
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de pedidos con filtros y actualización de estados
- ✅ Código preparado para producción

---

## 📋 Pasos para Desplegar (5 minutos)

### Paso 1: Subir a GitHub

1. **Abre tu terminal** en la carpeta del proyecto:
   ```bash
   cd "/Users/eduardoloyola/Downloads/Pedidos PanIsVite"
   ```

2. **Conecta con tu GitHub** (usa tu email: eduloyola@gmail.com):
   ```bash
   git config user.email "eduloyola@gmail.com"
   git config user.name "Eduardo Loyola"
   ```

3. **Crea un nuevo repositorio en GitHub**:
   - Ve a: https://github.com/new
   - Nombre: `mfel-obrador`
   - Descripción: "Aplicación web para pedidos de panadería"
   - **Importante**: NO inicialices con README, .gitignore ni licencia
   - Haz clic en "Create repository"

4. **Conecta tu repositorio local**:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/mfel-obrador.git
   git branch -M main
   git push -u origin main
   ```

---

### Paso 2: Configurar Turso (Base de Datos en la Nube)

1. **Instala Turso CLI**:
   ```bash
   brew install tursodatabase/tap/turso
   ```

2. **Crea cuenta y base de datos**:
   ```bash
   turso auth signup
   turso db create mfel-obrador
   ```

3. **Obtén las credenciales**:
   ```bash
   turso db show mfel-obrador --url
   turso db tokens create mfel-obrador
   ```

4. **Guarda estos valores** (los necesitarás en Vercel):
   - `TURSO_DATABASE_URL`: La URL que te dio el primer comando
   - `TURSO_AUTH_TOKEN`: El token del segundo comando

---

### Paso 3: Desplegar en Vercel

1. **Ve a Vercel**: https://vercel.com/signup
   - Regístrate con tu cuenta de GitHub

2. **Importa tu proyecto**:
   - Haz clic en "Add New" → "Project"
   - Selecciona el repositorio `mfel-obrador`
   - Haz clic en "Import"

3. **Configura las variables de entorno**:
   En la sección "Environment Variables", añade:

   ```
   DATABASE_URL=TURSO_DATABASE_URL_AQUI
   TURSO_AUTH_TOKEN=TURSO_AUTH_TOKEN_AQUI
   NEXTAUTH_SECRET=genera-un-string-aleatorio-largo-aqui
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-de-google-maps
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=tu-contraseña-de-aplicacion
   SMTP_SECURE=false
   ```

   **Para configurar el Email (Gmail):**
   1. Ve a tu cuenta de Google > Seguridad > Verificación en 2 pasos > Contraseñas de aplicaciones.
   2. Genera una nueva contraseña para "Correo".
   3. Usa esa contraseña en `SMTP_PASS` (no tu contraseña normal).

   **Para obtener la API Key de Google Maps:**
   1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
   2. Crea un proyecto y habilita: **Maps JavaScript API**, **Places API** y **Geocoding API**
   3. Crea credenciales (API Key) y restríngela a tu dominio para seguridad.

   **Para generar NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

4. **Despliega**:
   - Haz clic en "Deploy"
   - Espera 2-3 minutos

5. **Ejecuta las migraciones**:
   Una vez desplegado, ve a tu proyecto en Vercel:
   - Settings → Functions
   - Copia la URL de tu proyecto
   - En tu terminal local:
   ```bash
   # Actualiza DATABASE_URL en .env con la URL de Turso
   npx prisma migrate deploy
   npx tsx src/lib/seed-db.ts
   ```

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`

### Credenciales de Admin:
- **Email**: admin@mfelobrador.com
- **Contraseña**: Admin123!

---

## 📝 Notas Importantes

### Actualizar la Aplicación

Cada vez que hagas cambios:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel desplegará automáticamente los cambios.

### Cambiar el Dominio

En Vercel:
1. Ve a Settings → Domains
2. Añade tu dominio personalizado (ej: `pedidos.mfelobrador.com`)
3. Sigue las instrucciones para configurar el DNS

### Backup de la Base de Datos

```bash
turso db shell mfel-obrador .dump > backup.sql
```

---

## 🆘 Solución de Problemas

### Error: "Database not found"
- Verifica que `DATABASE_URL` en Vercel sea correcta
- Asegúrate de haber ejecutado las migraciones

### Error: "NextAuth configuration"
- Verifica que `NEXTAUTH_URL` sea la URL correcta de tu proyecto
- Asegúrate de que `NEXTAUTH_SECRET` esté configurado

### Las imágenes no se ven
- Las imágenes subidas localmente no se transferirán a Vercel
- Usa el sistema de carga de imágenes del admin para subir nuevas imágenes
- O configura un servicio de almacenamiento como Cloudinary

---

## 📞 Contacto

Si tienes problemas, revisa:
- Logs en Vercel: https://vercel.com/dashboard → tu-proyecto → Deployments
- Logs de Turso: `turso db inspect mfel-obrador`

---

**¡Tu aplicación está lista para recibir pedidos!** 🥖✨
