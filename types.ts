
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
}

export enum LoadingStatus {
  IDLE = 'idle',
  ENHANCING = 'enhancing',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error'
}
