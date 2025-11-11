const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
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

  // Configuración
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.error('Variables de entorno no configuradas');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('📷 Iniciando subida de imagen...');
    
    // Parsear FormData
    const formData = new URLSearchParams(event.body);
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No se proporcionó imagen' })
      };
    }

    // Convertir base64 a Buffer
    const imageBuffer = Buffer.from(imageFile, 'base64');
    
    // Generar nombre único para la imagen
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const imageName = `image_${timestamp}_${randomId}.jpg`;
    const imagePath = `images/${imageName}`;

    console.log('📁 Subiendo imagen:', imagePath);

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Verificar si ya existe una imagen con el mismo nombre
    let currentSHA = null;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: imagePath,
        ref: GITHUB_BRANCH
      });
      currentSHA = existingFile.sha;
      console.log('🗑️ Imagen existente encontrada, será reemplazada');
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Subir la imagen a GitHub
    const { data: uploadedFile } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: imagePath,
      message: `Subida de imagen: ${imageName} - ${new Date().toISOString()}`,
      content: imageBuffer.toString('base64'),
      sha: currentSHA,
      branch: GITHUB_BRANCH
    });

    // Generar URL de la imagen
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${imagePath}`;

    console.log('✅ Imagen subida exitosamente:', imageUrl);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        url: imageUrl,
        path: imagePath,
        filename: imageName,
        message: 'Imagen subida exitosamente',
        commit: uploadedFile.commit.sha
      })
    };

  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    
    let statusCode = 500;
    let errorMessage = 'Error interno del servidor';
    
    if (error.status === 401) {
      statusCode = 401;
      errorMessage = 'Error de autenticación con GitHub';
    } else if (error.status === 403) {
      statusCode = 403;
      errorMessage = 'Sin permisos para subir archivos al repositorio';
    } else if (error.status === 413) {
      statusCode = 413;
      errorMessage = 'Archivo demasiado grande (máximo 1MB)';
    }
    
    return {
      statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: errorMessage,
        details: error.message
      })
    };
  }
};