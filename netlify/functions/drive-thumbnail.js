const axios = require('axios');

exports.handler = async (event, context) => {
  const fileId = event.queryStringParameters.id;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!fileId) {
    return { statusCode: 400, body: 'Missing file ID' };
  }

  try {
    // Busca o link da thumbnail via Google Drive API v3
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${apiKey}`
    );

    const thumbnailLink = response.data.thumbnailLink;

    if (!thumbnailLink) {
      return { statusCode: 404, body: 'Thumbnail not found' };
    }

    // Proxy da imagem para evitar CORS e ocultar a Key
    const imageResponse = await axios.get(thumbnailLink, { responseType: 'arraybuffer' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      },
      body: Buffer.from(imageResponse.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Drive Thumbnail Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
