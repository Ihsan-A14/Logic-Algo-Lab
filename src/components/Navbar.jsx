import React from 'react';

const Navbar = ({ setActiveTab, activeTab }) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('logic')}>
          <span className="text-2xl">🧪</span>
          <span className="bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
            Logic-Algo-Lab
          </span>
        </div>
        <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('logic')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'logic' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Logic Lab
          </button>
          <button 
            onClick={() => setActiveTab('algorithms')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'algorithms' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
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