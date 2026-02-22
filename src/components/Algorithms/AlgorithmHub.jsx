import React, { useState } from 'react';
import SortingVisualizer from './SortingVisualizer';
import SearchingVisualizer from './SearchingVisualizer';
import GraphVisualizer from './GraphVisualizer';

const AlgorithmHub = () => {
  const [activeModule, setActiveModule] = useState('sorting');

  const navItems = [
    { id: 'sorting', label: 'Sorting', icon: '📊' },
    { id: 'searching', label: 'Searching', icon: '🔍' },
    { id: 'graphs', label: 'Graphs', icon: '🕸' }
  ];

  return (
    <div className="min-h-[85vh] text-white p-4 relative">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8 text-center animate-fadeIn">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          {activeModule === 'sorting' && "Sorting Algorithms"}
          {activeModule === 'searching' && "Search Algorithms"}
          {activeModule === 'graphs' && "Graph Theory"}
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          {activeModule === 'sorting' && "Visualize how computers organize data. Compare efficiency between O(N²) and O(N log N)."}
          {activeModule === 'searching' && "Explore the difference between brute force linear scans and efficient binary division."}
          {activeModule === 'graphs' && "Pathfinding on weighted and unweighted networks using BFS, DFS, Dijkstra, and A*."}
        </p>
      </div>

      {/* DYNAMIC FLOATING NAV */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl flex gap-2">
           {navItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveModule(item.id)}
               className={`
                 relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                 ${activeModule === item.id 
                   ? 'bg-white text-black shadow-lg scale-105' 
                   : 'text-gray-400 hover:text-white hover:bg-white/5'}
               `}
             >
               <span>{item.icon}</span>
               <span>{item.label}</span>
               {activeModule === item.id && (
                 <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full mb-1"></span>
               )}
             </button>
           ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto transition-all duration-500 animate-slideUp">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-1 shadow-2xl">
            {activeModule === 'sorting' && <SortingVisualizer />}
            {activeModule === 'searching' && <SearchingVisualizer />}
            {activeModule === 'graphs' && <GraphVisualizer />}
        </div>
      </div>

    </div>
  );
};

export default AlgorithmHub;