
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("لم يتم العثور على نتائج في الاستجابة.");
    }

    let base64Image = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!base64Image) {
      throw new Error("فشل استخراج الصورة من الاستجابة.");
    }

    return base64Image;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Optionally enhances a simple prompt into a more descriptive visual prompt
 */
export const enhancePrompt = async (simplePrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `حول هذا المشهد البسيط إلى وصف بصري مفصل واحترافي باللغة الإنجليزية لإنتاج صورة سينمائية مذهلة. المشهد: "${simplePrompt}". 
      أعطني النتيجة باللغة الإنجليزية فقط كفقرة واحدة مركزة.`,
    });
    
    return response.text?.trim() || simplePrompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return simplePrompt; // Fallback to original
  }
};
