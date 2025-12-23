
import React, { useEffect, useState } from 'react';
import { LoadingStatus } from '../types';

interface LoadingOverlayProps {
  status: LoadingStatus;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "جاري تحليل المشهد الخاص بك...",
    "تحسين التفاصيل البصرية...",
    "استدعاء الذكاء الاصطناعي الخالق...",
    "بناء عالمك الرقمي بلمسة احترافية...",
    "تقريباً هناك، اللمسات الأخيرة للمشهد...",
    "تجهيز الألوان والإضاءة السينمائية..."
  ];

  useEffect(() => {
    if (status === LoadingStatus.GENERATING) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status, messages.length]);

  if (status === LoadingStatus.IDLE || status === LoadingStatus.SUCCESS || status === LoadingStatus.ERROR) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-palette text-3xl text-indigo-400 animate-pulse"></i>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-white text-center">
        {status === LoadingStatus.ENHANCING ? "جاري تحسين الوصف..." : "جاري إنشاء الصورة"}
      </h2>
      
      <p className="text-indigo-300 text-lg animate-pulse-slow text-center max-w-md">
        {status === LoadingStatus.ENHANCING ? "نعمل على جعل وصفك أكثر دقة للذكاء الاصطناعي..." : messages[messageIndex]}
      </p>
      
      <div className="mt-12 w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-[loading_15s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
