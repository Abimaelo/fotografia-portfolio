# AUTENTICACIÓN DEL PANEL DE ADMINISTRACIÓN

## 🔐 Credenciales por Defecto
- **Usuario**: `admin`
- **Contraseña**: `fotografo2024`

## 🛡️ Seguridad HTTP Basic Auth

Este sistema implementa **HTTP Basic Auth** para proteger el acceso al panel de administración (`admin.html`).

### ¿Qué está protegido?
- ✅ `admin.html` - Panel principal de administración
- ✅ `netlify/functions/*` - Funciones del backend
- ✅ `*.css` y `*.js` del admin (opcional)

### ¿Qué NO está protegido?
- ✅ `index.html` - Sitio web público (sin cambios)
- ✅ `data.json` - Datos del sitio (accesible para el funcionamiento)
- ✅ Imágenes y recursos públicos

## 🔧 Cambio de Credenciales

### Opción 1: Usando comando htpasswd (Recomendado)
```bash
# Instalar apache2-utils si no está disponible
sudo apt-get install apache2-utils

# Crear nuevo usuario
htpasswd -c .htpasswd nuevo_usuario

# Cambiar contraseña de usuario existente
htpasswd -D .htpasswd admin  # Eliminar usuario
htpasswd -c .htpasswd admin  # Crear nuevo con nueva contraseña
```

### Opción 2: Herramientas Online
1. Ve a: https://www.htaccesstools.com/htpasswd-generator/
2. Ingresa tu nuevo usuario y contraseña
3. Copia el hash generado
4. Reemplaza la línea en `.htpasswd`

### Opción 3: Cambiar archivo manualmente
El archivo `.htpasswd` tiene el formato:
```
usuario:$hash_de_la_contraseña
```

## 🚀 Configuración por Hosting

### Netlify
1. Sube todos los archivos a tu repositorio
2. En Netlify Dashboard → Site settings → Build & deploy → Environment variables
3. Agrega:
   - `HTAUTH_USER`: tu_usuario
   - `HTAUTH_PASS`: tu_contraseña

### GitHub Pages
1. GitHub Pages no soporta `.htaccess`
2. Considera usar Netlify o Vercel
3. Alternativa: proteger solo con JavaScript (menos seguro)

### VPS/Servidor Propio
1. Sube todos los archivos
2. Asegúrate de que Apache esté configurado con `AllowOverride All`
3. Verifica que el path en `.htaccess` sea correcto:
   ```apache
   AuthUserFile /full/path/to/your/site/.htpasswd
   ```

## 🔍 Solución de Problemas

### Error 500 - Internal Server Error
- Verifica que el path en `.htaccess` sea correcto
- Asegúrate de que Apache permita `.htaccess` overrides

### Sigue pidiendo autenticación
- Borra la caché del navegador
- Prueba en modo incógnito
- Verifica que el usuario existe en `.htpasswd`

### Funciona en local pero no en producción
- Algunos hostings necesitan configuración adicional
- Contacta al soporte de tu hosting

## 🛠️ Configuración Avanzada

### Timeout de sesión
```apache
# El timeout está configurado a 30 minutos por defecto
# Se puede cambiar modificando la configuración del servidor
```

### Múltiples usuarios
```apache
# Agregar más usuarios al .htpasswd:
admin:$hash1
editor:$hash2
```

### Proteger rutas específicas
```apache
<Files "admin.html">
    Require valid-user
</Files>

<Directory "/admin">
    Require valid-user
</Directory>
```

## 📞 Soporte

Si tienes problemas con la autenticación:

1. **Verifica el hosting**: ¿Soporta .htaccess?
2. **Revisa los logs**: Error 500 indica problemas de configuración
3. **Prueba en local**: Verifica que funciona antes de subir
4. **Contacto hosting**: Pregunta sobre configuración Apache

## 🎯 Mejores Prácticas

- ✅ Cambia las credenciales por defecto
- ✅ Usa contraseñas fuertes (mínimo 8 caracteres)
- ✅ No compartas las credenciales por email
- ✅ Revisa regularmente el acceso al panel
- ✅ Considera SSL/HTTPS para el panel de admin

---

**Nota**: HTTP Basic Auth es seguro para uso interno, pero para mayor seguridad considera implementar JWT o OAuth para aplicaciones más complejas.