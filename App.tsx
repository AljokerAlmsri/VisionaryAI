
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import ApiDocs from './components/ApiDocs';
import { AspectRatio, GeneratedImage, LoadingStatus } from './types';
import { generateImage, enhancePrompt } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedGallery = localStorage.getItem('visionary_gallery');
    if (savedGallery) {
      try {
        setGallery(JSON.parse(savedGallery));
      } catch (e) {
        console.error("Failed to load gallery", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visionary_gallery', JSON.stringify(gallery));
  }, [gallery]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus(LoadingStatus.ENHANCING);
    setError(null);

    try {
      const enhanced = await enhancePrompt(prompt);
      setStatus(LoadingStatus.GENERATING);
      const imageUrl = await generateImage(enhanced, aspectRatio);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: aspectRatio
      };

      setCurrentImage(newImage);
      setGallery(prev => [newImage, ...prev].slice(0, 12));
      setStatus(LoadingStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("عذراً، حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.");
      setStatus(LoadingStatus.ERROR);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `visionary-ai-${img.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
    { value: '1:1', label: 'مربع', icon: 'fa-square' },
    { value: '16:9', label: 'سينمائي', icon: 'fa-rectangle-list' },
    { value: '9:16', label: 'قصة', icon: 'fa-mobile-screen' },
    { value: '4:3', label: 'كلاسيكي', icon: 'fa-tablet-screen-button' },
    { value: '3:4', label: 'بورتريه', icon: 'fa-image' },
  ];

  return (
    <div className="min-h-screen pb-20 pt-28">
      <Header />
      <LoadingOverlay status={status} />

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <section className="glass-card p-8 rounded-3xl shadow-2xl border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <i className="fas fa-feather-pointed text-indigo-400"></i>
                أوصف مشهدك
              </h2>
              
              <div className="mb-8">
                <label className="block text-gray-400 text-sm mb-3 font-medium">الوصف التفصيلي للمشهد</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثلاً: مدينة مستقبلية تحت الماء بأسلوب السايبربانك..."
                  className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-400 text-sm mb-4 font-medium">أبعاد الصورة</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {aspectRatios.map((ar) => (
                    <button
                      key={ar.value}
                      onClick={() => setAspectRatio(ar.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        aspectRatio === ar.value 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                        : 'bg-slate-800/40 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <i className={`fas ${ar.icon} mb-2 text-lg`}></i>
                      <span className="text-[10px] uppercase tracking-wider font-bold">{ar.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <i className="fas fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || status === LoadingStatus.GENERATING}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fas fa-wand-magic-sparkles"></i>
                توليد الصورة الآن
              </button>
            </section>

            {gallery.length > 0 && (
              <section className="glass-card p-6 rounded-3xl shadow-xl border-white/10">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-3 text-white">
                  <i className="fas fa-history text-indigo-400"></i>
                  المعرض الشخصي
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((img) => (
                    <button 
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImage?.id === img.id ? 'border-indigo-500 scale-95 shadow-lg' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <div className="sticky top-28 space-y-8">
              <div className={`glass-card p-4 rounded-[2.5rem] shadow-2xl border-white/10 min-h-[500px] flex items-center justify-center relative overflow-hidden group ${!currentImage ? 'border-dashed border-2' : ''}`}>
                {!currentImage ? (
                  <div className="text-center p-10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400/30 text-5xl">
                      <i className="fas fa-magic animate-pulse"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-500 mb-2">حول كلماتك إلى واقع</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">أدخل وصفك المفضل وسنقوم بإنتاج صورة سينمائية لك خلال ثوانٍ.</p>
                  </div>
                ) : (
                  <div className="w-full relative">
                    <img 
                      src={currentImage.url} 
                      alt={currentImage.prompt} 
                      className="w-full h-auto max-h-[75vh] object-contain rounded-[1.8rem] shadow-2xl"
                    />
                    <div className="absolute inset-x-4 bottom-4 flex justify-between items-center bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <span className="text-[10px] uppercase text-indigo-300 font-bold tracking-widest">الوصف المستخدم</span>
                        <p className="text-white text-xs truncate font-medium">{currentImage.prompt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownload(currentImage)}
                          className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* API Info section integrated below the preview */}
              <div id="api-section">
                <ApiDocs />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
               <i className="fas fa-wand-magic-sparkles text-indigo-400 text-sm"></i>
             </div>
             <span className="font-bold text-white">Visionary AI Engine</span>
          </div>
          <p className="text-gray-500 text-sm">
            تم التطوير بواسطة الذكاء الاصطناعي - جاهز للنشر على Vercel كمنصة برمجية متكاملة.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
