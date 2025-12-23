
export type AspectRatio = '1:1' | '4:3' | '16:9' | '9:16' | '3:4';

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  enhancedPrompt?: string;
  error?: string;
}
