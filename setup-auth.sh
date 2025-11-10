#!/bin/bash

# Script de Configuración de Autenticación Admin
# Para Portfolio de Fotografía

set -e

echo "🔐 CONFIGURACIÓN DE AUTENTICACIÓN - PANEL ADMIN"
echo "=================================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [[ ! -f "admin.html" ]] || [[ ! -f "index.html" ]]; then
    print_error "No se encontraron los archivos del proyecto en el directorio actual."
    print_error "Asegúrate de ejecutar este script desde la carpeta del proyecto."
    exit 1
fi

print_status "Directorio del proyecto confirmado ✓"
echo ""

# Crear backup de archivos existentes
print_status "Creando backup de archivos existentes..."
if [[ -f ".htaccess" ]]; then
    cp .htaccess .htaccess.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup de .htaccess creado"
fi

if [[ -f ".htpasswd" ]]; then
    cp .htpasswd .htpasswd.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup de .htpasswd creado"
fi

echo ""

# Verificar si htpasswd está disponible
if command -v htpasswd &> /dev/null; then
    HTPASSWD_CMD="htpasswd"
    print_status "htpasswd encontrado ✓"
else
    print_warning "htpasswd no encontrado en el sistema"
    
    # Intentar instalar apache2-utils
    if command -v apt-get &> /dev/null; then
        print_status "Instalando apache2-utils..."
        sudo apt-get update
        sudo apt-get install -y apache2-utils
        HTPASSWD_CMD="htpasswd"
        print_success "apache2-utils instalado ✓"
    elif command -v yum &> /dev/null; then
        print_status "Instalando httpd-tools..."
        sudo yum install -y httpd-tools
        HTPASSWD_CMD="htpasswd"
        print_success "httpd-tools instalado ✓"
    else
        print_error "No se pudo instalar htpasswd automáticamente"
        print_error "Por favor instala apache2-utils o httpd-tools manualmente"
        exit 1
    fi
fi

echo ""

# Obtener credenciales del usuario
print_status "Configuración de credenciales"
echo "==============================="

# Validar entrada de usuario
while true; do
    read -p "Ingresa el nombre de usuario: " username
    if [[ -n "$username" ]] && [[ "$username" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        break
    else
        print_error "Usuario inválido. Solo letras, números, guiones y guiones bajos."
    fi
done

# Entrada de contraseña con confirmación
while true; do
    read -s -p "Ingresa la contraseña: " password
    echo ""
    
    if [[ ${#password} -lt 6 ]]; then
        print_error "La contraseña debe tener al menos 6 caracteres"
        continue
    fi
    
    read -s -p "Confirma la contraseña: " password2
    echo ""
    
    if [[ "$password" == "$password2" ]]; then
        break
    else
        print_error "Las contraseñas no coinciden"
    fi
done

echo ""

# Generar archivo .htpasswd
print_status "Generando archivo de credenciales..."

# Eliminar archivo existente si existe
[[ -f ".htpasswd" ]] && rm .htpasswd

# Crear nuevo archivo con credenciales
$HTPASSWD_CMD -c -b .htpasswd "$username" "$password"

if [[ $? -eq 0 ]]; then
    print_success "Archivo .htpasswd creado exitosamente ✓"
else
    print_error "Error al crear el archivo .htpasswd"
    exit 1
fi

# Mostrar información del usuario creado
echo ""
print_success "Credenciales configuradas:"
echo "   Usuario: $username"
echo "   Contraseña: [CONFIGURADA]"
echo ""

# Verificar configuración
print_status "Verificando configuración..."

if [[ -f ".htaccess" ]]; then
    print_success "Archivo .htaccess encontrado"
else
    print_status "Creando archivo .htaccess..."
    cat > .htaccess << 'EOF'
# Protección del Panel de Administración
# HTTP Basic Auth para admin.html

AuthType Basic
AuthName "Panel de Administración - Fotografía"
AuthUserFile .htpasswd

# Proteger admin.html
<Files "admin.html">
    Require valid-user
    <IfModule mod_headers.c>
        Header set Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </IfModule>
</Files>

# Proteger funciones de Netlify
<Files "netlify/functions/*">
    Require valid-user
</Files>

# Proteger CSS y JS del admin
<FilesMatch "\.(css|js)$">
    <RequireAll>
        Require valid-user
    </RequireAll>
</FilesMatch>

# Denegar acceso directo a archivos de configuración
<Files ".htpasswd">
    Require all denied
</Files>

<Files ".htaccess">
    Require all denied
</Files>

# Opcional: Redirección HTTPS
# <Files "admin.html">
#     RewriteEngine On
#     RewriteCond %{HTTPS} off
#     RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
# </Files>

ErrorDocument 401 "Acceso Denegado. Se requiere autenticación para el panel de administración."
EOF
    print_success "Archivo .htaccess creado ✓"
fi

# Verificar permisos
print_status "Configurando permisos..."

# Hacer que los archivos sean legibles por el servidor web
chmod 644 .htpasswd
chmod 644 .htaccess 2>/dev/null || true

# Mostrar información final
echo ""
print_success "🎉 CONFIGURACIÓN COMPLETADA"
echo "============================="
echo ""
echo "📁 Archivos creados/modificados:"
echo "   - .htpasswd (credenciales encriptadas)"
echo "   - .htaccess (configuración de acceso)"
echo "   - .htaccess.backup.* (backup si existía antes)"
echo "   - .htpasswd.backup.* (backup si existía antes)"
echo ""
echo "🔐 Credenciales de acceso:"
echo "   Usuario: $username"
echo "   Contraseña: [La que configuraste]"
echo ""
echo "🌐 Cómo acceder:"
echo "   1. Sube estos archivos a tu servidor/hosting"
echo "   2. Visita: https://tudominio.com/admin.html"
echo "   3. Ingresa las credenciales en el diálogo"
echo ""
print_warning "IMPORTANTE:"
echo "   - Mantén el archivo .htpasswd seguro"
echo "   - No compartas las credenciales por email"
echo "   - Cambia la contraseña regularmente"
echo "   - Haz backup de estos archivos"
echo ""

# Mostrar comandos útiles
echo "🛠️  Comandos útiles:"
echo "   # Ver usuarios configurados:"
echo "   cat .htpasswd"
echo ""
echo "   # Cambiar contraseña:"
echo "   htpasswd .htpasswd $username"
echo ""
echo "   # Agregar nuevo usuario:"
echo "   htpasswd .htpasswd nuevo_usuario"
echo ""

# Preguntar si quiere probar localmente
read -p "¿Quieres probar la configuración localmente? (s/n): " test_local

if [[ "$test_local" =~ ^[Ss]$ ]]; then
    print_status "Iniciando servidor de prueba..."
    if command -v python3 &> /dev/null; then
        print_status "Ejecuta en otra terminal:"
        echo "   cd $(pwd)"
        echo "   python3 -m http.server 8000"
        echo ""
        print_status "Luego visita: http://localhost:8000/admin.html"
    elif command -v python &> /dev/null; then
        print_status "Ejecuta en otra terminal:"
        echo "   cd $(pwd)"
        echo "   python -m SimpleHTTPServer 8000"
        echo ""
        print_status "Luego visita: http://localhost:8000/admin.html"
    else
        print_warning "No se encontró Python para pruebas locales"
    fi
fi

echo ""
print_success "✅ ¡Configuración finalizada exitosamente!"
print_status "Revisa AUTH-README.md para más información"
echo ""