import React, { useState } from 'react';

const TruthTable = () => {
  const [expression, setExpression] = useState('');

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">Logic Lab 🛠️</h2>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Enter Boolean Expression:</label>
        <input 
          type="text" 
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="(A + B) * C"
          className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="bg-gray-900 p-4 rounded text-center text-gray-400">
        <p>Truth Table will appear here...</p>
        <p className="text-sm mt-2">(Parsing logic coming soon)</p>
      </div>
    </div>
  );
};

export default TruthTable;