# OAuth/Netlify Identity - Portfolio de Fotografía

## 🔐 Sistema de Autenticación OAuth

Esta versión utiliza **OAuth/Netlify Identity** para proteger las funciones de Netlify, manteniendo la interfaz de usuario intacta.

### ✅ Archivos Modificados
- `netlify/functions/update-content.js` - Con OAuth y CORS
- `netlify/functions/upload-image.js` - Con OAuth y CORS

### ✅ Archivos PRESERVADOS (Sin cambios)
- `index.html` - Template original intacto
- `admin.html` - Panel de administración intacto
- `script.js` - Funcionalidad JS intacta
- `styles.css` - Estilos intactos

## 🚀 Configuración OAuth/Netlify Identity

### 1. Configurar Netlify Identity

1. **Activar Netlify Identity**:
   - Ve a tu sitio en Netlify Dashboard
   - Settings → Identity → Enable Identity
   - Invite yourself as a user

2. **Configurar Environment Variables**:
   En Netlify Dashboard → Site settings → Environment variables:
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   GITHUB_OWNER=tu-usuario-github
   GITHUB_REPO=fotografia-portfolio
   GITHUB_BRANCH=main
   ```

3. **Obtener Token OAuth**:
   - En tu sitio Netlify → Identity → Settings
   - Genera un personal access token para la API

### 2. Configurar el Admin Panel

Para que el admin.html use OAuth, necesitas agregar el token en las funciones JavaScript:

#### En `script.js` (línea aproximada 2993):
```javascript
// Cambiar de esto:
const token = localStorage.getItem('githubToken');

// A esto:
const token = localStorage.getItem('netlify_token') || localStorage.getItem('githubToken');
```

#### En las funciones AJAX (línea aproximada 3010):
```javascript
// Agregar al headers:
Authorization: 'Bearer ' + token,
```

### 3. Funciones Protegidas

Las siguientes funciones ahora requieren OAuth:
- `update-content.js` - Actualizar data.json
- `upload-image.js` - Subir imágenes

### 4. Headers CORS Incluidos

Cada función incluye:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
```

## 🔧 Debugging

### Errores Comunes

1. **Error 401 - No autorizado**:
   - Verificar que el token OAuth esté configurado
   - Verificar que el usuario esté registrado en Netlify Identity

2. **Error 500 - Variables de entorno**:
   - Verificar que todas las variables estén configuradas en Netlify
   - Verificar que el GitHub token tenga permisos `repo`

3. **CORS Errors**:
   - Las funciones ahora incluyen headers CORS completos
   - Incluyen manejo de preflight OPTIONS

## 📋 Checklist de Deploy

- [ ] Subir código a GitHub
- [ ] Conectar sitio a Netlify
- [ ] Activar Netlify Identity
- [ ] Configurar Environment Variables
- [ ] Configurar usuario en Netlify Identity
- [ ] Probar funciones protegidas
- [ ] Verificar que admin.html funcione

## 🔗 URLs Importantes

- **Panel Admin**: `https://tu-sitio.netlify.app/admin.html`
- **Netlify Identity**: `https://app.netlify.com/sites/tu-sitio/identity`
- **Environment Variables**: `https://app.netlify.com/sites/tu-sitio/settings/env`

## 📞 Soporte

Si encuentras problemas:
1. Verifica los logs de Netlify Functions
2. Revisa la consola del navegador
3. Confirma que las Environment Variables estén correctas