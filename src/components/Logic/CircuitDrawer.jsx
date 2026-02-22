import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize once outside component
mermaid.initialize({
  startOnLoad: false, // Important: Manual rendering
  theme: 'base',
  securityLevel: 'loose',
  flowchart: { 
    curve: 'stepAfter',
    rankSpacing: 60,
    nodeSpacing: 40,
  },
  themeVariables: {
    darkMode: true,
    background: '#111827', 
    primaryColor: '#1f2937', 
    primaryTextColor: '#fff',
    lineColor: '#4b5563',
  }
});

const CircuitDrawer = ({ expression, simplified, activeInputs }) => {
  const mermaidRef = useRef(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [renderError, setRenderError] = useState(null);
  
  // NEW: State for the fading hint
  const [showHint, setShowHint] = useState(true);

  // 1. Handle Hint Timer (Fade out after 5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Handle Animation Timer
  useEffect(() => {
    if (!activeInputs) {
      setSimulationStep(0);
      return;
    }
    setSimulationStep(1);
    
    const timers = [];
    for (let i = 1; i <= 5; i++) {
        const id = setTimeout(() => {
            setSimulationStep(prev => (prev < i ? i : prev));
        }, i * 600);
        timers.push(id);
    }
    return () => timers.forEach(clearTimeout);
  }, [activeInputs]);

  // 3. Render Graph
  useEffect(() => {
    let targetExpr = simplified || expression || "";
    targetExpr = targetExpr.replace(/^\((.*)\)$/, '$1'); // Remove wrapping ( )
    
    if (!targetExpr) return;

    const generateGraph = (expr) => {
      let cleanExpr = expr.replace(/\s/g, '');
      const vars = [...new Set(cleanExpr.match(/[A-Z]/g))].sort();
      
      let graph = `flowchart LR\n`;
      let linkIndex = 0; 

      const isInputActive = (v) => activeInputs && activeInputs[v] === 1 && simulationStep >= 1;
      
      const checkTerm = (termStr) => {
        if (!activeInputs) return false;
        const termVars = termStr.match(/[A-Z]/g) || [];
        for (let v of termVars) {
           const isNegated = termStr.includes(v + "'");
           const val = activeInputs[v];
           if (!isNegated && val === 0) return false;
           if (isNegated && val === 1) return false;
        }
        return true;
      };

      const addLinkStyle = (isActive) => {
        const color = isActive ? "#22c55e" : "#4b5563";
        const width = isActive ? "3px" : "1px";
        graph += `linkStyle ${linkIndex} stroke:${color},stroke-width:${width};\n`;
        linkIndex++;
      };

      // --- LAYER 1: INPUTS ---
      graph += `  subgraph Inputs ["Layer 1: Inputs"]\n`;
      graph += `    direction TB\n`;
      vars.forEach(v => {
        const isActive = isInputActive(v);
        const style = isActive ? ":::on" : ":::off";
        graph += `    ${v}["${v} ${isActive ? '(1)' : '(0)'}"]${style}\n`;
      });
      graph += `  end\n`;

      // --- LAYER 2: LOGIC ---
      graph += `  subgraph Processing ["Layer 2: Logic Gates"]\n`;
      graph += `    direction TB\n`;
      
      const orParts = cleanExpr.split('+');
      
      let outputActive = false;
      if (activeInputs) outputActive = orParts.some(part => checkTerm(part));

      if (orParts.length > 1) {
          orParts.forEach((part, idx) => {
              if ((part.match(/[A-Z]/g) || []).length > 1) {
                  const termActive = activeInputs ? checkTerm(part) : false;
                  const gateOn = termActive && simulationStep >= 3;
                  graph += `    AND_${idx}(["AND"])${gateOn ? ":::on" : ":::off"}\n`;
              }
          });
      }
      graph += `  end\n`;

      // --- LAYER 3: OUTPUT ---
      graph += `  subgraph Results ["Layer 3: Output"]\n`;
      graph += `    direction TB\n`;
      if (orParts.length > 1) {
          const orOn = outputActive && simulationStep >= 4;
          graph += `    OR_GATE{{"OR"}}${orOn ? ":::on" : ":::off"}\n`;
      }
      const finalOn = outputActive && simulationStep >= 5;
      graph += `    Result((Output))${finalOn ? ":::on" : ":::off"}\n`;
      graph += `  end\n`;

      // --- CONNECTIONS ---
      if (orParts.length === 1) {
          const part = orParts[0];
          const partVars = part.match(/[A-Z]/g) || [];
          const isActive = activeInputs ? checkTerm(part) : false;
          
          if (partVars.length > 1) {
              graph += `  AND_MAIN(["AND"])${isActive && simulationStep >= 3 ? ":::on" : ":::off"}\n`;
              const finalWireHot = isActive && simulationStep >= 5;
              graph += `  AND_MAIN ${finalWireHot ? "==>" : "-.->"} Result\n`;
              addLinkStyle(finalWireHot);
              
              vars.forEach(v => {
                 if (part.includes(v)) {
                     const isNot = part.includes(v + "'");
                     let wireHot = activeInputs && simulationStep >= 2 && (isNot ? activeInputs[v]===0 : activeInputs[v]===1);
                     graph += `  ${v} ${wireHot ? "==>" : "-.->"} ${isNot ? "|NOT|" : ""} AND_MAIN\n`;
                     addLinkStyle(wireHot);
                 }
              });
          } else {
              const v = partVars[0];
              const isActive = activeInputs ? checkTerm(part) : false;
              let wireHot = isActive && simulationStep >= 5;
              graph += `  ${v} ${wireHot ? "==>" : "-.->"} Result\n`;
              addLinkStyle(wireHot);
          }
      } else {
          orParts.forEach((part, idx) => {
              const termActive = activeInputs ? checkTerm(part) : false;
              const partVars = part.match(/[A-Z]/g) || [];
              const gateName = `AND_${idx}`;

              if (partVars.length > 1) {
                  partVars.forEach(v => {
                       const isNot = part.includes(v + "'");
                       let wireHot = activeInputs && simulationStep >= 2 && (isNot ? activeInputs[v]===0 : activeInputs[v]===1);
                       graph += `    ${v} ${wireHot ? "==>" : "-.->"} ${isNot ? "|NOT|" : ""} ${gateName}\n`;
                       addLinkStyle(wireHot);
                  });
                  let wireToOrHot = termActive && simulationStep >= 4;
                  graph += `    ${gateName} ${wireToOrHot ? "==>" : "-.->"} OR_GATE\n`;
                  addLinkStyle(wireToOrHot);
              } else if (partVars.length === 1) {
                  const v = partVars[0];
                  const isNot = part.includes(v + "'");
                  let wireHot = activeInputs && simulationStep >= 4 && (isNot ? activeInputs[v]===0 : activeInputs[v]===1);
                  graph += `    ${v} ${wireHot ? "==>" : "-.->"} ${isNot ? "|NOT|" : ""} OR_GATE\n`;
                  addLinkStyle(wireHot);
              }
          });
          let finalWireHot = outputActive && simulationStep >= 5;
          graph += `    OR_GATE ${finalWireHot ? "==>" : "-.->"} Result\n`;
          addLinkStyle(finalWireHot);
      }

      graph += `classDef default fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#fff;\n`;
      graph += `classDef input fill:#111827,stroke:#3b82f6,stroke-width:2px;\n`;
      graph += `classDef on fill:#064e3b,stroke:#22c55e,stroke-width:3px,color:#fff;\n`;
      graph += `classDef off fill:#1f2937,stroke:#4b5563,stroke-width:1px,stroke-dasharray: 5 5,color:#9ca3af;\n`;
      graph += `classDef cluster fill:#1f2937,fill-opacity:0.5,stroke:#374151,stroke-width:2px,color:#fff;\n`;
      graph += `class Inputs,Processing,Results cluster;\n`;

      return graph;
    };

    const graphDefinition = generateGraph(targetExpr);
    
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      mermaidRef.current.removeAttribute('data-processed');
      
      const uniqueId = `circuit-${Date.now()}`;
      
      try {
        mermaid.render(uniqueId, graphDefinition)
          .then((result) => {
            if (mermaidRef.current) {
                mermaidRef.current.innerHTML = result.svg;
                setRenderError(null);
            }
          })
          .catch((err) => {
             console.error("Mermaid Failed:", err);
             setRenderError(err.message);
          });
      } catch (e) {
        setRenderError(e.message);
      }
    }
  }, [expression, simplified, activeInputs, simulationStep]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mt-6 relative">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                Circuit Simulation
                {activeInputs && <span className="text-green-400 ml-2 animate-pulse">• LIVE</span>}
            </h3>
            {activeInputs && (
                <div className="text-xs font-mono text-gray-500">
                    Step: {simulationStep}/5
                </div>
            )}
        </div>

        {/* --- UPDATED HINT SECTION --- */}
        {!activeInputs && !renderError && (
           <div 
             className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
             text-gray-400/50 pointer-events-none text-sm font-medium z-10 
             bg-gray-900/80 px-4 py-2 rounded border border-gray-800
             transition-opacity duration-1000 ease-in-out
             ${showHint ? 'opacity-100' : 'opacity-0'}`}
           >
             Click a Table Row to Start Simulation
           </div>
        )}

        {renderError && (
            <div className="text-red-400 text-center p-4 border border-red-500 rounded bg-red-900/20">
                <p>Circuit Render Error:</p>
                <code className="text-xs">{renderError}</code>
            </div>
        )}

        <div className="flex justify-center items-center overflow-x-auto min-h-[250px] bg-gray-950 rounded-lg border border-gray-800/50 p-4">
            <div ref={mermaidRef} className="w-full max-w-4xl" />
        </div>
    </div>
  );
};

export default CircuitDrawer;