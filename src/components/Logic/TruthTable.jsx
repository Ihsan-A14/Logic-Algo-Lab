import React, { useState, useEffect } from 'react';
import { generateTruthTable } from '../../utils/logicParser';

const TruthTable = () => {
  const [expression, setExpression] = useState('(A + B) * C');
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(false);

  // Automatically calculate whenever expression changes
  useEffect(() => {
    // Basic debounce to stop it from crashing while typing
    const timer = setTimeout(() => {
      if (expression.length > 0) {
        const result = generateTruthTable(expression);
        if (result) {
          setTableData(result);
          setError(false);
        } else {
          setError(true);
        }
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [expression]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <span>🛠️</span> Logic Lab
      </h2>
      
      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 font-medium">
          Enter Boolean Expression:
          <span className="text-xs text-gray-500 ml-2">(Supported: +, *, A', ( ), etc.)</span>
        </label>
        <input 
          type="text" 
          value={expression}
          onChange={(e) => setExpression(e.target.value.toUpperCase())}
          placeholder="(A + B) * C"
          className={`w-full p-4 text-lg font-mono tracking-widest bg-gray-900 text-white border rounded transition-all focus:outline-none focus:ring-2 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {error && <p className="text-red-400 text-sm mt-2">Invalid expression syntax.</p>}
      </div>

      {/* Results Section */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {tableData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300 border-b border-gray-700">
                  {tableData.headers.map((header, i) => (
                    <th key={i} className={`p-3 font-bold ${header === 'Result' ? 'text-blue-400 border-l border-gray-600' : ''}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0">
                    {tableData.headers.map((header, colIndex) => (
                      <td key={colIndex} className={`p-3 font-mono ${
                        header === 'Result' 
                          ? (row[header] === 1 ? 'text-green-400 font-bold border-l border-gray-600' : 'text-red-400 font-bold border-l border-gray-600') 
                          : (row[header] === 1 ? 'text-white' : 'text-gray-500')
                      }`}>
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 italic">
            Start typing to generate a table...
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthTable;