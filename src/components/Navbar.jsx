import React from 'react';

const Navbar = ({ setActiveTab, activeTab }) => {
  return (
    <nav className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT SECTION: Logo + Primary Nav */}
        <div className="flex items-center gap-8">
            {/* LOGO IMAGE */}
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer select-none group flex items-center"
            >
              {/* Replace '/logo.png' with your actual file path */}
              <img 
                src="/logo.png" 
                alt="AlgoVista Logo" 
                className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 filter brightness-100 invert" 
              />
            </div>

            {/* PRIMARY NAV (Desktop) */}
            <div className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveTab('logic')}
                className={`text-sm font-medium transition-colors ${activeTab === 'logic' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Logic Lab
              </button>
              <button
                onClick={() => setActiveTab('algorithms')}
                className={`text-sm font-medium transition-colors ${activeTab === 'algorithms' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Algorithms
              </button>
            </div>
        </div>

        {/* RIGHT SECTION: Secondary Nav */}
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setActiveTab('faq')}
             className={`text-sm font-medium transition-colors ${activeTab === 'faq' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
           >
             FAQ
           </button>
           <button 
             onClick={() => setActiveTab('about')}
             className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
           >
             About
           </button>
           <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 cursor-default border border-gray-600">
              IM
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;