import React, { useState, useRef } from 'react';
import CircuitDrawer from './CircuitDrawer';

const TruthTable = () => {
  // 1. INPUT STATE (Live Typing)
  const [expression, setExpression] = useState('');
  
  // 2. ANALYZED STATE (Frozen for Display)
  const [analyzedExpr, setAnalyzedExpr] = useState(''); 
  const [simplified, setSimplified] = useState('');
  
  const [tableData, setTableData] = useState([]);
  const [variables, setVariables] = useState([]);
  const [error, setError] = useState('');
  const [activeInputs, setActiveInputs] = useState(null);

  // Ref for Auto-Scrolling
  const circuitRef = useRef(null);

  // --- LOGIC ENGINE ---

  const getVariables = (expr) => {
    return [...new Set(expr.match(/[A-Z]/g))].sort();
  };

  const evaluate = (expr, scope) => {
    try {
      let clean = expr
        .replace(/([A-Z])'/g, '!$1') 
        .replace(/\+/g, '||')        
        .replace(/\*/g, '&&')        
        .replace(/⊕/g, '^');         

      Object.keys(scope).sort((a, b) => b.length - a.length).forEach(v => {
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        clean = clean.replace(regex, scope[v]);
      });

      // eslint-disable-next-line no-new-func
      return new Function(`return !!(${clean})`)() ? 1 : 0;
    } catch (err) {
      throw new Error("Invalid Expression");
    }
  };

  const simplifyLogic = (minterms, vars) => {
      if (minterms.length === 0) return "0";
      if (minterms.length === Math.pow(2, vars.length)) return "1";

      let terms = minterms.map(m => vars.map(v => m[v]).join(''));
      let primeImplicants = new Set(terms);
      let changed = true;
      
      while(changed) {
          changed = false;
          const newPrimes = new Set();
          const checked = new Set();
          const pList = Array.from(primeImplicants);

          for(let i=0; i<pList.length; i++) {
              for(let j=i+1; j<pList.length; j++) {
                  const t1 = pList[i];
                  const t2 = pList[j];
                  let diff = 0;
                  let diffIdx = -1;
                  for(let k=0; k<t1.length; k++) {
                      if(t1[k] !== t2[k]) { diff++; diffIdx = k; }
                  }
                  if(diff === 1) {
                      const merged = t1.substring(0, diffIdx) + '-' + t1.substring(diffIdx+1);
                      newPrimes.add(merged);
                      checked.add(t1); checked.add(t2);
                      changed = true;
                  }
              }
          }
          pList.forEach(t => { if(!checked.has(t)) newPrimes.add(t); });
          if(changed) primeImplicants = newPrimes;
      }

      const expressions = Array.from(primeImplicants).map(term => {
          let part = "";
          for(let i=0; i<term.length; i++) {
              if(term[i] === '0') part += vars[i] + "'";
              if(term[i] === '1') part += vars[i];
          }
          return part || "1";
      });
      return expressions.join(' + ');
  };

  // --- MAIN ACTION ---
  const analyzeExpression = () => {
    setError('');
    setTableData([]);
    setActiveInputs(null);
    setAnalyzedExpr(''); // Clear old graph immediately

    if (!expression.trim()) {
        setError('Please enter an expression.');
        return;
    }

    try {
        const vars = getVariables(expression);
        if (vars.length === 0) {
            setError('No variables found (use A, B, C...).');
            return;
        }
        setVariables(vars);

        const rows = [];
        const numRows = Math.pow(2, vars.length);
        const minterms = [];

        for (let i = 0; i < numRows; i++) {
            const row = {};
            vars.forEach((v, idx) => {
                const shift = vars.length - 1 - idx;
                row[v] = (i >> shift) & 1;
            });
            row.result = evaluate(expression, row);
            rows.push(row);
            if(row.result === 1) minterms.push(row);
        }

        setTableData(rows);
        
        // Simplify
        const simple = simplifyLogic(minterms, vars);
        setSimplified(simple);
        
        // LOCK IN THE EXPRESSION FOR DISPLAY
        setAnalyzedExpr(expression);

    } catch (err) {
        setError('Invalid Syntax. Try: A + B * C');
    }
  };

// ... existing imports and state ...

  // NEW: Handle Simulation & Scroll to Top
  const handleSimulate = (row) => {
      setActiveInputs(row);
      // Scroll so the TOP of the circuit container aligns with the top of the viewport
      if (circuitRef.current) {
          circuitRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  // ... rest of the component (make sure <div ref={circuitRef}> is still on the container) ...

  return (
    <div className="min-h-[85vh] p-4 flex flex-col gap-6 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto mb-4">
        <h1 className="text-4xl font-black text-white mb-2">Digital Logic Lab</h1>
        <p className="text-gray-400 text-sm">
          Enter a Boolean expression to generate truth tables, simplify logic, and simulate circuit gates in real-time.
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl">
           <label className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 block">Boolean Expression</label>
           <div className="flex gap-4">
              <input 
                type="text" 
                value={expression}
                onChange={(e) => setExpression(e.target.value.toUpperCase())}
                placeholder="e.g. A + B * C"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
              <button 
                onClick={analyzeExpression}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transition-all transform hover:scale-105"
              >
                Analyze
              </button>
           </div>
           {error && <div className="mt-3 text-red-400 text-sm font-bold bg-red-900/20 p-2 rounded-lg border border-red-500/20">{error}</div>}
        </div>
      </div>

      {tableData.length > 0 && (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white">Truth Table</h3>
                      <span className="text-xs text-gray-500 uppercase">Click row to simulate</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase font-bold text-xs">
                            <tr>
                                {variables.map(v => <th key={v} className="px-4 py-3">{v}</th>)}
                                <th className="px-4 py-3 text-teal-400">Output</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {tableData.map((row, i) => (
                                <tr 
                                  key={i} 
                                  onClick={() => handleSimulate(row)}
                                  className={`cursor-pointer transition-colors ${activeInputs === row ? 'bg-teal-900/30 border-l-4 border-teal-500' : 'hover:bg-gray-700/30'}`}
                                >
                                    {variables.map(v => <td key={v} className="px-4 py-3 font-mono">{row[v]}</td>)}
                                    <td className={`px-4 py-3 font-bold ${row.result ? 'text-green-400' : 'text-gray-500'}`}>
                                        {row.result ? '1' : '0'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>

              <div className="flex flex-col gap-6">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Minimized Expression</h3>
                      <div className="font-mono text-2xl text-white break-words">
                          {simplified || <span className="text-gray-600 text-sm italic">No simplification available</span>}
                      </div>
                  </div>

                  <div ref={circuitRef} className="flex-1 bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden relative min-h-[400px]">
                      {/* IMPORTANT: We pass 'analyzedExpr' here, NOT 'expression' */}
                      <CircuitDrawer expression={analyzedExpr} simplified={simplified} activeInputs={activeInputs} />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TruthTable;