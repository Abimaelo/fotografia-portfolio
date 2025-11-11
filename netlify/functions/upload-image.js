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
    const requestBody = JSON.parse(event.body);
    const { fileName, fileContent, folder, portfolioIndex, field } = requestBody;

    if (!fileName || !fileContent) {
      throw new Error('Nombre de archivo y contenido son requeridos');
    }

    // Determinar ruta del archivo
    let filePath = '';
    if (folder === 'photographer') {
      filePath = `images/photographer/${fileName}`;
    } else if (portfolioIndex !== undefined && field) {
      filePath = `images/portfolio/${fileName}`;
    } else {
      filePath = `images/${fileName}`;
    }

    // Crear nombre único si es necesario
    const timestamp = new Date().getTime();
    const extension = fileName.split('.').pop();
    const baseName = fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
    const uniqueFileName = portfolioIndex !== undefined ? 
      `${baseName}_${timestamp}.${extension}` : 
      fileName;

    // Verificar si el archivo existe
    let existingSHA = null;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: GITHUB_BRANCH
      });
      existingSHA = existingFile.sha;
    } catch (error) {
      // El archivo no existe, es normal
    }

    // Subir la imagen
    const { data: uploadResult } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Subida de imagen OAuth: ${uniqueFileName} - ${new Date().toISOString()}`,
      content: fileContent.replace(/^data:image\/\w+;base64,/, ''),
      sha: existingSHA,
      branch: GITHUB_BRANCH
    });

    // URL de la imagen
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        url: imageUrl,
        fileName: uniqueFileName,
        commit: uploadResult.commit.sha
      })
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Error al subir la imagen',
        details: error.message
      })
    };
  }
};