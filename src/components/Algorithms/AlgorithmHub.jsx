import React, { useState } from 'react';
import SortingVisualizer from './SortingVisualizer';
import SearchingVisualizer from './SearchingVisualizer';
import TreeVisualizer from './TreeVisualizer'; // Import New Component

const AlgorithmHub = () => {
  const [activeModule, setActiveModule] = useState('sorting');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          Algorithm Arena
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Visualize, compare, and master standard Computer Science algorithms.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-gray-800 p-1 rounded-xl inline-flex shadow-xl border border-gray-700 flex-wrap justify-center">
          <button
            onClick={() => setActiveModule('sorting')}
            className={`px-6 md:px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeModule === 'sorting'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            📊 Sorting
          </button>
          
          <button
            onClick={() => setActiveModule('searching')}
            className={`px-6 md:px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeModule === 'searching'
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            🔍 Searching
          </button>

          <button
            onClick={() => setActiveModule('trees')}
            className={`px-6 md:px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeModule === 'trees'
                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            🌳 Trees
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto transition-all duration-500">
        {activeModule === 'sorting' && <SortingVisualizer />}
        {activeModule === 'searching' && <SearchingVisualizer />}
        {activeModule === 'trees' && <TreeVisualizer />}
      </div>

      <div className="text-center mt-12 text-gray-600 text-xs uppercase tracking-widest">
        Logic-Algo-Lab v1.1 • Built for CS Education
      </div>
    </div>
  );
};

export default AlgorithmHub;