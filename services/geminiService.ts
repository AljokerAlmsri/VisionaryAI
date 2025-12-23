
import { AspectRatio, GenerationResponse } from '../types';

export const generateImage = async (prompt: string, apiKey: string, aspectRatio: AspectRatio): Promise<GenerationResponse> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        apiKey,
        aspectRatio,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'حدث خطأ أثناء الاتصال بالخادم',
    };
  }
};
