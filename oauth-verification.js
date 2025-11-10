// Script de Verificación OAuth
// Para validar que toda la configuración funciona correctamente

const verificationResults = {
  netlifyIdentity: false,
  oauthConfig: false,
  functionsAccessible: false,
  tokenGeneration: false,
  githubPermissions: false
};

console.log('🔐 INICIANDO VERIFICACIÓN OAUTH 2.0...\n');

// 1. Verificar Netlify Identity Widget
function checkNetlifyIdentity() {
  console.log('1. Verificando Netlify Identity Widget...');
  
  if (typeof window.netlifyIdentity !== 'undefined') {
    console.log('   ✅ Widget cargado correctamente');
    verificationResults.netlifyIdentity = true;
    return true;
  } else {
    console.log('   ❌ Widget no encontrado');
    console.log('   📝 Solución: Verificar que el script esté incluido en admin.html');
    return false;
  }
}

// 2. Verificar configuración OAuth
function checkOAuthConfig() {
  console.log('\n2. Verificando configuración OAuth...');
  
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', (user) => {
      if (user) {
        console.log('   ✅ Usuario ya autenticado');
        verificationResults.oauthConfig = true;
      } else {
        console.log('   ✅ Configuración correcta (esperando login)');
        verificationResults.oauthConfig = true;
      }
    });
    
    // Trigger init
    window.netlifyIdentity.init();
  }
}

