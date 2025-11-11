const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Configuración
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  // Headers CORS para permitir solicitudes desde el admin panel
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.error('Variables de entorno no configuradas:', {
      GITHUB_TOKEN: !!GITHUB_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO
    });
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas' })
    };
  }

  console.log('🔧 Iniciando actualización de contenido...');

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parsear el body de la solicitud
    let siteData;
    try {
      const body = JSON.parse(event.body);
      siteData = body.siteData || body; // Manejar ambos formatos
    } catch (error) {
      console.error('Error parsing body:', error);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Formato de datos inválido' })
      };
    }

    console.log('📋 Datos recibidos:', Object.keys(siteData));

    // 1. Obtener el archivo actual para obtener el SHA
    let currentSHA = null;
    try {
      console.log('📊 Obteniendo archivo actual de GitHub...');
      const { data: currentFile } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: 'data.json',
        ref: GITHUB_BRANCH
      });
      currentSHA = currentFile.sha;
      console.log('✅ SHA actual obtenido:', currentSHA.substring(0, 10));
    } catch (error) {
      if (error.status === 404) {
        console.log('📄 Archivo data.json no existe, será creado');
      } else {
        console.error('❌ Error obteniendo archivo:', error);
        throw error;
      }
    }

    // 2. Actualizar o crear el archivo
    console.log('🔄 Actualizando data.json en GitHub...');
    const { data: updatedFile } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'data.json',
      message: `Actualización desde panel admin - ${new Date().toISOString()}`,
      content: Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64'),
      sha: currentSHA,
      branch: GITHUB_BRANCH
    });

    console.log('✅ Archivo actualizado exitosamente:', updatedFile.commit.sha);

    // 3. Respuesta de éxito
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Contenido actualizado exitosamente en GitHub',
        commit: updatedFile.commit.sha,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error detallado actualizando contenido:', {
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    
    // Determinar código de estado apropiado
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';
    
    if (error.status === 401) {
      statusCode = 401;
      errorMessage = 'Error de autenticación con GitHub';
    } else if (error.status === 403) {
      statusCode = 403;
      errorMessage = 'Sin permisos para modificar el repositorio';
    } else if (error.status === 404) {
      statusCode = 404;
      errorMessage = 'Repositorio o archivo no encontrado';
    } else if (error.status === 422) {
      statusCode = 422;
      errorMessage = 'Datos inválidos para actualizar';
    }
    
    return {
      statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};