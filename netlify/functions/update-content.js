// Netlify Function: update-content
// Esta función actualiza el archivo data.json en tu repositorio de GitHub

const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Configuración - IMPORTANTE: Estas variables deben configurarse en Netlify
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
    const siteData = JSON.parse(event.body);

    // 1. Obtener el archivo actual para obtener el SHA
    const { data: currentFile } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'data.json',
      ref: GITHUB_BRANCH
    });

    // 2. Actualizar el archivo con el nuevo contenido
    const { data: updatedFile } = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'data.json',
      message: `Actualización de contenido desde panel de admin - ${new Date().toISOString()}`,
      content: Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64'),
      sha: currentFile.sha,
      branch: GITHUB_BRANCH
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error al actualizar el contenido',
        details: error.message
      })
    };
  }
};