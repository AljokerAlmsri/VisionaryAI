
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, aspectRatio = '1:1', apiKey } = req.body;

    // Use apiKey from request body first, then fallback to environment variable
    const activeApiKey = apiKey || process.env.API_KEY;

    if (!activeApiKey) {
      return res.status(400).json({ 
        error: 'API Key is required. Please provide "apiKey" in the request body.' 
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: activeApiKey });
    
    // 1. Optimize the prompt using Gemini Flash
    const enhancementResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert image prompt engineer. Translate and enhance the following description into a detailed, artistic English prompt for an AI image generator. Output only the enhanced prompt. Description: "${prompt}"`,
    });
    
    const enhancedPrompt = enhancementResponse.text?.trim() || prompt;

    // 2. Generate the image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData) {
      return res.status(500).json({ 
        error: 'The AI model did not return an image. Check your API key permissions and prompt content.',
        details: response.text
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      enhancedPrompt: enhancedPrompt
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: 'An internal error occurred', 
      message: error.message 
    });
  }
}
