
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-wand-magic-sparkles text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Visionary<span className="gradient-text">AI</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">الرئيسية</a>
          <a href="#api-section" className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2">
            <i className="fas fa-code-branch text-xs opacity-50"></i>
            المطورين
          </a>
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20">
            ابدأ مجاناً
          </button>
        </nav>

        <button className="md:hidden text-2xl text-gray-300">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
