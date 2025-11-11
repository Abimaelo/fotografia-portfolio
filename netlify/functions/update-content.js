const { Octokit } = require("@octokit/rest");

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// OAuth Simple Token Validation
function verifyOAuthToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      error: 'Token de autorización requerido'
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  
  // Basic token validation (in production, verify with GitHub API)
  if (!token || !token.startsWith('ghp_')) {
    return {
      valid: false,
      error: 'Token de GitHub inválido'
    };
  }

  return { valid: true, token };
}

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Verify OAuth token
  const authVerification = verifyOAuthToken(event);
  if (!authVerification.valid) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'No autorizado',
        message: authVerification.error
      })
    };
  }

  // Configuración
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas' })
    };
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const siteData = JSON.parse(event.body);

    // 1. Obtener el archivo actual para obtener el SHA
    let currentSHA = null;
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: 'data.json',
        ref: GITHUB_BRANCH
      });
      currentSHA = currentFile.sha;
    } catch (error) {
      // Si el archivo no existe, we'll create it
      console.log('Archivo data.json no existe, será creado');
    }

    // 2. Actualizar o crear el archivo
    const { data: updatedFile } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'data.json',
      message: `Actualización desde panel admin OAuth - ${new Date().toISOString()}`,
      content: Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64'),
      sha: currentSHA,
      branch: GITHUB_BRANCH
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        message: 'Contenido actualizado exitosamente',
        commit: updatedFile.commit.sha
      })
    };

  } catch (error) {
    console.error('Error updating content:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Error al actualizar el contenido',
        details: error.message
      })
    };
  }
};