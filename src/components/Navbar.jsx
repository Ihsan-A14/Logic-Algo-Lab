import React from 'react';

const Navbar = ({ setActiveTab, activeTab }) => {
  return (
    <nav className="bg-gray-900/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO - Click to go Home */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span className="text-white font-bold text-lg">λ</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
            LogicLab
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('logic')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'logic'
                ? 'bg-gray-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Logic
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
              activeTab === 'algorithms'
                ? 'bg-gray-800 text-white shadow-lg shadow-black/20 ring-1 ring-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Algorithms
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;