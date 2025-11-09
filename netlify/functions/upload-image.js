const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Configuración
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Variables de entorno no configuradas' })
    };
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      throw new Error('Nombre de archivo y contenido son requeridos');
    }

    // Crear nombre único
    const timestamp = new Date().getTime();
    const extension = fileName.split('.').pop();
    const baseName = fileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
    const uniqueFileName = `${baseName}_${timestamp}.${extension}`;
    const filePath = `images/portfolio/${uniqueFileName}`;

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
      message: `Subida de imagen: ${uniqueFileName} - ${new Date().toISOString()}`,
      content: fileContent.replace(/^data:image\/\w+;base64,/, ''),
      sha: existingSHA,
      branch: GITHUB_BRANCH
    });

    // URL de la imagen
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error al subir la imagen',
        details: error.message
      })
    };
  }
};