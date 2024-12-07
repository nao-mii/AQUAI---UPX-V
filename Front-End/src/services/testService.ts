import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Atualize para o seu URL correto de API

interface ImageData {
  image_base64: string;
}

export const analyzeImage = async (imageData: ImageData) => {
  try {
    console.log("Dados a serem enviados:", imageData); // Log dos dados a serem enviados

    const response = await axios.post(`${API_URL}/predict`, imageData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Resposta da API:", response.data); // Log da resposta da API

    return response.data;
  } catch (error) {
    console.error('Erro ao analisar imagem:', error); // Log do erro
    throw new Error('Falha na análise da imagem. Tente novamente.');
  }
};
