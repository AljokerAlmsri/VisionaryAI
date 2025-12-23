
import { GoogleGenAI } from "@google/genai";

// إزالة runtime: 'edge' لحل مشكلة Unsupported modules
// Vercel سيستخدم Node.js runtime تلقائياً وهو الأفضل لمكتبة Google

export default async function handler(req: any, res: any) {
  // التعامل مع طلبات OPTIONS لمتطلبات الـ CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, aspectRatio = '1:1', apiKey } = req.body;

    // الأولوية للمفتاح المرسل في الطلب، ثم متغيرات البيئة
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
    
    // تحسين الوصف لضمان أفضل جودة
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

    const imagePart = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData) {
      return res.status(500).json({ error: 'Failed to generate image. Ensure your API key is valid.' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      success: true,
      imageUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      enhancedPrompt: enhancedPrompt
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
