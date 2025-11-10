# 🔐 CONFIGURACIÓN COMPLETA - OAUTH 2.0

## 📋 RESUMEN

Tu portfolio fotográfico ahora usa **Netlify Identity + GitHub OAuth + Git Gateway** para autenticación segura de nivel enterprise.

## 🏗️ ARQUITECTURA IMPLEMENTADA

### Flujo de Autenticación:
1. **Usuario accede** a `admin.html`
2. **Widget Netlify Identity** se carga automáticamente
3. **Click "Login with GitHub"** → Redirección a GitHub
4. **GitHub OAuth** → Autorización de permisos
5. **GitHub devuelve** token de autorización
6. **Netlify Identity** convierte a JWT
7. **JWT incluido** en todas las requests a Netlify Functions
8. **Git Gateway** permite escritura en repositorio GitHub

### ¿Qué está protegido?
- ✅ `admin.html` - Panel de administración completo
- ✅ `netlify/functions/*` - Todas las funciones del backend
- ✅ Subida de imágenes - Solo usuarios autenticados
- ✅ Guardado de datos - Solo usuarios autenticados

### ¿Qué NO está protegido?
- ✅ `index.html` - Sitio web público (sin cambios)
- ✅ `data.json` - Datos públicos del sitio
- ✅ Portfolio y galerías - Acceso público normal

## 🚀 CONFIGURACIÓN EN NETLIFY

### Paso 1: Habilitar Netlify Identity

1. **Ve a tu sitio en Netlify Dashboard**
2. **Navega a "Identity"** (en el sidebar)
3. **Click "Enable Identity"**
4. **⚠️ IGNORA la advertencia de "Deprecated"** - no se aplica a nuestro caso de uso

### Paso 2: Configurar GitHub como External Provider

1. **En la página de Identity, scroll hacia abajo**
2. **Encuentra "External providers"**
3. **Click "Add provider"**
4. **Selecciona "GitHub"**
5. **Autoriza a Netlify** con tu cuenta de GitHub
6. **Selecciona los repositorios** que pueden acceder (recomendado: solo el repositorio del portfolio)

### Paso 3: Habilitar Git Gateway (CRÍTICO)

1. **En la misma página de Identity**
2. **Scroll hasta "Services"**
3. **Find "Git Gateway"**
4. **Click "Enable Git Gateway"**
5. **Configura permisos:**
   - ✅ Repository contents: Read and Write
   - ✅ Repository metadata: Read
   - ✅ Issues: Create
   - ✅ Pull Requests: Create

### Paso 4: Configurar Variables de Entorno

1. **Ve a "Site settings" → "Environment variables"**
2. **Agrega las siguientes variables:**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GITHUB_TOKEN` | Tu token de GitHub | Para operaciones Git |
| `GITHUB_OWNER` | Tu usuario GitHub | Propietario del repo |
| `GITHUB_REPO` | Nombre del repositorio | Repositorio del portfolio |
| `GITHUB_BRANCH` | `main` (o tu branch) | Branch principal |
| `NETLIFY_IDENTITY_SECRET` | `secret` | Secret para JWT |

## 🔑 CONFIGURACIÓN DE GITHUB

### Crear Personal Access Token:

1. **Ve a GitHub → Settings → Developer settings → Personal access tokens**
2. **Click "Generate new token (classic)"**
3. **Configura permisos:**
   - ✅ `repo` (repositorio completo)
   - ✅ `workflow` (si usas GitHub Actions)
   - ✅ `write:packages` (para packages)
4. **Copia el token** y úsalo en `GITHUB_TOKEN`

### Configurar Repository Settings:

1. **Ve a tu repositorio en GitHub**
2. **Settings → Manage access** (o Collaborators)
3. **Agrega tu app de Netlify Identity** con permisos de escritura
4. **En Branch protection rules:** (opcional pero recomendado)
   - Require pull request reviews
   - Dismiss stale PR approvals when new commits are pushed

## 🔧 CONFIGURACIÓN DE FUNCIONES NETLIFY

### Verificar Functions Deploy:

1. **En Netlify Dashboard → "Functions"**
2. **Verifica que ambas funciones estén desplegadas:**
   - `update-content.js`
   - `upload-image.js`
3. **Si no aparecen, redeploy manualmente**

### Probar Functions:

1. **Ve a "Functions" → Click en una function**
2. **Click "Test function"**
3. **Envía un request POST con datos de prueba**
4. **Verifica que responda correctamente**

## 🛡️ CONFIGURACIÓN DE SEGURIDAD

### Configurar Redirect URLs:

1. **En Netlify Identity → Settings**
2. **Agregar redirect URLs:**
   ```
   https://tudominio.com/admin.html
   https://tudominio.netlify.app/admin.html
   ```

### Configurar Email Templates (Opcional):

1. **En Netlify Identity → Settings → Email templates**
2. **Personalizar emails de invitación**
3. **Configurar dominio de email si es necesario**

### Configurar Roles (Avanzado):

Si quieres múltiples administradores:

1. **En Netlify Identity → Users**
2. **Click en un usuario**
3. **App metadata → Agregar:**
   ```json
   {
     "roles": ["admin", "cms_admin"]
   }
   ```

## 🧪 TESTING Y VERIFICACIÓN

### Test 1: Verificar Login Flow

1. **Visita:** `https://tudominio.com/admin.html`
2. **Deberías ver:** Pantalla de login con botón "Login with GitHub"
3. **Click:** Botón de GitHub
4. **Redirección:** A GitHub para autorización
5. **Autoriza:** A Netlify para acceder al repositorio
6. **Resultado:** Panel de admin cargado

