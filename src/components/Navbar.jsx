import { useState, useEffect } from 'react';

const Navbar = ({ setActiveTab, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-slate-950/60 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' // 💎 The Glass Look
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* --- LEFT SIDE: Logo + Main Nav --- */}
          <div className="flex items-center gap-12">
            
            {/* Logo Box */}
            <button 
              onClick={() => setActiveTab('home')} 
              className="group relative"
            >
              <div className="w-10 h-10 bg-black border border-white/20 flex items-center justify-center rounded-lg shadow-lg group-hover:border-blue-500/50 transition-colors">
                 <span className="font-serif italic text-2xl text-white tracking-tighter">Av</span>
              </div>
            </button>

            {/* Main Links (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setActiveTab('logic')}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                  activeTab === 'logic' ? 'text-blue-400' : 'text-slate-300'
                }`}
              >
                Logic Lab
              </button>
              <button
                onClick={() => setActiveTab('algorithms')}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                  activeTab === 'algorithms' ? 'text-blue-400' : 'text-slate-300'
                }`}
              >
                Algorithms
              </button>
            </div>
          </div>


          {/* --- RIGHT SIDE: FAQ + Profile --- */}
          <div className="hidden md:flex items-center gap-8">
             <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
             <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
             
             {/* Profile Circle (IM) */}
             <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all cursor-pointer shadow-md">
                IM
             </div>
          </div>


          {/* --- MOBILE MENU BUTTON --- */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 text-xl font-bold"
            >
              {/* Uses Unicode characters instead of icons */}
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN (Glassy) --- */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <button onClick={() => { setActiveTab('logic'); setIsOpen(false); }} className="block w-full text-left py-2 text-slate-300 hover:text-blue-400">Logic Lab</button>
          <button onClick={() => { setActiveTab('algorithms'); setIsOpen(false); }} className="block w-full text-left py-2 text-slate-300 hover:text-blue-400">Algorithms</button>
          <div className="h-px bg-white/10 my-2"></div>
          <a href="#" className="block py-2 text-slate-400 hover:text-white">FAQ</a>
          <a href="#" className="block py-2 text-slate-400 hover:text-white">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;