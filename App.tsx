
import React, { useState } from 'react';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import ApiDocs from './components/ApiDocs';
import { generateImage } from './services/geminiService';
import { AspectRatio, GenerationResponse } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ratios: { id: AspectRatio; icon: string; label: string }[] = [
    { id: '1:1', icon: 'fa-square', label: 'مربع' },
    { id: '16:9', icon: 'fa-rectangle-wide', label: 'سينمائي' },
    { id: '9:16', icon: 'fa-mobile-screen', label: 'سناب/تيك توك' },
    { id: '4:3', icon: 'fa-desktop', label: 'كلاسيكي' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('يرجى كتابة وصف للمشهد أولاً');
      return;
    }
    if (!apiKey.trim()) {
      setError('يرجى إدخال مفتاح الـ API الخاص بك');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    const data = await generateImage(prompt, apiKey, aspectRatio);
    
    setLoading(false);
    if (data.success) {
      setResult(data);
    } else {
      setError(data.error || 'حدث خطأ غير متوقع');
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {loading && <LoadingOverlay />}
      
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            تخيل، نحن <span className="gradient-text">نرسم.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            حول أفكارك المكتوبة إلى مشاهد بصرية واقعية مذهلة باستخدام قوة الذكاء الاصطناعي الأحدث من جوجل.
          </p>
        </div>

        <div className="glass-card p-8 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
          
          <div className="space-y-8 relative">
            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 flex justify-between">
                <span>مفتاح الـ API (Gemini)</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 hover:underline">احصل على مفتاح مجاني</a>
              </label>
              <div className="relative group">
                <i className="fas fa-key absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"></i>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="أدخل مفتاح الـ API الخاص بك هنا..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">وصف المشهد</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثلاً: رائد فضاء يجلس في مقهى قديم على كوكب المريخ، ألوان سايبربانك، تفاصيل دقيقة..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-lg leading-relaxed"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-4">
              <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto">
                {ratios.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all flex-shrink-0 ${
                      aspectRatio === r.id 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <i className={`fas ${r.icon}`}></i>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <span>توليد المشهد</span>
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <i className="fas fa-circle-exclamation"></i>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        {result?.success && (
          <div className="mt-20 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-black mb-2">المشهد المكتمل</h3>
                <p className="text-gray-500 text-sm">تم استخدام نموذج Gemini 2.5 Flash Image للرسم</p>
              </div>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = result.imageUrl!;
                  link.download = 'visionary-ai-scene.png';
                  link.click();
                }}
                className="bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-all"
              >
                <i className="fas fa-download"></i>
              </button>
            </div>

            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5">
              <img 
                src={result.imageUrl} 
                alt="Generated Scene" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-sm text-gray-300 italic max-w-lg">
                  "{result.enhancedPrompt}"
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">الوصف المحسن بواسطة AI:</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{result.enhancedPrompt}</p>
            </div>
          </div>
        )}

        {/* Documentation Component */}
        <ApiDocs />
      </main>

      <footer className="mt-40 pt-20 border-t border-white/5 text-center text-gray-600 text-xs px-6">
        <p>© 2024 VISIONARY AI. جميع الحقوق محفوظة.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
          <a href="#" className="hover:text-white transition-colors">شروط الخدمة</a>
          <a href="#" className="hover:text-white transition-colors">المطورين</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
