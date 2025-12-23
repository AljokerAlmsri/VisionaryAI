
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt, aspectRatio = '1:1', apiKey } = await req.json();

    // التحقق من وجود المفتاح في الطلب
    const activeApiKey = apiKey || process.env.API_KEY;

    if (!activeApiKey) {
      return new Response(JSON.stringify({ 
        error: 'API Key is required. Please provide "apiKey" in the request body.' 
      }), { status: 400 });
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    // تهيئة الذكاء الاصطناعي باستخدام المفتاح المستلم
    const ai = new GoogleGenAI({ apiKey: activeApiKey });
    
    // تحسين الوصف لضمان أفضل جودة للصورة
    const enhancementResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform this scene description into a high-quality professional visual prompt in English: "${prompt}"`,
    });
    const enhancedPrompt = enhancementResponse.text?.trim() || prompt;

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

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData) {
      return new Response(JSON.stringify({ error: 'Failed to generate image. Ensure your API key is valid and has access.' }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      imageUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      enhancedPrompt: enhancedPrompt
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
