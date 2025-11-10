// Netlify Function: upload-image
// Esta función sube imágenes a tu repositorio de GitHub

const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Configuración
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN // Token de GitHub configurado como variable de entorno
  });

  const {
    GITHUB_OWNER = process.env.GITHUB_OWNER, // Tu nombre de usuario de GitHub
    GITHUB_REPO = process.env.GITHUB_REPO,   // Nombre de tu repositorio
    GITHUB_BRANCH = 'main'                   // Rama principal
  } = process.env;

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileName, fileContent, portfolioIndex, field } = JSON.parse(event.body);

    // Validaciones
    if (!fileName || !fileContent) {
      throw new Error('Nombre de archivo y contenido son requeridos');
    }

    // Crear el nombre de archivo con timestamp para evitar conflictos
    const timestamp = new Date().getTime();
    const extension = fileName.split('.').pop();
    const baseName = fileName.split('.')[0];
    const fullFileName = `${baseName}_${timestamp}.${extension}`;
    const folder = 'images/portfolio/';
    const filePath = `${folder}${fullFileName}`;

    // 1. Crear la carpeta si no existe (esto es opcional, GitHub lo maneja automáticamente)

    // 2. Verificar si el archivo ya existe para obtener el SHA
    let sha = null;
    try {
      const { data: existingFile } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: GITHUB_BRANCH
      });
      sha = existingFile.sha;
    } catch (error) {
      // El archivo no existe, es normal para nuevos archivos
      sha = null;
    }

    // 3. Subir la imagen
    const { data: uploadResult } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Subida de imagen: ${fullFileName} - ${new Date().toISOString()}`,
      content: fileContent.replace(/^data:image\/\w+;base64,/, ''), // Remover el prefijo data URL
      sha: sha,
      branch: GITHUB_BRANCH
    });

    // 4. Construir la URL pública de la imagen
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
        fileName: fullFileName,
        commit: uploadResult.commit.sha,
        message: 'Imagen subida exitosamente'
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