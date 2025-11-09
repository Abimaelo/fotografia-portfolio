# 🚀 GUÍA COMPLETA: Subir Portfolio a GitHub y Netlify

## 📋 PASO 1: Crear Repositorio en GitHub

1. **Ve a GitHub**: https://github.com
2. **Clic en "New repository"** (botón verde)
3. **Configura el repositorio**:
   - **Repository name**: `fotografia-portfolio`
   - **Description**: `Portfolio profesional de fotografía con panel de administración`
   - **Public** ✅ (necesario para URLs públicas de imágenes)
   - **NO marques** "Add a README file" (ya tenemos archivos)
4. **Clic en "Create repository"**

## 📁 PASO 2: Estructura de Archivos a Subir

```
fotografia-portfolio/
├── index.html                    ← Página principal
├── admin.html                    ← Panel de administración
├── styles.css                    ← Estilos monocromáticos
├── script.js                     ← Funcionalidad principal
├── data.json                     ← Datos del sitio
├── netlify.toml                  ← Configuración de Netlify
├── package.json                  ← Dependencias de funciones
├── netlify/functions/            ← Funciones backend
│   ├── update-content.js         ← Guardar contenido
│   └── upload-image.js           ← Subir imágenes
├── images/                       ← Carpeta para imágenes
│   └── portfolio/                ← Imágenes del portfolio
└── README.md                     ← Documentación
```

## 💻 PASO 3: Comandos Git para Subir

Una vez que tengas la carpeta con todos los archivos, ejecuta estos comandos:

```bash
# 1. Navegar a la carpeta del proyecto
cd fotografia-portfolio

# 2. Inicializar git
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer el primer commit
git commit -m "Portfolio de fotografía con panel de administración completo"

# 5. Conectar con tu repositorio de GitHub
git remote add origin https://github.com/abimaelo/fotografia-portfolio.git

# 6. Subir a la rama main
git branch -M main
git push -u origin main
```

## 🔧 PASO 4: Configurar Netlify

### 4.1. Deploy en Netlify
1. **Ve a**: https://netlify.com
2. **Clic en "New site from Git"**
3. **Conecta GitHub**
4. **Selecciona tu repositorio** `fotografia-portfolio`
5. **Configurar deploy**:
   - **Branch to deploy**: `main`
   - **Build command**: (dejar vacío)
   - **Publish directory**: (dejar en `/`)
6. **Deploy site**

### 4.2. Configurar Variables de Entorno
En Netlify Dashboard → Site Settings → Environment Variables, agrega:

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=abimaelo
GITHUB_REPO=fotografia-portfolio
GITHUB_BRANCH=main
```

## 🔑 PASO 5: Crear GitHub Token

1. **Ve a GitHub Settings**:
   - https://github.com/settings/tokens
2. **Clic en "Generate new token"**
3. **Configurar el token**:
   - **Note**: `Netlify Portfolio Admin`
   - **Expiration**: Según prefieras
   - **Scope**: ☑️ `repo` (acceso completo a repositorios)
4. **Clic en "Generate token"**
5. **COPIA EL TOKEN** (solo se muestra una vez)
6. **Pégalo en Netlify** como GITHUB_TOKEN

## ✅ PASO 6: Verificar que Todo Funciona

1. **Abre tu sitio**: La URL que te dio Netlify
2. **Prueba el panel admin**: Agrega `/admin.html` a la URL
3. **Haz cambios** y guarda
4. **Verifica** que se actualiza en GitHub

## 🎯 Archivos que Vas a Recibir

Te voy a enviar todos estos archivos listos para subir:

- ✅ **index.html** - Página principal con diseño monocromático
- ✅ **admin.html** - Panel de administración completo
- ✅ **styles.css** - Estilos elegantes monocromáticos (1111 líneas)
- ✅ **script.js** - JavaScript con todas las funcionalidades
- ✅ **data.json** - Datos iniciales del sitio
- ✅ **netlify.toml** - Configuración completa
- ✅ **package.json** - Dependencias para funciones
- ✅ **netlify/functions/** - Las dos funciones backend
- ✅ **README.md** - Documentación

## 📞 ¿Algún Problema?

Si tienes algún problema durante el proceso:
1. **GitHub no acepta el repo**: Verifica que el nombre sea único
2. **Error en Netlify**: Verifica que las variables de entorno estén bien
3. **Admin no funciona**: Verifica que el GitHub Token tenga permisos de `repo`

## 🎉 Resultado Final

Cuando termines tendrás:
- ✅ **Sitio web profesional** con diseño monocromático elegante
- ✅ **Panel de administración 100% funcional**
- ✅ **Sistema de gestión de contenido** completo
- ✅ **Imágenes que se suben automáticamente**
- ✅ **URLs públicas** para todas las imágenes
- ✅ **Sistema de producción** profesional

**¿Listo para recibir todos los archivos y seguir esta guía?**