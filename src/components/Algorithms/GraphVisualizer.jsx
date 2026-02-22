import React, { useState, useEffect, useRef } from 'react';
import { getBFSAnimations, getDFSAnimations, getDijkstraAnimations, getAStarAnimations } from '../../utils/graphAlgos';

// --- EDUCATIONAL DATA ---
const ALGO_INFO = {
  BFS: {
    name: 'Breadth-First Search',
    complexity: 'O(V + E)',
    desc: 'Explores the graph layer by layer. It starts at the root and explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
    bestFor: 'Finding the shortest path in unweighted graphs.',
    cons: 'Slow on large graphs; ignores edge weights.'
  },
  DFS: {
    name: 'Depth-First Search',
    complexity: 'O(V + E)',
    desc: 'Explores as far as possible along each branch before backtracking. It is useful for topological sorting or maze generation, but does NOT guarantee the shortest path.',
    bestFor: 'Pathfinding in mazes, checking connectivity.',
    cons: 'Can get lost in infinite loops; paths are often long and winding.'
  },
  Dijkstra: {
    name: "Dijkstra's Algorithm",
    complexity: 'O(E log V)',
    desc: 'The gold standard for weighted graphs. It guarantees the shortest path by always expanding the cheapest known node first. It calculates the distance from the start to every other node.',
    bestFor: 'Road networks, routing protocols.',
    cons: 'Slower than A* because it explores in all directions blindly.'
  },
  'A*': {
    name: 'A* (A-Star) Search',
    complexity: 'O(E)',
    desc: 'The smartest algorithm. It uses a "heuristic" (estimate of distance to target) to guide the search towards the destination. It combines the best parts of Dijkstra and Best-First Search.',
    bestFor: 'Games, GPS navigation, robotics.',
    cons: 'Performance depends heavily on the heuristic function.'
  }
};

