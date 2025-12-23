
import React, { useState } from 'react';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'js' | 'n8n' | 'troubleshoot'>('js');

  const codeSnippet = `
// مثال لإرسال طلب توليد صورة (الآن يستخدم مفتاح الخادم الآمن)
const generate = async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt: "رائد فضاء في الغابة",
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
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'js' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            JavaScript
          </button>
          <button 
            onClick={() => setActiveTab('n8n')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'n8n' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            n8n
          </button>
          <button 
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'troubleshoot' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            حل المشاكل (401)
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'js' && (
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
        )}

        {activeTab === 'n8n' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <p className="text-gray-400 text-sm">لإعداد عقدة **HTTP Request** في n8n، استخدم الإعدادات التالية:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Method</span>
                <div className="text-green-400 font-mono font-bold">POST</div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Authentication</span>
                <div className="text-gray-300 font-mono">None</div>
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
          </div>
        )}

        {activeTab === 'troubleshoot' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-3">
              <h4 className="font-bold text-red-400 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                خطأ 401 (Authentication Required) في n8n
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                إذا كنت تحصل على خطأ 401 عند محاولة الاتصال بـ Vercel، فهذا يعني أن خاصية **Deployment Protection** مفعلة في حساب Vercel الخاص بك.
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-bold text-white">كيفية الإصلاح:</h5>
              <ol className="list-decimal list-inside text-sm text-gray-400 space-y-4 px-2">
                <li>
                  <span className="text-indigo-400 font-bold">الخيار الأول (الأسهل):</span> اذهب إلى إعدادات المشروع في Vercel -> Deployment Protection -> عطل خيار "Vercel Authentication".
                </li>
                <li>
                  <span className="text-indigo-400 font-bold">الخيار الثاني (الأكثر أماناً):</span> قم بإنشاء **Protection Bypass Automation Token** من إعدادات Vercel.
                </li>
                <li>
                  أضف الـ Token إلى رابط الـ URL في n8n بهذا الشكل:
                  <div className="mt-2 bg-black/60 p-3 rounded-lg font-mono text-[10px] break-all border border-white/10 text-indigo-300">
                    {n8nConfig.url}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=YOUR_TOKEN_HERE
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDocs;
