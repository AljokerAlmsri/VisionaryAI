
import React, { useState } from 'react';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `
// مثال لإرسال طلب توليد صورة بمفتاحك الخاص
const generate = async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: "رائد فضاء في الغابة",
      apiKey: "YOUR_GEMINI_API_KEY", // مفتاحك هنا
      aspectRatio: '16:9' 
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log("Image URL:", data.imageUrl);
  }
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-8 rounded-3xl border-white/10 mt-20 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <i className="fas fa-code text-indigo-400"></i>
          استخدام الـ API للمطورين
        </h3>
        <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-1 rounded-full border border-indigo-500/20 uppercase font-black">SDK v1.0</span>
      </div>

      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>يمكنك دمج محرك الصور الخاص بنا في تطبيقاتك الخاصة عبر إرسال الطلبات مباشرة إلى هذا الـ Endpoint:</p>
        
        <div className="bg-black/50 rounded-xl p-4 font-mono text-xs border border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Endpoint:</span>
            <code className="text-indigo-300">/api/generate</code>
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
          <pre className="bg-slate-950/80 p-5 rounded-2xl overflow-x-auto border border-white/5 text-xs text-indigo-100 font-mono" dir="ltr">
            {codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
