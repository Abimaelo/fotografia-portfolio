# Sistema Web con CMS Integrado 🚀

Un sistema completo de sitio web con panel de administración que utiliza **GitHub + Netlify** como base de datos, sin necesidad de servicios externos costosos.

## ✨ Características

- **Panel de Administración Visual**: Editor tipo WordPress pero más simple
- **GitHub como Base de Datos**: Todo el contenido se almacena en `data.json`
- **Netlify Functions**: Intermediario para actualizar contenido
- **Auto-reconstrucción**: Cambios detectados automáticamente
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Sin Base de Datos Externa**: Solo GitHub + Netlify (plan gratuito)

## 📋 Requisitos Previos

1. **Cuenta de GitHub** (gratuita)
2. **Cuenta de Netlify** (gratuita)
3. **Token de GitHub** con permisos de escritura

## 🚀 Instalación y Configuración

### 1. Configurar el Repositorio de GitHub

```bash
# Crear nuevo repositorio en GitHub
# Nombre sugerido: "mi-sitio-web-cms"
# Hacer público o privado (ambos funcionan)
```

### 2. Subir Archivos al Repositorio

```bash
git clone [tu-repo-url]
cd [tu-repo]

# Copiar todos los archivos del proyecto
# Los archivos incluyen:
# - index.html
# - admin.html  
# - styles.css
# - script.js
# - data.json
# - functions/update-content.js
# - netlify.toml
# - package.json

git add .
git commit -m "Initial commit: CMS website setup"
git push origin main
```

### 3. Configurar Token de GitHub

1. Ve a **Settings > Developer settings > Personal access tokens**
2. Clic en **Generate new token (classic)**
3. Selecciona estos scopes:
   - `repo` (acceso completo a repositorios)
   - `workflow` (para GitHub Actions si es necesario)
4. **Copia el token** (solo se muestra una vez)

### 4. Conectar con Netlify

1. **Conectar repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - "New site from Git"
   - Conecta tu repositorio de GitHub

2. **Configurar variables de entorno**:
   - En Netlify Dashboard > Site settings > Environment variables
   - Agregar estas variables:

```
GITHUB_TOKEN: tu_token_de_github
REPO_OWNER: tu_username_de_github
REPO_NAME: nombre_de_tu_repositorio
BRANCH: main
```

### 5. Desplegar

1. **Trigger deploy**: En Netlify, clic en "Trigger deploy"
2. **Verificar**: El sitio se construye automáticamente

## 🎯 Cómo Usar

### Acceso al Panel de Administración

```
https://tu-sitio.netlify.app/admin.html
```

### Funcionalidades del Panel Admin

- **Configuración General**: Título del sitio
- **Hero Section**: Título, subtítulo, botón principal
- **Servicios**: Agregar/editar/eliminar servicios
- **Blog**: Gestionar posts del blog
- **Contacto**: Información de contacto
- **Vista Previa**: Ver cambios en tiempo real

### Flujo de Trabajo

1. **Editar contenido** en `admin.html`
2. **Guardar cambios** → Netlify Function se ejecuta
3. **GitHub API** actualiza `data.json`
4. **Netlify** detecta cambio → Reconstruye sitio
5. **Visitantes** ven contenido actualizado

## 📁 Estructura del Proyecto

```
├── index.html              # Sitio público
├── admin.html             # Panel de administración
├── styles.css             # Estilos CSS
├── script.js              # JavaScript del sitio
├── data.json              # Base de datos JSON
├── functions/
│   └── update-content.js  # Netlify Function
├── netlify.toml           # Configuración de Netlify
├── package.json           # Dependencias
└── README.md              # Este archivo
```

## ⚙️ Configuración Avanzada

### Personalizar Tema

Editar variables CSS en `styles.css`:

```css
:root {
    --primary-color: #2563EB;    /* Color principal */
    --primary-hover: #1D4ED8;    /* Hover del color principal */
    --accent-color: #10B981;     /* Color de acento */
    --text-color: #1E293B;       /* Color del texto */
    /* ... más variables */
}
```

### Agregar Nuevos Campos

1. **En data.json**: Agregar nueva estructura
2. **En script.js**: Función para cargar el campo
3. **En admin.html**: Formulario para editar el campo
4. **En index.html**: Elemento para mostrar el campo

### Configurar Dominio Personalizado

1. En Netlify: **Domain settings**
2. **Add custom domain**
3. Configurar DNS según instrucciones
4. SSL automático incluido

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GITHUB_TOKEN` | Token con permisos de escritura | `ghp_xxxxx` |
| `REPO_OWNER` | Tu username de GitHub | `tu-usuario` |
| `REPO_NAME` | Nombre del repositorio | `mi-sitio-web` |
| `BRANCH` | Rama a actualizar | `main` |

## 🚨 Solución de Problemas

### Error: "Token inválido"
- Verificar que el token tenga permisos `repo`
- Regenerar token si es necesario
- Revisar que la variable esté bien configurada

### Error: "Repositorio no encontrado"
- Verificar `REPO_OWNER` y `REPO_NAME`
- Confirmar que el repositorio sea accesible con el token

### Cambios no se reflejan
- Esperar 1-2 minutos (tiempo de construcción)
- Verificar que el commit se realizó en GitHub
- Revisar logs de Netlify

### Panel admin no carga datos
- Verificar que `data.json` exista en el repositorio
- Comprobar formato JSON válido
- Revisar consola del navegador para errores

## 🔒 Seguridad

- **Token de GitHub**: Almacenar solo en variables de entorno
- **CORS**: Configurado para permitir solo orígenes de Netlify
- **Validación**: Datos validados antes de guardar
- **HTTPS**: Forzado en producción

## 📈 Optimizaciones Incluidas

- **Lazy Loading**: Imágenes cargadas bajo demanda
- **Minificación**: CSS y JS optimizados
- **CDN**: Assets servidos desde CDN de Netlify
- **Compresión**: Gzip habilitado automáticamente
- **Caché**: Headers optimizados para cada tipo de archivo

## 🤝 Contribuciones

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles

## 🆘 Soporte

Para soporte técnico:
1. Revisar documentación
2. Buscar issues existentes
3. Crear nuevo issue con detalles del problema

---

**Desarrollado por MiniMax Agent** | Versión 1.0.0 | 2025