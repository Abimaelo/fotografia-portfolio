# Configuraciones Adicionales de Autenticación

## 🌐 CONFIGURACIÓN POR TIPO DE HOSTING

### 1. NETLIFY (Recomendado)
```
# netlify.toml
[build]
  publish = "."

[[headers]]
  for = "/admin.html"
  [headers.values]
    WWW-Authenticate = 'Basic realm="Panel de Administración"'

[[headers]]
  for = "/netlify/functions/*"
  [headers.values]
    WWW-Authenticate = 'Basic realm="Panel de Administración"'
```

### 2. VERCEL
```
# vercel.json
{
  "headers": [
    {
      "source": "/admin.html",
      "headers": [
        {
          "key": "WWW-Authenticate",
          "value": "Basic realm=\"Panel de Administración\""
        }
      ]
    }
  ]
}
```

### 3. APACHE (VPS/Servidor Dedicado)
```
# .htaccess (configuración completa)
AuthType Basic
AuthName "Panel de Administración - Fotografía"
AuthUserFile /full/path/to/your/site/.htpasswd
Require valid-user

# Configurar timeout
<IfModule mod_authn_core.c>
    AuthName "Panel de Administración - Fotografía"
    AuthType Basic
    AuthUserFile .htpasswd
    require valid-user
</IfModule>

# Proteger archivos sensibles
<Files "admin.html">
    Require valid-user
    Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"
</Files>

<Files ".htpasswd">
    Require all denied
</Files>

<Files ".htaccess">
    Require all denied
</Files>
```

### 4. NGINX
```nginx
# Configuración en el archivo de sitio
server {
    location /admin.html {
        auth_basic "Panel de Administración";
        auth_basic_user_file /path/to/.htpasswd;
        add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";
    }
    
    location /netlify/functions/ {
        auth_basic "Panel de Administración";
        auth_basic_user_file /path/to/.htpasswd;
    }
}
```

## 🔐 GENERACIÓN DE CREDENCIALES

### Comando Manual (si tienes acceso SSH):
```bash
# Crear nuevo .htpasswd
htpasswd -c .htpasswd tu_usuario

# Agregar usuario adicional
htpasswd .htpasswd segundo_usuario

# Ver usuarios existentes
cat .htpasswd
```

### Generadores Online:
- https://www.htaccesstools.com/htpasswd-generator/
- https://www.web2generators.com/apache-tools/htaccess-password-generator
- http://www.htpasswdgenerator.com/

### Script PHP (si tienes PHP disponible):
```php
<?php
$user = 'admin';
$pass = 'tu_nueva_contraseña';
echo password_hash($pass, PASSWORD_APR1_1);
echo "\n";
?>
```

## 🛡️ CONFIGURACIÓN DE SEGURIDAD AVANZADA

### Forzar HTTPS para el Admin
```apache
# .htaccess adicional
<Files "admin.html">
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</Files>
```

### Restricción por IP (Opcional)
```apache
# Solo permitir desde IPs específicas
<Files "admin.html">
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
    Require ip TU_IP_PUBLICA
</Files>
```

### Headers de Seguridad
```apache
<Files "admin.html">
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'"
</Files>
```

## 🔍 MONITOREO Y LOGS

### Apache Logs
```bash
# Ver intentos de acceso fallidos
grep "admin.html" /var/log/apache2/access.log | grep "401"

# Ver IPs bloqueadas
awk '$9 == "401" {print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -nr
```

### Configurar Alertas (Opcional)
```bash
# Script para monitorear intentos fallidos
#!/bin/bash
tail -f /var/log/apache2/access.log | grep "401" | while read line; do
    echo "ALERTA: Intento de acceso fallido a admin: $line" >> /var/log/admin_alerts.log
    # Enviar email (opcional)
    # echo "ALERTA: Intento de acceso fallido a admin" | mail -s "Alerta Seguridad Admin" tu@email.com
done
```

## 🚀 DEPLOYMENT AUTOMÁTICO

### Script de Setup
```bash
#!/bin/bash
# setup-auth.sh
echo "Configurando autenticación para el panel de admin..."

# Crear backup de archivos existentes
cp .htaccess .htaccess.backup 2>/dev/null || true
cp .htpasswd .htpasswd.backup 2>/dev/null || true

# Verificar dependencias
if ! command -v htpasswd &> /dev/null; then
    echo "htpasswd no encontrado. Instalando apache2-utils..."
    sudo apt-get update
    sudo apt-get install -y apache2-utils
fi

# Generar nuevas credenciales
read -p "Ingresa el nombre de usuario: " username
read -s -p "Ingresa la contraseña: " password
echo

# Crear .htpasswd
htpasswd -c -b .htpasswd "$username" "$password"

echo "✅ Autenticación configurada exitosamente!"
echo "📋 Usuario: $username"
echo "🔑 Contraseña: [oculta]"
echo "📁 Archivos creados: .htaccess, .htpasswd"
echo ""
echo "⚠️  IMPORTANTE: Cambia la contraseña regularmente y mantén los archivos seguros."
```

## 📋 CHECKLIST DE SEGURIDAD

- [ ] Credenciales por defecto cambiadas
- [ ] Contraseña fuerte (8+ caracteres, números, símbolos)
- [ ] HTTPS configurado para el admin
- [ ] Backup de archivos de configuración
- [ ] Logs de acceso configurados
- [ ] Timeout de sesión configurado
- [ ] Restricción por IP (si es necesario)
- [ ] Headers de seguridad configurados
- [ ] Monitor de intentos fallidos
- [ ] Documentación actualizada

---

**Nota**: Mantén siempre un backup de tus credenciales y archivos de configuración en un lugar seguro.