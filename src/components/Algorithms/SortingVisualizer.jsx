import React from 'react';

const SortingVisualizer = () => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-green-400 mb-4">Algorithm Arena 📊</h2>
      
      <div className="h-64 bg-gray-900 flex items-end justify-center gap-1 p-4 rounded border border-gray-600">
        {/* Fake bars for visual proof */}
        <div className="w-8 h-20 bg-blue-500"></div>
        <div className="w-8 h-40 bg-blue-500"></div>
        <div className="w-8 h-10 bg-blue-500"></div>
        <div className="w-8 h-32 bg-blue-500"></div>
        <div className="w-8 h-56 bg-blue-500"></div>
      </div>

      <div className="mt-4 flex gap-4 justify-center">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">
          Run Bubble Sort
        </button>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold">
          Reset Array
        </button>
      </div>
    </div>
  );
};

export default SortingVisualizer;