
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-wand-magic-sparkles text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">VISIONARY<span className="text-indigo-500">AI</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Powered by Gemini</p>
        </div>
      </div>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
        <a href="#" className="hover:text-white transition-colors">المعرض</a>
        <a href="#" className="hover:text-white transition-colors">المجتمع</a>
      </nav>
      <div className="flex items-center gap-4">
        <button className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all border border-white/10">
          تسجيل الدخول
        </button>
      </div>
    </header>
  );
};

export default Header;
