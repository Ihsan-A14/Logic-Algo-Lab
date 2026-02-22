import React, { useState, useEffect, useRef } from 'react';
import { generateTruthTable, getSimplifiedExpression } from '../../utils/logicParser';
import CircuitDrawer from './CircuitDrawer';

const TruthTable = () => {
  const [expression, setExpression] = useState('(A + B) * C');
  const [tableData, setTableData] = useState(null);
  const [simplified, setSimplified] = useState('');
  const [error, setError] = useState(false);
  const [activeInputs, setActiveInputs] = useState(null);

  const circuitRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (expression.length > 0) {
        const result = generateTruthTable(expression);
        if (result) {
          setTableData(result);
          setSimplified(getSimplifiedExpression(result));
          setError(false);
          setActiveInputs(null);
        } else {
          setError(true);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [expression]);

  const handleRowClick = (row) => {
    const inputs = { ...row };
    delete inputs.Result;
    setActiveInputs(inputs);

    // Auto-Scroll to Circuit
    if (circuitRef.current) {
      circuitRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
        <span>🛠️</span> Logic Lab
      </h2>
      
      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 font-medium">
          Enter Boolean Expression:
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

      {/* Simplified Formula */}
      {simplified && !error && (
        <div className="mb-6 p-4 bg-gray-700 rounded border border-gray-600">
          <h3 className="text-gray-300 text-xs font-bold uppercase mb-1 tracking-wider">Canonical Sum of Products:</h3>
          <p className="text-xl font-mono text-green-400 tracking-wide break-all">{simplified}</p>
        </div>
      )}

      {/* Circuit Diagram (With Ref for auto-scroll) */}
      {!error && (
        <div ref={circuitRef} className="scroll-mt-4 mb-8">
          <CircuitDrawer expression={expression} simplified={simplified} activeInputs={activeInputs} />
        </div>
      )}

      {/* Results Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        {tableData ? (
          <div>
            <div className="p-2 bg-gray-800 text-center text-xs text-gray-400 uppercase tracking-widest border-b border-gray-700">
              Click a row to simulate the circuit! 👇
            </div>
            {/* REMOVED max-h-[500px] so it shows ALL rows at once */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    {tableData.headers.map((header, i) => (
                      <th key={i} className={`p-3 font-bold text-gray-300 border-b border-gray-600 bg-gray-800 ${header === 'Result' ? 'text-blue-400 border-l' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => {
                    const isActive = activeInputs && JSON.stringify(activeInputs) === JSON.stringify(Object.fromEntries(Object.entries(row).filter(([k]) => k !== 'Result')));
                    
                    return (
                      <tr 
                        key={rowIndex} 
                        onClick={() => handleRowClick(row)}
                        className={`cursor-pointer transition-all border-b border-gray-800 last:border-0 ${
                          isActive ? 'bg-blue-900/50 hover:bg-blue-900/60 ring-2 ring-inset ring-blue-500' : 'hover:bg-gray-800'
                        }`}
                      >
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 italic">Start typing...</div>
        )}
      </div>
    </div>
  );
};

export default TruthTable;