const { Octokit } = require("@octokit/rest");
const jwt = require("jsonwebtoken");

exports.handler = async (event, context) => {
  // Configuración
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
  const NETLIFY_IDENTITY_SECRET = process.env.NETLIFY_IDENTITY_SECRET;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas' })
    };
  }

  // === OAUTH 2.0 VERIFICATION ===
  if (!NETLIFY_IDENTITY_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'NETLIFY_IDENTITY_SECRET no configurado' })
    };
  }

  // Verify JWT token
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Token de autorización requerido' })
    };
  }

  const token = authHeader.split(' ')[1];
  let user;

  try {
    // Verify the JWT token
    user = jwt.verify(token, NETLIFY_IDENTITY_SECRET);
    console.log('Token verificado para usuario:', user.email);
  } catch (error) {
    console.error('Error verificando token:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ 
        error: 'Token de autorización inválido o expirado',
        details: error.message
      })
    };
  }

  // Check if user has admin privileges (if implemented)
  if (user.app_metadata && user.app_metadata.roles) {
    const hasAdminRole = user.app_metadata.roles.includes('admin') || 
                        user.app_metadata.roles.includes('cms_admin');
    
    if (!hasAdminRole) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Permisos insuficientes. Se requiere rol de administrador.' })
      };
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestData = JSON.parse(event.body);
    const { fileName, fileContent, portfolioIndex, field } = requestData;

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nombre de archivo y contenido son requeridos' })
      };
    }

    // Validar tipo de archivo
    if (!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)' })
      };
    }

    // Crear nombre único y ruta
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop().toLowerCase();
    const baseName = fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
    const uniqueFileName = `${baseName}_${timestamp}_${randomId}.${extension}`;
    
    // Determinar la carpeta según el tipo de imagen
    let filePath;
    if (portfolioIndex !== undefined) {
      filePath = `images/portfolio/${uniqueFileName}`;
    } else {
      filePath = `images/uploads/${uniqueFileName}`;
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

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
      console.log('Archivo existente encontrado, será sobrescrito');
    } catch (error) {
      // El archivo no existe, es normal
      console.log('Subiendo nuevo archivo');
    }

    // Limpiar el contenido base64
    let cleanContent = fileContent;
    if (fileContent.startsWith('data:image/')) {
      cleanContent = fileContent.replace(/^data:image\/\w+;base64,/, '');
    }

    // Subir la imagen
    const commitMessage = `Subida de imagen: ${uniqueFileName} por ${user.user_metadata?.full_name || user.email}`;
    
    const { data: uploadResult } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: commitMessage,
      content: cleanContent,
      sha: existingSHA,
      branch: GITHUB_BRANCH
    });

    console.log('Imagen subida exitosamente:', uniqueFileName);

    // URL de la imagen
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        url: imageUrl,
        fileName: uniqueFileName,
        filePath: filePath,
        commit: uploadResult.commit.sha,
        uploadedBy: user.email,
        timestamp: new Date().toISOString(),
        size: cleanContent.length
      })
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Error al subir la imagen',
        details: error.message,
        user: user?.email || 'Unknown'
      })
    };
  }
};