const GraphVisualizer = () => {
  // --- STATE ---
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [gridSize, setGridSize] = useState(30);
  const [activeAlgo, setActiveAlgo] = useState('BFS'); // Tab State
  
  // Graph Logic
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  
  // Animation State
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [pathNodes, setPathNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("Ready to run");
  const [pathStats, setPathStats] = useState(null); // { length: 0, cost: 0 }
  
  const containerRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    generateGraph();
  }, [gridSize]);

  // Reset visuals when switching tabs
  useEffect(() => {
      setVisitedNodes([]);
      setPathNodes([]);
      setPathStats(null);
      setMessage(`Switched to ${activeAlgo}`);
  }, [activeAlgo]);

  const generateGraph = () => {
    if (!containerRef.current) return;
    setIsAnimating(false);
    setVisitedNodes([]);
    setPathNodes([]);
    setPathStats(null);
    
    const { clientWidth, clientHeight } = containerRef.current;
    const newNodes = [];
    const newEdges = [];
    
    // 1. Generate Nodes
    const margin = 50;
    for (let i = 0; i < gridSize; i++) {
        newNodes.push({
            id: i,
            x: margin + Math.random() * (clientWidth - margin * 2),
            y: margin + Math.random() * (clientHeight - margin * 2)
        });
    }

    // 2. Generate Edges (K-Nearest)
    newNodes.forEach((node, i) => {
        const neighbors = newNodes
            .map((n, idx) => ({ 
                id: idx, 
                dist: Math.hypot(n.x - node.x, n.y - node.y) 
            }))
            .filter(n => n.id !== i)
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 3); 

        neighbors.forEach(neighbor => {
            const edgeExists = newEdges.some(e => 
                (e.source === i && e.target === neighbor.id) || 
                (e.source === neighbor.id && e.target === i)
            );
            if (!edgeExists) {
                newEdges.push({ source: i, target: neighbor.id, weight: Math.floor(neighbor.dist) });
            }
        });
    });

    // 3. Pick Start/End
    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(0);
    setEndNode(gridSize - 1);
    setMessage(`Generated ${gridSize} nodes.`);
  };

  const runAlgorithm = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      setVisitedNodes([]);
      setPathNodes([]);
      setPathStats(null);
      setMessage(`Running ${activeAlgo}...`);

      let result = { visitedOrder: [], path: [] };
      
      if (activeAlgo === 'BFS') result = getBFSAnimations(nodes, edges, startNode, endNode);
      if (activeAlgo === 'DFS') result = getDFSAnimations(nodes, edges, startNode, endNode);
      if (activeAlgo === 'Dijkstra') result = getDijkstraAnimations(nodes, edges, startNode, endNode);
      if (activeAlgo === 'A*') result = getAStarAnimations(nodes, edges, startNode, endNode);

      // Animation Loop
      const visitedDelay = 15;
      
      result.visitedOrder.forEach((nodeId, i) => {
          setTimeout(() => {
              setVisitedNodes(prev => [...prev, nodeId]);
              
              if (i === result.visitedOrder.length - 1) {
                  if (result.path.length > 0) {
                      animatePath(result.path);
                  } else {
                      setMessage("No path found!");
                      setIsAnimating(false);
                  }
              }
          }, i * visitedDelay);
      });
  };

  const animatePath = (path) => {
      path.forEach((nodeId, i) => {
          setTimeout(() => {
              setPathNodes(prev => [...prev, nodeId]);
              if (i === path.length - 1) {
                  setIsAnimating(false);
                  setMessage("Target Reached! 🚩");
                  // Calculate Stats
                  let totalDistance = 0;
                  for(let k=0; k<path.length-1; k++) {
                      const n1 = nodes[path[k]];
                      const n2 = nodes[path[k+1]];
                      totalDistance += Math.hypot(n1.x - n2.x, n1.y - n2.y);
                  }
                  setPathStats({
                      nodes: path.length,
                      cost: Math.round(totalDistance)
                  });
              }
          }, i * 50);
      });
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. TABS & CONTROLS */}
      <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-xl flex flex-col">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-gray-900 rounded mb-4">
              {['BFS', 'DFS', 'Dijkstra', 'A*'].map(algo => (
                  <button
                    key={algo}
                    onClick={() => setActiveAlgo(algo)}
                    disabled={isAnimating}
                    className={`flex-1 py-2 text-sm font-bold uppercase rounded transition-all ${
                        activeAlgo === algo 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                      {algo}
                  </button>
              ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-2">
              <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Map Size</span>
                  <div className="flex items-center gap-2">
                      <input 
                          type="range" min="10" max="1000" step="5"
                          value={gridSize} 
                          onChange={(e) => setGridSize(parseInt(e.target.value))}
                          disabled={isAnimating}
                          className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-xs font-mono text-gray-300 w-8">{gridSize}</span>
                  </div>
              </div>

              <div className="flex gap-2">
                  <button 
                    onClick={generateGraph} 
                    disabled={isAnimating}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold text-xs uppercase disabled:opacity-50"
                  >
                    🎲 New Map
                  </button>
                  <button 
                    onClick={runAlgorithm} 
                    disabled={isAnimating}
                    className={`px-6 py-2 rounded font-bold text-xs uppercase text-white shadow-lg transition-all ${
                        isAnimating ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'
                    }`}
                  >
                    {isAnimating ? 'Running...' : 'Run Algorithm ▶'}
                  </button>
              </div>
          </div>
      </div>

      {/* 2. CANVAS */}
      <div 
         ref={containerRef}
         className="h-[500px] w-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative shadow-inner"
      >
         <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
         
         <svg className="w-full h-full pointer-events-none">
             {edges.map((edge, i) => {
                 const start = nodes[edge.source];
                 const end = nodes[edge.target];
                 if (!start || !end) return null;
                 
                 const isPathEdge = pathNodes.includes(edge.source) && pathNodes.includes(edge.target) && 
                                    Math.abs(pathNodes.indexOf(edge.source) - pathNodes.indexOf(edge.target)) === 1;
                 
                 return (
                     <line 
                        key={i} 
                        x1={start.x} y1={start.y} x2={end.x} y2={end.y} 
                        stroke={isPathEdge ? "#facc15" : "#374151"} 
                        strokeWidth={isPathEdge ? "3" : "1"}
                        className="transition-colors duration-300"
                     />
                 );
             })}
             {nodes.map(node => {
                 const isStart = node.id === startNode;
                 const isEnd = node.id === endNode;
                 const isPath = pathNodes.includes(node.id);
                 const isVisited = visitedNodes.includes(node.id);

                 let fill = "#1f2937"; 
                 let stroke = "#4b5563"; 
                 let r = 5;
                 
                 if (isVisited) { fill = "#3b82f6"; stroke = "#60a5fa"; } 
                 if (isPath) { fill = "#facc15"; stroke = "#fef08a"; r = 7; } 
                 
                 if (isStart) { fill = "#22c55e"; stroke = "#86efac"; r = 10; } 
                 if (isEnd) { fill = "#ef4444"; stroke = "#fca5a5"; r = 10; } 

                 return (
                     <g key={node.id} style={{ transition: 'all 0.3s ease' }}>
                         {(isStart || isEnd) && (
                             <circle 
                               cx={node.x} cy={node.y} r={18} 
                               fill="none" stroke={fill} strokeWidth="2" 
                               className="animate-ping opacity-75"
                               style={{ transformBox: 'fill-box', transformOrigin: 'center' }} 
                             />
                         )}
                         <circle 
                            cx={node.x} cy={node.y} r={r} 
                            fill={fill} stroke={stroke} strokeWidth="2" 
                            className="transition-all duration-300"
                         />
                     </g>
                 );
             })}
         </svg>
      </div>

      {/* 3. INFO & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Algo Info */}
          <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{ALGO_INFO[activeAlgo].name}</h3>
                  <span className="bg-gray-900 text-yellow-400 text-xs font-mono px-2 py-1 rounded border border-gray-600">
                      {ALGO_INFO[activeAlgo].complexity}
                  </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{ALGO_INFO[activeAlgo].desc}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-green-900/20 p-2 rounded border border-green-800/50">
                      <strong className="text-green-400 block mb-1">Best For:</strong>
                      <span className="text-gray-300">{ALGO_INFO[activeAlgo].bestFor}</span>
                  </div>
                  <div className="bg-red-900/20 p-2 rounded border border-red-800/50">
                      <strong className="text-red-400 block mb-1">Downside:</strong>
                      <span className="text-gray-300">{ALGO_INFO[activeAlgo].cons}</span>
                  </div>
              </div>
          </div>

          {/* Results Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col justify-center">
              <h4 className="text-gray-500 font-bold uppercase text-xs mb-4">Run Results</h4>
              
              {pathStats ? (
                  <div className="space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                          <span className="text-gray-400 text-sm">Nodes Visited</span>
                          <span className="text-2xl font-mono text-blue-400 font-bold">{visitedNodes.length}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                          <span className="text-gray-400 text-sm">Path Nodes</span>
                          <span className="text-2xl font-mono text-yellow-400 font-bold">{pathStats.nodes}</span>
                      </div>
                      <div className="flex justify-between items-end">
                          <span className="text-gray-400 text-sm">Total Distance</span>
                          <span className="text-2xl font-mono text-green-400 font-bold">{pathStats.cost}</span>
                      </div>
                  </div>
              ) : (
                  <div className="text-center text-gray-600 py-4 italic">
                      {isAnimating ? 'Calculating...' : 'Run algorithm to see stats'}
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};

export default GraphVisualizer;