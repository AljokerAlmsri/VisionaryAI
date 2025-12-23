
import React, { useState } from 'react';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'js' | 'n8n'>('js');

  const codeSnippet = `
// مثال لإرسال طلب توليد صورة بمفتاحك الخاص
const generate = async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: "رائد فضاء في الغابة",
      apiKey: "YOUR_GEMINI_API_KEY", 
      aspectRatio: '16:9' 
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log("Image URL:", data.imageUrl);
  }
};`;

  const n8nConfig = {
    method: 'POST',
    url: `${window.location.origin}/api/generate`,
    body: `{
  "prompt": "وصف الصورة هنا",
  "apiKey": "YOUR_GEMINI_API_KEY",
  "aspectRatio": "1:1"
}`
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-8 rounded-3xl border-white/10 mt-20 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <i className="fas fa-plug text-indigo-400"></i>
          ربط الخدمة (API & Automation)
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'js' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'}`}
          >
            JavaScript
          </button>
          <button 
            onClick={() => setActiveTab('n8n')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === 'n8n' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}
          >
            n8n
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'js' ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <p className="text-gray-400 text-sm">استخدم الكود التالي لدمج المحرك في موقعك أو تطبيقك:</p>
            <div className="relative group">
              <button 
                onClick={() => handleCopy(codeSnippet)}
                className="absolute right-4 top-4 z-10 bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10"
              >
                <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
              </button>
              <pre className="bg-slate-950/80 p-5 rounded-2xl overflow-x-auto border border-white/5 text-xs text-indigo-100 font-mono" dir="ltr">
                {codeSnippet}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <p className="text-gray-400 text-sm">لإعداد عقدة **HTTP Request** في n8n، استخدم الإعدادات التالية:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Method</span>
                <div className="text-green-400 font-mono font-bold">POST</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Authentication</span>
                <div className="text-gray-300 font-mono">None (Inside Body)</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase text-gray-500 font-bold">URL</span>
                  <button onClick={() => handleCopy(n8nConfig.url)} className="text-[10px] text-indigo-400 hover:underline">نسخ الرابط</button>
                </div>
                <div className="text-indigo-300 font-mono text-xs break-all truncate">{n8nConfig.url}</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase text-gray-500 font-bold px-1">Body Parameter (JSON)</span>
              <div className="relative">
                <button 
                  onClick={() => handleCopy(n8nConfig.body)}
                  className="absolute right-4 top-4 z-10 bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10"
                >
                  <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                </button>
                <pre className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 text-xs text-orange-200 font-mono" dir="ltr">
                  {n8nConfig.body}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 items-start">
              <i className="fas fa-info-circle text-blue-400 mt-1"></i>
              <p className="text-xs text-blue-300 leading-relaxed">
                ستقوم العقدة بإرجاع JSON يحتوي على رابط الصورة بصيغة Base64 في حقل `imageUrl`. يمكنك استخدام هذا الرابط مباشرة في الخطوات التالية أو رفعه إلى سحابة تخزين.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDocs;
