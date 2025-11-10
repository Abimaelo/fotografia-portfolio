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
    const siteData = JSON.parse(event.body);

    // Validate that we have data
    if (!siteData || typeof siteData !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Datos inválidos' })
      };
    }

    // Add metadata about the change
    siteData._lastUpdated = {
      timestamp: new Date().toISOString(),
      user: user.email,
      user_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown',
      commit_message: `Actualización desde panel admin por ${user.email}`
    };

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

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
      console.log('Archivo data.json encontrado, SHA:', currentSHA);
    } catch (error) {
      // Si el archivo no existe, we'll create it
      console.log('Archivo data.json no existe, será creado');
    }

    // 2. Actualizar o crear el archivo
    const commitMessage = `Actualización CMS por ${user.user_metadata?.full_name || user.email} - ${new Date().toLocaleString('es-ES')}`;
    
    const { data: updatedFile } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'data.json',
      message: commitMessage,
      content: Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64'),
      sha: currentSHA,
      branch: GITHUB_BRANCH
    });

    console.log('Archivo actualizado exitosamente:', updatedFile.commit.sha);

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
        message: 'Contenido actualizado exitosamente',
        commit: updatedFile.commit.sha,
        user: user.email,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error updating content:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Error al actualizar el contenido',
        details: error.message,
        user: user?.email || 'Unknown'
      })
    };
  }
};