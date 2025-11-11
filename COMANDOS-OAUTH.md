# Comandos Git - Deploy OAuth

## 1. Navegar al directorio
```bash
cd /workspace/PACKAGE-AUTH-OAUTH-FINAL/
```

## 2. Inicializar repositorio Git
```bash
git init
```

## 3. Agregar archivos
```bash
git add .
```

## 4. Hacer commit
```bash
git commit -m "Deploy OAuth/Netlify Identity - Templates intactos"
```

## 5. Conectar con tu repositorio
```bash
git remote add origin https://github.com/abimaelo/fotografia-portfolio.git
```

## 6. Subir a GitHub
```bash
git branch -M main
git push -u origin main
```

## 7. Configurar Netlify Environment Variables
En Netlify Dashboard:
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=abimaelo
GITHUB_REPO=fotografia-portfolio
GITHUB_BRANCH=main
```

## 8. Activar Netlify Identity
- Dashboard → Settings → Identity → Enable Identity
- Invite yourself as a user

¡Listo para deploy! 🚀