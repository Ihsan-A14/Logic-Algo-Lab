import React, { useState, useEffect, useRef } from 'react';
import { BinarySearchTree, GeneralTree, calculateLayout } from '../../utils/treeAlgos';

const TreeVisualizer = () => {
  // --- STATE ---
  const [mode, setMode] = useState('BST'); // 'BST' or 'GENERAL'
  const [bstMode, setBstMode] = useState('AUTO'); // 'AUTO' (Logic) or 'MANUAL' (Left/Right)
  
  const [bst, setBst] = useState(new BinarySearchTree());
  const [genTree, setGenTree] = useState(new GeneralTree());
  const [visualRoot, setVisualRoot] = useState(null);
  
  // Interaction
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchStrategy, setSearchStrategy] = useState('logic'); // logic, bfs, dfs
  
  // Animation
  const [activeValue, setActiveValue] = useState(null);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#22c55e');

  // Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Init
  useEffect(() => {
    const tree = new BinarySearchTree();
    [50, 30, 70, 20, 40, 60, 80].forEach(n => tree.insert(n));
    setBst(tree);
    
    const gTree = new GeneralTree();
    const r = gTree.insert(null, "Root");
    setGenTree(gTree);
    setSelectedNodeId(r.id);

    const root = tree.getRootForLayout();
    calculateLayout(root);
    setVisualRoot(root);
    setTimeout(() => centerTree(root), 100); // Slight delay for ref
  }, []);

  const updateVisuals = (treeInstance) => {
      const rawRoot = treeInstance.getRootForLayout();
      if (rawRoot) calculateLayout(rawRoot);
      setVisualRoot(rawRoot);
  };

  const centerTree = (rootNode) => {
      if (!rootNode || !containerRef.current) return;
      const { clientWidth } = containerRef.current;
      setPan({ x: clientWidth / 2 - rootNode.x, y: 50 });
      setZoom(1);
  };

  // --- ACTIONS ---

  const handleInsert = (e) => {
    e.preventDefault();
    if (!inputValue && bstMode === 'AUTO') return;
    const val = isNaN(parseInt(inputValue)) ? inputValue : parseInt(inputValue);

    if (mode === 'BST') {
        const newTree = Object.assign(new BinarySearchTree(), bst);
        if (bstMode === 'AUTO') {
            newTree.insert(val);
        } else {
            // Manual Mode: Need selection
            alert("In Manual Binary Mode, use the 'Add Left' / 'Add Right' buttons below.");
            return;
        }
        setBst(newTree);
        updateVisuals(newTree);
    } else {
        // General Tree
        if (!selectedNodeId) { alert("Select a parent node first!"); return; }
        const newTree = Object.assign(new GeneralTree(), genTree);
        newTree.insert(selectedNodeId, val);
        setGenTree(newTree);
        updateVisuals(newTree);
    }
    setInputValue('');
  };

  const handleManualBinaryInsert = (side) => {
      if (!selectedNodeId) { alert("Select a parent node first!"); return; }
      if (!inputValue) { alert("Enter a value first!"); return; }
      const val = parseInt(inputValue);
      
      const newTree = Object.assign(new BinarySearchTree(), bst);
      const success = newTree.insertManual(selectedNodeId, val, side);
      
      if (!success) {
          alert(`Cannot add ${side} child. Spot might be taken or parent not found.`);
          return;
      }
      setBst(newTree);
      updateVisuals(newTree);
      setInputValue('');
  };

  const handleSearch = (e) => {
      e.preventDefault();
      if (isAnimating) return;
      const val = parseInt(searchValue);
      if (isNaN(val)) return; // Allow strings for General tree? keeping int for now

      setIsAnimating(true);
      setMessage(`Searching (${searchStrategy.toUpperCase()})...`);
      
      const tree = mode === 'BST' ? bst : genTree;
      // For General tree, force BFS if 'logic' is selected, as logic implies BST property
      const strategy = (mode === 'GENERAL' && searchStrategy === 'logic') ? 'bfs' : searchStrategy;
      
      const { found, path } = tree.getSearchAnimations(val, strategy);

      path.forEach((step, idx) => {
          setTimeout(() => {
              setActiveValue(step.value);
              if (idx === path.length - 1) {
                  if (found) {
                      setHighlightColor('#22c55e'); 
                      setMessage(`Found ${val}!`);
                  } else {
                      setHighlightColor('#ef4444');
                      setMessage(`${val} not found.`);
                  }
                  setTimeout(() => setIsAnimating(false), 1500);
              } else {
                  setHighlightColor('#eab308'); 
              }
          }, idx * 600);
      });
      setSearchValue('');
  };

  const animateTraversal = (type) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setMessage(`Running ${type}...`);
      setHighlightColor('#3b82f6'); 

      let order = [];
      const tree = mode === 'BST' ? bst : genTree;

      if (type === 'BFS') order = tree.getBFSAnimations();
      if (type === 'DFS (Pre)') order = tree.getDFSPreOrderAnimations();
      // In/Post only available for BST usually, but General can support Pre easily
      if (mode === 'BST') {
        if (type === 'DFS (In)') order = tree.getDFSInOrderAnimations();
        if (type === 'DFS (Post)') order = tree.getDFSPostOrderAnimations();
      }

      order.forEach((val, idx) => {
          setTimeout(() => {
              setActiveValue(val);
              if (idx === order.length - 1) {
                  setIsAnimating(false);
                  setMessage("Traversal Complete");
              }
          }, idx * 600);
      });
  };

  // --- CANVAS HANDLERS ---
  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const handleMouseMove = (e) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e) => {
      e.preventDefault();
      const scaleBy = 1.1;
      const newZoom = e.deltaY < 0 ? zoom * scaleBy : zoom / scaleBy;
      setZoom(Math.min(Math.max(0.2, newZoom), 3));
  };

  // --- RENDERERS ---
  const renderLinks = (node) => {
      if (!node) return null;
      return (
          <g key={`links-${node.id}`}>
              {node.children.map(child => (
                  <React.Fragment key={`link-${child.id}`}>
                      <line x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="#4b5563" strokeWidth="2" />
                      {renderLinks(child)}
                  </React.Fragment>
              ))}
          </g>
      );
  };

  const renderNodes = (node) => {
      if (!node) return null;
      const isSelected = selectedNodeId === node.id;
      const isAnimated = activeValue === node.value;
      
      let fillColor = '#1f2937';
      let strokeColor = '#3b82f6';

      if (isAnimated) { fillColor = highlightColor; strokeColor = '#fff'; }
      else if (isSelected) { fillColor = '#eab308'; strokeColor = '#fde047'; }

      return (
          <g key={`node-${node.id}`} 
             onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
             className="cursor-pointer transition-all duration-300"
          >
              {node.children.map(renderNodes)}
              <circle cx={node.x} cy={node.y} r="20" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
              <text x={node.x} y={node.y} dy=".35em" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                {node.value}
              </text>
          </g>
      );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. CONTROL PANEL */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-xl flex flex-col gap-4">
          
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-700 pb-4">
              {/* Tree Type Toggle */}
              <div className="flex bg-gray-900 rounded p-1">
                  <button onClick={() => { setMode('BST'); updateVisuals(bst); }}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase ${mode==='BST'?'bg-blue-600 text-white':'text-gray-400'}`}>
                      Binary Tree
                  </button>
                  <button onClick={() => { setMode('GENERAL'); updateVisuals(genTree); }}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase ${mode==='GENERAL'?'bg-purple-600 text-white':'text-gray-400'}`}>
                      General Tree
                  </button>
              </div>

              {/* Binary Mode Toggle */}
              {mode === 'BST' && (
                  <div className="flex items-center gap-2 bg-gray-900 px-2 py-1 rounded">
                      <span className="text-[10px] uppercase font-bold text-gray-500">Insertion:</span>
                      <button onClick={() => setBstMode('AUTO')} className={`text-xs font-bold px-2 py-1 rounded ${bstMode==='AUTO'?'bg-green-600 text-white':'text-gray-400'}`}>Auto (Sort)</button>
                      <button onClick={() => setBstMode('MANUAL')} className={`text-xs font-bold px-2 py-1 rounded ${bstMode==='MANUAL'?'bg-orange-600 text-white':'text-gray-400'}`}>Manual</button>
                  </div>
              )}

              <div className="flex gap-2">
                   <button onClick={() => centerTree(visualRoot)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs font-bold uppercase">Recenter</button>
              </div>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
              {/* INSERTION SECTION */}
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] text-gray-500 uppercase font-bold">Add Node</label>
                 <div className="flex gap-2">
                    <input value={inputValue} onChange={e=>setInputValue(e.target.value)}
                           className="bg-gray-900 border border-gray-600 text-white px-2 py-1 rounded w-20 outline-none" placeholder="Val" />
                    
                    {(mode === 'GENERAL' || (mode === 'BST' && bstMode === 'MANUAL')) ? (
                        <>
                           {mode === 'BST' ? (
                               <>
                                <button onClick={() => handleManualBinaryInsert('left')} className="bg-orange-600 px-2 py-1 rounded text-white font-bold text-xs">L</button>
                                <button onClick={() => handleManualBinaryInsert('right')} className="bg-orange-600 px-2 py-1 rounded text-white font-bold text-xs">R</button>
                               </>
                           ) : (
                                <button onClick={handleInsert} className="bg-purple-600 px-3 py-1 rounded text-white font-bold text-sm">Add Child</button>
                           )}
                        </>
                    ) : (
                        <button onClick={handleInsert} className="bg-blue-600 px-3 py-1 rounded text-white font-bold text-sm">Insert</button>
                    )}
                 </div>
              </div>

              {/* SEARCH SECTION */}
              <form onSubmit={handleSearch} className="flex flex-col gap-1">
                 <label className="text-[10px] text-gray-500 uppercase font-bold">Search</label>
                 <div className="flex gap-2">
                    <input type="number" value={searchValue} onChange={e=>setSearchValue(e.target.value)}
                           className="bg-gray-900 border border-gray-600 text-white px-2 py-1 rounded w-20 outline-none" placeholder="Find" />
                    
                    <select value={searchStrategy} onChange={(e) => setSearchStrategy(e.target.value)} 
                            className="bg-gray-900 border border-gray-600 text-white text-xs rounded px-1 outline-none">
                        <option value="logic">Smart</option>
                        <option value="bfs">BFS</option>
                        <option value="dfs">DFS</option>
                    </select>

                    <button type="submit" className="bg-yellow-600 px-3 py-1 rounded text-white font-bold text-sm">Go</button>
                 </div>
              </form>

              {/* TRAVERSALS SECTION */}
              <div className="flex flex-col gap-1 ml-auto">
                 <label className="text-[10px] text-gray-500 uppercase font-bold text-right">Traversal</label>
                 <div className="flex gap-1">
                    <button onClick={() => animateTraversal('BFS')} disabled={isAnimating} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-[10px] uppercase font-bold rounded text-gray-300">BFS</button>
                    <button onClick={() => animateTraversal('DFS (Pre)')} disabled={isAnimating} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-[10px] uppercase font-bold rounded text-gray-300">Pre</button>
                    {mode === 'BST' && (
                        <>
                        <button onClick={() => animateTraversal('DFS (In)')} disabled={isAnimating} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-[10px] uppercase font-bold rounded text-gray-300">In</button>
                        <button onClick={() => animateTraversal('DFS (Post)')} disabled={isAnimating} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-[10px] uppercase font-bold rounded text-gray-300">Post</button>
                        </>
                    )}
                 </div>
              </div>
          </div>
          
          <div className="text-center font-mono font-bold text-green-400 text-sm h-5">
              {message}
          </div>
      </div>

      {/* 2. CANVAS */}
      <div ref={containerRef} className="h-[600px] w-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative cursor-move"
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel}
      >
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)', backgroundSize: '20px 20px', transform: `translate(${pan.x%20}px, ${pan.y%20}px)` }} />
          
          <svg className="w-full h-full" style={{ touchAction: 'none' }}>
             <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                 {renderLinks(visualRoot)}
                 {renderNodes(visualRoot)}
             </g>
          </svg>
      </div>
    </div>
  );
};

export default TreeVisualizer;