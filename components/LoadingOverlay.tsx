
import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="text-center max-w-sm px-6">
        <div className="relative inline-block mb-8">
          <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <i className="fas fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-400"></i>
        </div>
        <h2 className="text-2xl font-bold mb-4 gradient-text">نحن نتخيل مشهدك الآن...</h2>
        <div className="space-y-2 text-gray-400 text-sm">
          <p className="animate-pulse">نقوم بتحويل وصفك إلى لغة فنية معقدة</p>
          <p className="animate-pulse delay-75">نحلل الألوان والزوايا والإضاءة</p>
          <p className="animate-pulse delay-150">موديل Gemini 2.5 Flash يقوم برسم التفاصيل</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
