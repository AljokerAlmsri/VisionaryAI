
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
    const { prompt, aspectRatio = '1:1' } = req.body;

    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const activeApiKey = process.env.API_KEY;

    if (!activeApiKey) {
      return res.status(500).json({ 
        error: 'لم يتم تكوين مفتاح الـ API في الخادم. يرجى مراجعة إعدادات البيئة.' 
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'الوصف مطلوب لإتمام العملية' });
    }

    const ai = new GoogleGenAI({ apiKey: activeApiKey });
    
    // 1. Optimize the prompt using Gemini Flash
    let enhancedPrompt = prompt;
    try {
      const enhancementResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional image prompt engineer. Translate this user description to English if needed and enhance it with artistic details, lighting, and composition for a high-quality image generator. Output ONLY the enhanced prompt string. User Description: "${prompt}"`,
      });
      enhancedPrompt = enhancementResponse.text?.trim() || prompt;
    } catch (e) {
      console.error("Enhancement failed, using original prompt");
    }

    // 2. Generate the image using Gemini 2.5 Flash Image
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

    const candidates = response.candidates || [];
    const firstCandidate = candidates[0];
    const parts = firstCandidate?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData) {
      return res.status(500).json({ 
        success: false,
        error: 'فشل الموديل في توليد الصورة. قد يكون الوصف مخالفاً للسياسات أو هناك خلل في الاتصال.',
        details: response.text || 'لا توجد تفاصيل إضافية من الموديل'
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
      success: false,
      error: 'حدث خطأ في الخادم', 
      message: error.message 
    });
  }
}
