import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false, 
  theme: 'base',
  securityLevel: 'loose',
  flowchart: { 
    curve: 'stepAfter',
    rankSpacing: 50,
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
  const [showHint, setShowHint] = useState(true);
  const [viewMode, setViewMode] = useState('simplified');

  // Hint Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Animation Timer
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

  // --- MAIN RENDER LOGIC ---
  useEffect(() => {
    const rawExpr = (viewMode === 'simplified' ? (simplified || expression) : expression) || "";
    if (!rawExpr) return;

    // --- SHARED HELPERS ---
    let graph = `flowchart LR\n`;
    let linkCounter = 0; 

    // Extract variables properly
    const vars = [...new Set(rawExpr.match(/[A-Z]/g))].sort();

    const evaluate = (subExpr) => {
        if (!activeInputs) return false;
        try {
            // Handle constants
            if (subExpr === '1') return true;
            if (subExpr === '0') return false;

            // Handle implied multiplication (AB -> A*B)
            let safeExpr = subExpr.replace(/([A-Z])([A-Z])/g, '$1*$2');
            safeExpr = safeExpr.replace(/\+/g, '||').replace(/\*/g, '&&').replace(/([A-Z])'/g, '!$1');
            const func = new Function(...vars, `return !!(${safeExpr})`);
            const args = vars.map(v => activeInputs[v] === 1);
            return func(...args);
        } catch (e) { return false; }
    };

    const addWire = (from, to, isActive, label = "") => {
        const color = isActive ? "#22c55e" : "#4b5563";
        const width = isActive ? "3px" : "1px";
        const arrow = isActive ? "==>" : "-.->";
        graph += `  ${from} ${arrow} ${label} ${to}\n`;
        graph += `linkStyle ${linkCounter} stroke:${color},stroke-width:${width};\n`;
        linkCounter++;
    };

    // --- ENGINE 1: SIMPLIFIED (Robust Sum of Products) ---
    const renderSimplified = (expr) => {
        // 0. Handle Constants (Tautology/Contradiction)
        if (expr === '1' || expr === '0') {
             graph += `  CONST[${expr === '1' ? 'Always True' : 'Always False'}]:::${expr === '1' ? 'on' : 'off'}\n`;
             graph += `  Result((Output)):::${expr === '1' ? 'on' : 'off'}\n`;
             addWire("CONST", "Result", expr === '1');
             // Add styles manually here since we skip the rest
             graph += `classDef on fill:#064e3b,stroke:#22c55e,stroke-width:3px,color:#fff;\n`;
             graph += `classDef off fill:#1f2937,stroke:#4b5563,stroke-width:1px,stroke-dasharray: 5 5,color:#9ca3af;\n`;
             return; 
        }

        // 1. Inputs
        graph += `  subgraph Inputs ["Inputs"]\n    direction TB\n`;
        vars.forEach(v => {
            const isActive = activeInputs && activeInputs[v] === 1 && simulationStep >= 1;
            graph += `    ${v}["${v} ${isActive ? '(1)' : '(0)'}"]${isActive ? ":::on" : ":::off"}\n`;
        });
        graph += `  end\n`;

        // 2. Parse (Handle "A + B" vs "AB" vs "A")
        // Remove spaces
        const cleanExpr = expr.replace(/\s/g, '');
        const parts = cleanExpr.split('+');
        const outputActive = evaluate(cleanExpr);

        // 3. Logic Layer (The Middle)
        // We only draw a "Gate Layer" if there is actual logic to do.
        // If the expression is just "A", we skip this layer.
        
        const needsAndGates = parts.some(p => p.length > 1 || p.includes('*'));
        
        if (needsAndGates) {
            graph += `  subgraph Gates ["Logic Gates"]\n    direction TB\n`;
            parts.forEach((part, idx) => {
                const isComplex = part.length > 1 || part.includes('*');
                if (isComplex) {
                    const isActive = evaluate(part);
                    const gateOn = isActive && simulationStep >= 3;
                    graph += `    AND_${idx}(["AND"])${gateOn ? ":::on" : ":::off"}\n`;
                }
            });
            graph += `  end\n`;
        }

        // 4. Output Layer
        // We need an OR gate ONLY if we have multiple parts (e.g. A + B)
        graph += `  subgraph Output ["Output"]\n    direction TB\n`;
        
        if (parts.length > 1) {
            const orOn = outputActive && simulationStep >= 4;
            graph += `    OR_GATE{{"OR"}}${orOn ? ":::on" : ":::off"}\n`;
        }
        
        // Final Output Bulb
        const resOn = outputActive && simulationStep >= 5;
        graph += `    Result((Output))${resOn ? ":::on" : ":::off"}\n`;
        graph += `  end\n`;

        // 5. Wiring (Connecting it all)
        parts.forEach((part, idx) => {
            const partVars = part.match(/[A-Z]/g) || [];
            const isComplex = part.length > 1 || part.includes('*');
            const partActive = evaluate(part);

            if (isComplex) {
                // SCENARIO: Complex Term (e.g. "AB" or "A'B")
                // 1. Wire Inputs -> AND Gate
                partVars.forEach(v => {
                     const isNot = part.includes(v + "'");
                     const val = activeInputs ? activeInputs[v] : 0;
                     const match = isNot ? (val === 0) : (val === 1);
                     const hot = simulationStep >= 2 && match;
                     addWire(v, `AND_${idx}`, hot, isNot ? "|NOT|" : "");
                });

                // 2. Wire AND Gate -> Next Stage
                if (parts.length > 1) {
                    // AND -> OR
                    addWire(`AND_${idx}`, "OR_GATE", partActive && simulationStep >= 4);
                } else {
                    // AND -> Output (Direct)
                    addWire(`AND_${idx}`, "Result", partActive && simulationStep >= 5);
                }
            } else {
                // SCENARIO: Simple Term (e.g. "A")
                const v = partVars[0];
                const isNot = part.includes(v + "'");
                const val = activeInputs ? activeInputs[v] : 0;
                const match = isNot ? (val === 0) : (val === 1);

                if (parts.length > 1) {
                    // A -> OR
                    addWire(v, "OR_GATE", simulationStep >= 4 && match, isNot ? "|NOT|" : "");
                } else {
                    // A -> Output (Direct Wire)
                    addWire(v, "Result", simulationStep >= 5 && match, isNot ? "|NOT|" : "");
                }
            }
        });

        // Final OR -> Output Connection
        if (parts.length > 1) {
            addWire("OR_GATE", "Result", outputActive && simulationStep >= 5);
        }
    };

    // --- ENGINE 2: ORIGINAL (Structure Preserving) ---
    const renderOriginal = (expr) => {
        let clean = expr.replace(/\s/g, '');
        // Remove strictly wrapping parens: (A+B) -> A+B
        if (clean.match(/^\([^)]+\)$/) && !clean.includes(') * (') && !clean.includes(') + (')) {
            clean = clean.replace(/^\((.*)\)$/, '$1');
        }

        // Detect Main Operator
        let topOp = 'OR';
        let splitChar = '+';
        let depth = 0;
        let foundPlus = false;
        
        for (let c of clean) {
            if (c === '(') depth++;
            else if (c === ')') depth--;
            else if (c === '+' && depth === 0) foundPlus = true;
        }

        if (!foundPlus) {
            topOp = 'AND';
            splitChar = '*';
        }

        // Split
        let parts = [];
        let curr = "";
        depth = 0;
        for (let c of clean) {
            if (c === '(') depth++;
            else if (c === ')') depth--;
            
            if (c === splitChar && depth === 0) {
                parts.push(curr);
                curr = "";
            } else {
                curr += c;
            }
        }
        if (curr) parts.push(curr);

        // Inputs
        graph += `  subgraph Inputs ["Inputs"]\n    direction TB\n`;
        vars.forEach(v => {
            const isActive = activeInputs && activeInputs[v] === 1 && simulationStep >= 1;
            graph += `    ${v}["${v} ${isActive ? '(1)' : '(0)'}"]${isActive ? ":::on" : ":::off"}\n`;
        });
        graph += `  end\n`;

        // Gates
        graph += `  subgraph Gates ["Logic Gates"]\n    direction TB\n`;
        parts.forEach((part, idx) => {
            const isGroup = part.includes('+') || part.includes('*') || part.length > 2;
            if (isGroup) {
                const isActive = evaluate(part);
                const gateOn = isActive && simulationStep >= 3;
                const subType = topOp === 'AND' ? 'OR' : 'AND';
                const shapeL = subType === 'AND' ? '([' : '{{';
                const shapeR = subType === 'AND' ? '])' : '}}';
                graph += `    SUB_${idx}${shapeL}"${subType}"${shapeR}${gateOn ? ":::on" : ":::off"}\n`;
            }
        });
        graph += `  end\n`;

        // Output
        graph += `  subgraph Output ["Output"]\n    direction TB\n`;
        const outActive = evaluate(clean);
        if (parts.length > 1) {
            const finalOn = outActive && simulationStep >= 4;
            const shapeL = topOp === 'AND' ? '([' : '{{';
            const shapeR = topOp === 'AND' ? '])' : '}}';
            graph += `    FINAL${shapeL}"${topOp}"${shapeR}${finalOn ? ":::on" : ":::off"}\n`;
        }
        graph += `    Result((Output))${outActive && simulationStep >= 5 ? ":::on" : ":::off"}\n`;
        graph += `  end\n`;

        // Wiring
        parts.forEach((part, idx) => {
            const partVars = part.match(/[A-Z]/g) || [];
            const isGroup = part.includes('+') || part.includes('*') || part.length > 2;
            const partActive = evaluate(part);

            if (isGroup) {
                partVars.forEach(v => {
                     const isNot = part.includes(v + "'");
                     const val = activeInputs ? activeInputs[v] : 0;
                     const match = isNot ? (val === 0) : (val === 1);
                     const hot = simulationStep >= 2 && match;
                     addWire(v, `SUB_${idx}`, hot, isNot ? "|NOT|" : "");
                });
                if (parts.length > 1) addWire(`SUB_${idx}`, "FINAL", partActive && simulationStep >= 4);
                else addWire(`SUB_${idx}`, "Result", partActive && simulationStep >= 5);
            } else {
                const v = partVars[0];
                const isNot = part.includes(v + "'");
                const val = activeInputs ? activeInputs[v] : 0;
                const match = isNot ? (val === 0) : (val === 1);
                
                if (parts.length > 1) addWire(v, "FINAL", simulationStep >= 4 && match, isNot ? "|NOT|" : "");
                else addWire(v, "Result", simulationStep >= 5 && match, isNot ? "|NOT|" : "");
            }
        });

        if (parts.length > 1) addWire("FINAL", "Result", outActive && simulationStep >= 5);
    };

    // --- EXECUTE ---
    if (viewMode === 'simplified') {
        renderSimplified(rawExpr);
    } else {
        renderOriginal(rawExpr);
    }

    // --- STYLES ---
    graph += `classDef default fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#fff;\n`;
    graph += `classDef input fill:#111827,stroke:#3b82f6,stroke-width:2px;\n`;
    graph += `classDef on fill:#064e3b,stroke:#22c55e,stroke-width:3px,color:#fff;\n`;
    graph += `classDef off fill:#1f2937,stroke:#4b5563,stroke-width:1px,stroke-dasharray: 5 5,color:#9ca3af;\n`;
    graph += `classDef cluster fill:#1f2937,fill-opacity:0.5,stroke:#374151,stroke-width:2px,color:#fff;\n`;
    graph += `class Inputs,Gates,Output cluster;\n`;

    // Render
    if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
        const uniqueId = `circuit-${Date.now()}`;
        try {
            mermaid.render(uniqueId, graph).then(r => mermaidRef.current.innerHTML = r.svg);
            setRenderError(null);
        } catch (e) {
            setRenderError("Circuit too complex to render.");
        }
    }

  }, [expression, simplified, activeInputs, simulationStep, viewMode]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 mt-6 relative">
        <div className="flex justify-between items-start mb-4">
             <div>
                 <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                    Circuit Simulation
                    {activeInputs && <span className="text-green-400 ml-2 animate-pulse">• LIVE</span>}
                </h3>
                {activeInputs && (
                    <div className="text-xs font-mono text-gray-500 mt-1">
                        Step: {simulationStep}/5
                    </div>
                )}
             </div>

             <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                    onClick={() => setViewMode('original')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        viewMode === 'original' 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Original
                </button>
                <button
                    onClick={() => setViewMode('simplified')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        viewMode === 'simplified' 
                        ? 'bg-green-600 text-white shadow' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    Simplified
                </button>
             </div>
        </div>

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
            <div className="text-yellow-400 text-center p-8 border border-yellow-500/50 rounded bg-yellow-900/10">
                <p className="font-bold">⚠️ View Unavailable</p>
                <p className="text-sm mt-2 opacity-80">{renderError}</p>
            </div>
        )}

        <div className="flex justify-center items-center overflow-x-auto min-h-[250px] bg-gray-950 rounded-lg border border-gray-800/50 p-4">
            <div ref={mermaidRef} className="w-full max-w-4xl" />
        </div>
    </div>
  );
};

export default CircuitDrawer;