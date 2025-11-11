# 📚 COMANDOS GIT PARA DEPLOY

## 🚀 Deploy Completo en GitHub

### Preparación Inicial
```bash
# 1. Ir al directorio de tu proyecto
cd /ruta/a/tu/proyecto

# 2. Inicializar git (solo la primera vez)
git init

# 3. Agregar todos los archivos
git add .

# 4. Commit inicial
git commit -m "🎯 Package Final 2025 - Admin panel completo con correcciones"

# 5. Agregar repositorio remoto (reemplazar con tu URL)
git remote add origin https://github.com/TU_USUARIO/fotografia-portfolio.git

# 6. Push al repositorio
git push -u origin main
```

### Comandos de Actualización
```bash
# Para futuras actualizaciones:
git add .
git commit -m "📝 Actualización de contenido"
git push origin main
```

### Verificar Estado
```bash
# Ver archivos modificados
git status

# Ver historial de commits
git log --oneline

# Ver diferencias
git diff
```

## 🔧 Variables de Netlify

Después del push, configura en Netlify:

```bash
# En Netlify Dashboard > Site Settings > Environment Variables
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=tu_usuario_github
GITHUB_REPO=fotografia-portfolio
GITHUB_BRANCH=main
NETLIFY_IDENTITY_SECRET=64_caracteres_hexadecimales_aleatorios
```

## 📋 Checklist Post-Deploy

- [ ] `git push` ejecutado correctamente
- [ ] Variables de entorno configuradas en Netlify
- [ ] Netlify Identity habilitado
- [ ] Git Gateway configurado
- [ ] Admin panel carga: `tu-sitio.netlify.app/admin.html`
- [ ] Login funciona con GitHub
- [ ] **Guardado sin error 401**
- [ ] **Copyright editable**
- [ ] **Imágenes suben correctamente**

## 🆘 Comandos de Recuperación

Si algo sale mal:

```bash
# Ver el último commit
git log -1

# Revertir último commit (¡CUIDADO!)
git reset --soft HEAD~1

# Forzar push (solo en emergencias)
git push -f origin main

# Ver todos los commits
git log --oneline --all
```

## 📁 Estructura Final

Tu repositorio debe verse así:
```
fotografia-portfolio/
├── index.html              ← Template original
├── admin.html              ← Panel admin (NUEVO)
├── styles.css              ← Estilos
├── script.js               ← JavaScript
├── data.json               ← Datos del sitio
├── package.json            ← Dependencias
├── netlify.toml            ← Configuración Netlify
├── images/                 ← Imágenes portfolio
│   └── portfolio/
├── netlify/                ← Funciones serverless
│   └── functions/
│       ├── update-content.js  ← CORREGIDA
│       └── upload-image.js    ← CORREGIDA
├── README-FINAL.md         ← Documentación completa
├── GUIA-RAPIDA.md          ← Setup rápido
└── COMANDOS-GIT.md         ← Este archivo
```

---

**🎯 Con estos comandos tendrás tu sitio deployado y funcionando**