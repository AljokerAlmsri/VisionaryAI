
import React, { useState } from 'react';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `
// إرسال طلب مع مفتاح الـ API الخاص بك
const generateImage = async (userPrompt, userApiKey) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: userPrompt,
      apiKey: userApiKey, // أرسل المفتاح هنا مباشرة
      aspectRatio: '16:9' 
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log("Image URL:", data.imageUrl);
  } else {
    console.error("Error:", data.error);
  }
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-8 rounded-3xl border-white/10 mt-12 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <i className="fas fa-key text-indigo-400"></i>
          استخدام الـ API بمفتاحك الخاص
        </h3>
        <span className="bg-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/20">تحديث: دعم المفاتيح الخارجية</span>
      </div>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          لقد قمنا بتحديث الـ API ليدعم استقبال <strong>apiKey</strong> مباشرة في جسم الطلب (Request Body). 
          هذا يتيح لك بناء تطبيقاتك الخاصة دون الحاجة لتخزين المفتاح في خوادم Vercel.
        </p>
        
        <div className="bg-slate-900/80 rounded-xl p-4 font-mono text-sm border border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Endpoint:</span>
            <code className="text-indigo-300">POST /api/generate</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Method:</span>
            <code className="text-green-400">POST</code>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute right-4 top-4 z-10">
            <button 
              onClick={handleCopy}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white p-2 rounded-lg transition-all"
            >
              <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
            </button>
          </div>
          <pre className="bg-slate-950 p-6 rounded-2xl overflow-x-auto border border-white/5 text-sm leading-relaxed text-indigo-100 font-mono">
            {codeSnippet}
          </pre>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-4">
          <i className="fas fa-shield-halved text-amber-500 mt-1"></i>
          <div>
            <h4 className="text-amber-500 font-bold text-sm mb-1">نصيحة أمنية</h4>
            <p className="text-xs text-gray-400 leading-normal">
              إذا كنت ستستخدم الـ API في تطبيق "Front-end" عام، يرجى الحذر من تسريب مفتاح الـ API الخاص بك. 
              يُفضل دائماً استدعاء هذا الـ API من خادم خلفي (Back-end) خاص بك لحماية مفاتيحك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
