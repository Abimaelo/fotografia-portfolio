# 🚀 GUÍA RÁPIDA - CONFIGURACIÓN OAUTH

## ⚡ CONFIGURACIÓN EN 15 MINUTOS

### 1. **Habilitar Netlify Identity** (2 min)
```
Dashboard → Identity → Enable Identity
```

### 2. **Configurar GitHub OAuth** (3 min)
```
Identity → External providers → Add provider → GitHub
→ Autorizar repositorio del portfolio
```

### 3. **Habilitar Git Gateway** (2 min)
```
Identity → Services → Enable Git Gateway
→ Configurar permisos de escritura
```

### 4. **Variables de Entorno** (5 min)
```
Site settings → Environment variables → Add:
- GITHUB_TOKEN: tu_token_github
- GITHUB_OWNER: tu_usuario
- GITHUB_REPO: nombre_repo
- GITHUB_BRANCH: main
- NETLIFY_IDENTITY_SECRET: secret
```

### 5. **Probar Funcionamiento** (3 min)
```
Visitar: https://tudominio.com/admin.html
Click: "Login with GitHub"
Autorizar: Netlify + GitHub
Resultado: Panel de admin cargado
```

## 🔑 CREDENCIALES REQUERIDAS

### GitHub Personal Access Token:
- **URL:** https://github.com/settings/tokens
- **Scopes:** `repo` (repositorio completo)
- **Uso:** Para operaciones Git en Netlify Functions

### GitHub OAuth App:
- **Se crea automáticamente** al configurar en Netlify
- **No requiere configuración manual**
- **Permisos:** Lectura/escritura en repositorio

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Netlify Identity habilitado
- [ ] GitHub OAuth configurado
- [ ] Git Gateway habilitado
- [ ] 5 variables de entorno configuradas
- [ ] Functions desplegadas
- [ ] Test de login funcional
- [ ] Test de guardado funcional
- [ ] Test de subida de imágenes funcional

## 🆘 PROBLEMAS COMUNES

### "Widget no carga"
```javascript
// Verificar en console que el script esté disponible
console.log(window.netlifyIdentity);
// Debe retornar: function
```

### "Token inválido"
```bash
# Verificar variable NETLIFY_IDENTITY_SECRET
# Debe estar configurada como "secret"
```

### "Permission denied"
```bash
# Verificar que Git Gateway esté habilitado
# Verificar permisos del token de GitHub
```

## 🔄 FLUJO COMPLETO

1. **Usuario** → admin.html
2. **Netlify Identity** → Botón GitHub
3. **GitHub OAuth** → Autorización
4. **JWT Token** → Generado por Netlify
5. **Netlify Functions** → Token verificado
6. **Git Gateway** → Escribir en GitHub
7. **¡Éxito!** → Panel de admin funcional

---

**🎯 Tiempo total estimado: 15 minutos**

**📖 Documentación completa:** Ver `CONFIG-OAUTH-COMPLETA.md`