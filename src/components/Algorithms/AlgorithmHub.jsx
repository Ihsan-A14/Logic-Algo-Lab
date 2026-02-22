import React, { useState } from 'react';
import SortingVisualizer from './SortingVisualizer';
import SearchingVisualizer from './SearchingVisualizer';
import TreeVisualizer from './TreeVisualizer';
import GraphVisualizer from './GraphVisualizer'; // Import Graph

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
        <div className="bg-gray-800 p-1 rounded-xl inline-flex shadow-xl border border-gray-700 flex-wrap justify-center gap-1">
          {/* Navigation Buttons */}
          {['sorting', 'searching', 'trees', 'graphs'].map(module => (
              <button
                key={module}
                onClick={() => setActiveModule(module)}
                className={`px-6 md:px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeModule === module
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {module === 'graphs' ? '🕸 Graphs' : 
                 module === 'trees' ? '🌳 Trees' :
                 module === 'searching' ? '🔍 Searching' : '📊 Sorting'}
              </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto transition-all duration-500">
        {activeModule === 'sorting' && <SortingVisualizer />}
        {activeModule === 'searching' && <SearchingVisualizer />}
        {activeModule === 'trees' && <TreeVisualizer />}
        {activeModule === 'graphs' && <GraphVisualizer />}
      </div>

      <div className="text-center mt-12 text-gray-600 text-xs uppercase tracking-widest">
        Logic-Algo-Lab v1.2 • Built for CS Education
      </div>
    </div>
  );
};

export default AlgorithmHub;