// 3. Verificar Functions accesibles
async function checkFunctions() {
  console.log('\n3. Verificando Netlify Functions...');
  
  try {
    // Intentar hacer request sin token (debe fallar con 401)
    const response = await fetch('/.netlify/functions/update-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    if (response.status === 401) {
      console.log('   ✅ Function protegida correctamente (401 sin token)');
      verificationResults.functionsAccessible = true;
    } else if (response.status === 500) {
      console.log('   ⚠️  Function accesible pero error interno');
      console.log('   📝 Verificar variables de entorno en Netlify');
    } else {
      console.log('   ❌ Respuesta inesperada:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Error accediendo a functions:', error.message);
    console.log('   📝 Verificar que las functions estén desplegadas');
  }
}

// 4. Verificar generación de tokens
function checkTokenGeneration() {
  console.log('\n4. Verificando generación de tokens...');
  
  if (window.netlifyIdentity) {
    const user = window.netlifyIdentity.currentUser();
    
    if (user) {
      user.jwt().then(token => {
        if (token) {
          console.log('   ✅ Token JWT generado correctamente');
          console.log('   📋 Longitud del token:', token.length);
          verificationResults.tokenGeneration = true;
        } else {
          console.log('   ❌ No se pudo generar token');
        }
      }).catch(error => {
        console.log('   ❌ Error generando token:', error.message);
      });
    } else {
      console.log('   ⚠️  No hay usuario autenticado');
      console.log('   📝 Realizar login primero');
    }
  }
}

// 5. Verificar permisos GitHub
function checkGitHubPermissions() {
  console.log('\n5. Verificando permisos GitHub...');
  
  if (window.netlifyIdentity) {
    const user = window.netlifyIdentity.currentUser();
    
    if (user) {
      const hasGitHubProvider = user.app_metadata && 
                               user.app_metadata.providers && 
                               user.app_metadata.providers.includes('github');
      
      if (hasGitHubProvider) {
        console.log('   ✅ GitHub OAuth configurado correctamente');
        verificationResults.githubPermissions = true;
      } else {
        console.log('   ⚠️  GitHub OAuth puede no estar configurado');
        console.log('   📝 Verificar en Netlify Identity → External providers');
      }
    } else {
      console.log('   ⚠️  No hay usuario autenticado');
    }
  }
}

// Función principal de verificación
async function runVerification() {
  console.log('🔍 VERIFICACIÓN COMPLETA DE CONFIGURACIÓN OAUTH\n');
  console.log('=' * 50);
  
  // Verificaciones síncronas
  checkNetlifyIdentity();
  checkOAuthConfig();
  checkGitHubPermissions();
  
  // Verificaciones asíncronas
  setTimeout(checkFunctions, 2000);
  setTimeout(checkTokenGeneration, 3000);
  
  // Reporte final
  setTimeout(() => {
    console.log('\n' + '=' * 50);
    console.log('📊 REPORTE FINAL DE VERIFICACIÓN\n');
    
    const checks = [
      { name: 'Netlify Identity Widget', result: verificationResults.netlifyIdentity },
      { name: 'Configuración OAuth', result: verificationResults.oauthConfig },
      { name: 'Functions Protegidas', result: verificationResults.functionsAccessible },
      { name: 'Generación de Tokens', result: verificationResults.tokenGeneration },
      { name: 'GitHub OAuth', result: verificationResults.githubPermissions }
    ];
    
    let passed = 0;
    let total = checks.length;
    
    checks.forEach((check, index) => {
      const status = check.result ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${check.name}`);
      if (check.result) passed++;
    });
    
    console.log(`\n🎯 Resultado: ${passed}/${total} verificaciones pasadas`);
    
    if (passed === total) {
      console.log('\n🎉 ¡CONFIGURACIÓN OAUTH COMPLETAMENTE FUNCIONAL!');
      console.log('💡 El sistema está listo para producción');
    } else {
      console.log('\n⚠️  CONFIGURACIÓN INCOMPLETA');
      console.log('📚 Revisar la documentación en CONFIG-OAUTH-COMPLETA.md');
    }
    
    console.log('\n🔧 Para re-ejecutar esta verificación:');
    console.log('   runOAuthVerification()');
  }, 5000);
}

// Función para probar login
function testLogin() {
  console.log('\n🚀 INICIANDO PRUEBA DE LOGIN...\n');
  
  if (window.netlifyIdentity) {
    // Abrir modal de login
    window.netlifyIdentity.on('login', (user) => {
      console.log('✅ Login exitoso!');
      console.log('👤 Usuario:', user.email);
      console.log('📅 Creado:', user.created_at);
      console.log('🔐 Providers:', user.app_metadata?.providers || []);
      
      // Verificar que se puede generar token
      user.jwt().then(token => {
        console.log('🎫 Token generado:', token ? '✅' : '❌');
      });
    });
    
    // Abrir modal
    window.netlifyIdentity.on('init', (user) => {
      if (!user) {
        window.netlifyIdentity.open();
      }
    });
    
    // Trigger init
    window.netlifyIdentity.init();
  } else {
    console.log('❌ Netlify Identity no está disponible');
  }
}

// Función para verificar functions con token
async function testAuthenticatedRequest() {
  console.log('\n🧪 PROBANDO REQUEST AUTENTICADO...\n');
  
  if (window.netlifyIdentity) {
    const user = window.netlifyIdentity.currentUser();
    
    if (user) {
      try {
        const token = await user.jwt();
        
        console.log('🎫 Token obtenido, probando functions...');
        
        // Probar update-content function
        const response = await fetch('/.netlify/functions/update-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            test: true, 
            message: 'Test de verificación OAuth' 
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('✅ Request exitoso!');
          console.log('📊 Respuesta:', data);
        } else {
          console.log('❌ Error en request:', data.error);
        }
        
      } catch (error) {
        console.log('❌ Error:', error.message);
      }
    } else {
      console.log('⚠️  No hay usuario autenticado');
      console.log('💡 Realizar login primero');
    }
  } else {
    console.log('❌ Netlify Identity no disponible');
  }
}

// Exportar funciones para uso manual
if (typeof window !== 'undefined') {
  window.runOAuthVerification = runVerification;
  window.testOAuthLogin = testLogin;
  window.testOAuthRequest = testAuthenticatedRequest;
  
  console.log('🔧 Funciones de verificación disponibles:');
  console.log('   - runOAuthVerification()');
  console.log('   - testOAuthLogin()');
  console.log('   - testOAuthRequest()');
  
  // Auto-ejecutar verificación si se carga en admin.html
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runVerification);
  } else {
    setTimeout(runVerification, 1000);
  }
}

// Para Node.js (si se usa en functions)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runVerification,
    testLogin,
    testAuthenticatedRequest
  };
}