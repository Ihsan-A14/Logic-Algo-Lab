import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false, 
  theme: 'base',
  securityLevel: 'loose',
  flowchart: { 
    curve: 'stepAfter',
    rankSpacing: 40,
    nodeSpacing: 30,
  },
  themeVariables: {
    darkMode: true,
    background: '#111827', // Matches gray-900
    primaryColor: '#1f2937', 
    primaryTextColor: '#fff',
    lineColor: '#4b5563',
    mainBkg: '#1f2937', // Default node background
  }
});

const CircuitDrawer = ({ expression, simplified, activeInputs }) => {
  const mermaidRef = useRef(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [viewMode, setViewMode] = useState('original'); 

  // Simulation Timer
  useEffect(() => {
    if (!activeInputs) { setSimulationStep(0); return; }
    setSimulationStep(1);
    const timers = [1, 2, 3, 4, 5].map(i => setTimeout(() => setSimulationStep(i), i * 600));
    return () => timers.forEach(clearTimeout);
  }, [activeInputs]);

  // Graph Generator
  useEffect(() => {
    let rawExpr = viewMode === 'simplified' ? simplified : expression;
    if (!rawExpr || rawExpr === '0' || rawExpr === '1') {
       if(mermaidRef.current) mermaidRef.current.innerHTML = '<div class="p-10 text-gray-500 text-center text-sm">Constant Value: Circuit not required.</div>';
       return;
    }

    const generateGraph = (expr) => {
      let cleanExpr = expr.replace(/\s/g, '');
      const vars = [...new Set(cleanExpr.match(/[A-Z]/g))].sort();
      let graph = `flowchart LR\n`;
      let linkId = 0; 

      const addWire = (from, to, active, label="") => {
          const color = active ? "#22c55e" : "#4b5563"; // Green or Gray
          const width = active ? "3px" : "1px";
          const arrow = active ? "==>" : "-.->";
          graph += `  ${from} ${arrow} ${label} ${to}\n`;
          graph += `linkStyle ${linkId++} stroke:${color},stroke-width:${width};\n`;
      };

      // --- INPUTS ---
      graph += `  subgraph Inputs\n    direction TB\n`;
      vars.forEach(v => {
        const isActive = activeInputs && activeInputs[v] === 1 && simulationStep >= 1;
        graph += `    ${v}["${v} (${isActive?1:0})"]:::${isActive?'on':'off'}\n`;
      });
      graph += `  end\n`;
      // Apply Translucent Style to Inputs Box
      graph += `  style Inputs fill:#ffffff05,stroke:#ffffff10,stroke-width:1px,rx:10,ry:10,color:#9ca3af\n`;

      // --- LOGIC GATES ---
      graph += `  subgraph Logic\n    direction TB\n`;
      
      if (viewMode === 'original' && expr.includes('(')) {
          cleanExpr = cleanExpr.replace(/\(/g, '').replace(/\)/g, ''); 
      }
      
      const terms = cleanExpr.split('+').filter(t => t.length > 0);
      const needsOr = terms.length > 1;
      let orInputs = [];

      terms.forEach((term, idx) => {
          const literals = term.match(/[A-Z]'?/g) || [];
          const needsAnd = literals.length > 1;
          const gateId = `AND_${idx}`;
          const isTermActive = (() => {
              if(!activeInputs) return false;
              try {
                  const js = term.replace(/([A-Z])'/g, '!$1').replace(/([A-Z])([A-Z])/g, '$1&&$2'); 
                  const f = new Function(...vars, `return !!(${js})`);
                  return f(...vars.map(v=>activeInputs[v]===1));
              } catch { return false; }
          })();

          if (needsAnd) {
              const gateOn = isTermActive && simulationStep >= 3;
              graph += `    ${gateId}(["AND"]):::${gateOn?'on':'off'}\n`;
              orInputs.push({ id: gateId, active: isTermActive });
          } else {
              if(literals.length === 0) return;
              const lit = literals[0];
              const isNot = lit.includes("'");
              const v = lit.replace("'", "");
              const val = activeInputs ? activeInputs[v] : 0;
              const isActive = isNot ? val === 0 : val === 1;

              if (isNot) {
                  const notId = `NOT_DIRECT_${idx}`;
                  const notOn = simulationStep >= 2 && isActive;
                  graph += `    ${notId}>"NOT"]:::${notOn?'on':'off'}\n`;
                  orInputs.push({ id: notId, active: isActive });
                  addWire(v, notId, simulationStep >= 2 && val === 1);
              } else {
                  orInputs.push({ id: v, active: isActive, isDirect: true });
              }
          }

          if (needsAnd) {
              literals.forEach((lit, litIdx) => {
                  const v = lit.replace("'", "");
                  const isNot = lit.includes("'");
                  const val = activeInputs ? activeInputs[v] : 0;
                  
                  if (isNot) {
                      const notId = `NOT_${idx}_${litIdx}`;
                      const notActive = simulationStep >= 2 && val === 0;
                      graph += `    ${notId}>"NOT"]:::${notActive?'on':'off'}\n`;
                      
                      addWire(v, notId, simulationStep >= 2 && val === 1);
                      addWire(notId, gateId, simulationStep >= 2 && notActive);
                  } else {
                      addWire(v, gateId, simulationStep >= 2 && val === 1);
                  }
              });
          }
      });
      graph += `  end\n`;
      // Apply Translucent Style to Logic Box
      graph += `  style Logic fill:#ffffff05,stroke:#ffffff10,stroke-width:1px,rx:10,ry:10,color:#9ca3af\n`;

      // --- OUTPUT ---
      graph += `  subgraph Output\n    direction TB\n`;
      const finalActive = (() => {
          if(!activeInputs) return false;
          try {
             const js = cleanExpr.replace(/\+/g,'||').replace(/([A-Z])'/g,'!$1').replace(/([A-Z])([A-Z])/g, '$1&&$2');
             const f = new Function(...vars, `return !!(${js})`);
             return f(...vars.map(v=>activeInputs[v]===1));
          } catch { return false; }
      })();

      if (needsOr) {
          const orOn = finalActive && simulationStep >= 4;
          graph += `    OR_GATE{{"OR"}}:::${orOn?'on':'off'}\n`;
          graph += `    Result((Out)):::${finalActive && simulationStep>=5?'on':'off'}\n`;
          
          orInputs.forEach(inp => {
             const wireHot = inp.active && (inp.isDirect ? simulationStep >= 2 : simulationStep >= 4);
             addWire(inp.id, "OR_GATE", wireHot);
          });
          addWire("OR_GATE", "Result", finalActive && simulationStep >= 5);
      } else {
          const single = orInputs[0];
          graph += `    Result((Out)):::${finalActive && simulationStep>=5?'on':'off'}\n`;
          if (single) {
              const wireHot = single.active && simulationStep >= 5;
              addWire(single.id, "Result", wireHot);
          }
      }
      graph += `  end\n`;
      // Apply Translucent Style to Output Box
      graph += `  style Output fill:#ffffff05,stroke:#ffffff10,stroke-width:1px,rx:10,ry:10,color:#9ca3af\n`;

      // Styles
      // "default" is for non-active gates
      graph += `classDef default fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#fff;\n`;
      // "on" is for active gates
      graph += `classDef on fill:#064e3b,stroke:#22c55e,stroke-width:3px,color:#fff;\n`;
      // "off" is for inactive gates
      graph += `classDef off fill:#1f2937,stroke:#4b5563,stroke-width:1px,stroke-dasharray: 5 5,color:#9ca3af;\n`;

      return graph;
    };

    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      mermaidRef.current.removeAttribute('data-processed');
      try {
        mermaid.render(`circuit-${Date.now()}`, generateGraph(rawExpr))
          .then(r => mermaidRef.current.innerHTML = r.svg);
      } catch(e) {}
    }
  }, [expression, simplified, activeInputs, simulationStep, viewMode]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 relative">
        <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
                 <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Circuit Simulation</h3>
                 {activeInputs && <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded animate-pulse">LIVE</span>}
             </div>
             <div className="flex bg-gray-800 rounded p-1">
                <button onClick={() => setViewMode('original')} className={`px-3 py-1 text-xs font-bold rounded ${viewMode==='original'?'bg-blue-600 text-white':'text-gray-400'}`}>Original</button>
                <button onClick={() => setViewMode('simplified')} className={`px-3 py-1 text-xs font-bold rounded ${viewMode==='simplified'?'bg-green-600 text-white':'text-gray-400'}`}>Simplified</button>
             </div>
        </div>
        <div className="flex justify-center overflow-x-auto p-4 bg-gray-950 rounded border border-gray-800 min-h-[300px]">
            <div ref={mermaidRef} className="w-full max-w-2xl" />
        </div>
    </div>
  );
};

export default CircuitDrawer;