### Test 2: Verificar Guardado de Datos

1. **Haz cambios** en el panel de admin
2. **Click "Guardar Cambios"**
3. **Verificar:** Mensaje de éxito
4. **Verificar en GitHub:** Nuevo commit en el repositorio
5. **Verificar en sitio:** Cambios reflejados

### Test 3: Verificar Subida de Imágenes

1. **Ve a Portfolio → Agregar proyecto**
2. **Sube una imagen** usando el botón de upload
3. **Verificar:** Imagen aparece en preview
4. **Verificar en GitHub:** Archivo subido a `/images/portfolio/`
5. **Verificar URL:** Imagen accesible públicamente

### Test 4: Verificar Autorización JWT

1. **Abre DevTools → Network**
2. **Guarda cambios** o sube imagen
3. **Verificar headers:** Request incluye `Authorization: Bearer <token>`
4. **Verificar response:** 200 OK con datos de éxito

## 🔍 SOLUCIÓN DE PROBLEMAS

### Error: "Netlify Identity widget not loaded"

**Causa:** Script no se cargó correctamente
**Solución:**
- Verificar conexión a internet
- Verificar que el script esté en el HTML
- Recargar la página

### Error: "Token de autorización requerido" (401)

**Causa:** JWT no se está enviando
**Solución:**
- Verificar que el usuario esté logueado
- Verificar que las Netlify Functions estén desplegadas
- Verificar que `NETLIFY_IDENTITY_SECRET` esté configurado

### Error: "Variables de entorno no configuradas"

**Causa:** Variables de entorno faltantes
**Solución:**
- Verificar todas las variables en Netlify Settings
- Redeploy después de agregar variables
- Verificar que los nombres sean exactos

### Error: "Permission denied" al guardar

**Causa:** Git Gateway no configurado correctamente
**Solución:**
- Verificar que Git Gateway esté habilitado
- Verificar permisos del token de GitHub
- Verificar que el repositorio esté seleccionado

### Error: "Redirect URI mismatch"

**Causa:** URLs de redirect no configuradas
**Solución:**
- Agregar URLs de redirect en Netlify Identity Settings
- Usar URLs exactas del dominio

### Error: CORS en las funciones

**Causa:** Headers CORS faltantes
**Solución:** Las funciones ya incluyen headers CORS correctos

## 📊 MONITOREO Y LOGS

### Ver Logs de Netlify:

1. **Netlify Dashboard → "Functions" → "Logs"**
2. **Ver logs de ejecución** de las funciones
3. **Identificar errores** y problemas de rendimiento

### Verificar GitHub Activity:

1. **Repositorio GitHub → "Insights" → "Activity"**
2. **Ver commits** del panel de admin
3. **Identificar patrones** de uso

### Configurar Webhooks (Opcional):

1. **GitHub → Settings → Webhooks**
2. **Agregar webhook** para notificaciones de cambios
3. **Configurar endpoint** para recibir notificaciones

## 🎯 PRÓXIMOS PASOS

1. **✅ Configurar Netlify Identity**
2. **✅ Habilitar GitHub OAuth**
3. **✅ Configurar Git Gateway**
4. **✅ Configurar variables de entorno**
5. **✅ Probar flujo completo**
6. **✅ Configurar monitoreo (opcional)**

## 📚 DOCUMENTACIÓN ADICIONAL

- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Git Gateway Documentation](https://docs.netlify.com/visitor-access/git-gateway/)
- [JWT Verification](https://jwt.io/)

---

**🎉 ¡Tu sistema de autenticación OAuth 2.0 está completamente configurado!**

Para soporte adicional, revisa los logs de Netlify y GitHub para identificar problemas específicos.