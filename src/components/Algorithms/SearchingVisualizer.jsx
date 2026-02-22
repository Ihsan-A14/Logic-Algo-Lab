import React, { useState, useEffect, useRef } from 'react';
import { getLinearSearchAnimations, getBinarySearchAnimations } from '../../utils/searchingAlgos';

// --- EDUCATIONAL CONTENT ---
const SEARCH_INFO = {
  linear: {
    name: 'Linear Search',
    time: 'O(N)',
    space: 'O(1)',
    desc: 'The simplest search algorithm. It checks every single element in the list sequentially until it finds the target value. It works on both sorted and unsorted lists.',
    pros: 'Simple to implement, works on unsorted data.',
    cons: 'Very slow for large datasets.',
    example: 'List: [10, 50, 30, 70], Target: 30 \n1. Check 10 (No)\n2. Check 50 (No)\n3. Check 30 (YES!)'
  },
  binary: {
    name: 'Binary Search',
    time: 'O(log N)',
    space: 'O(1)',
    desc: 'A fast "Divide and Conquer" algorithm. It compares the target to the middle element. If they are not equal, the half in which the target cannot lie is eliminated. The search continues on the remaining half.',
    note: '⚠️ Data MUST be sorted first!',
    pros: 'Extremely fast for large datasets.',
    cons: 'Requires the array to be sorted.',
    example: 'List: [10, 20, 30, 40, 50, 60, 70], Target: 60 \n1. Mid is 40. (60 > 40) → Discard Left Half.\n2. Remaining: [50, 60, 70]. Mid is 60. (YES!)'
  }
};

const SearchingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(null);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [algo, setAlgo] = useState('linear'); 

  const timeouts = useRef([]);

  // 1. Initialize & Handle Algo Change
  useEffect(() => {
    resetArray();
    return () => clearTimeouts();
  }, [algo]);

  // 2. FORCE STYLE RESET whenever array changes (Fixes "Phantom Highlight" bug)
  useEffect(() => {
    const bars = document.getElementsByClassName('search-box');
    for (let bar of bars) {
      bar.style.backgroundColor = '#1f2937'; // gray-800
      bar.style.borderColor = '#374151'; // gray-700
      bar.style.opacity = '1';
      bar.style.transform = 'scale(1)';
      bar.style.color = '#9ca3af'; // gray-400
      bar.style.boxShadow = 'none';
    }
  }, [array]);

  const clearTimeouts = () => {
    timeouts.current.forEach(t => clearTimeout(t));
    timeouts.current = [];
  };

  const resetArray = () => {
    clearTimeouts();
    setIsSearching(false);
    setFoundIndex(-1);
    setMessage("");
    
    // Generate Array
    const newArray = [];
    for (let i = 0; i < 28; i++) {
      newArray.push(Math.floor(Math.random() * 99) + 1);
    }
    
    // Binary Search REQUIRES sorted data
    if (algo === 'binary') {
        newArray.sort((a, b) => a - b);
    }
    
    setArray(newArray);
    
    // Pick Target (80% chance to be in array)
    const randomTarget = Math.random() > 0.2 
      ? newArray[Math.floor(Math.random() * newArray.length)] 
      : Math.floor(Math.random() * 100);
      
    setTarget(randomTarget);
  };

  const runSearch = () => {
    if (isSearching) return;
    setIsSearching(true);
    setFoundIndex(-1);
    setMessage("Scanning...");
    
    const animations = algo === 'linear' 
        ? getLinearSearchAnimations(array, target)
        : getBinarySearchAnimations(array, target);

    if (animations.length === 0) {
        setMessage("Target not found!");
        setIsSearching(false);
        return;
    }

    for (let i = 0; i < animations.length; i++) {
      const [type, idx1, idx2] = animations[i];
      const bars = document.getElementsByClassName('search-box');

      const timeout = setTimeout(() => {
        if (!bars[idx1]) return;

        if (type === "compare") {
            // Yellow for checking
            bars[idx1].style.backgroundColor = '#fbbf24'; 
            bars[idx1].style.borderColor = '#f59e0b';
            bars[idx1].style.color = '#000';
            bars[idx1].style.transform = 'scale(1.1)';
            bars[idx1].style.boxShadow = '0 0 10px #fbbf24';
        } 
        else if (type === "discard") {
            // Grey out discarded elements
            if (algo === 'linear') {
                bars[idx1].style.opacity = '0.2';
                bars[idx1].style.transform = 'scale(1)';
                bars[idx1].style.boxShadow = 'none';
            } else {
                // Binary discards ranges
                for (let k = idx1; k <= idx2; k++) {
                    if (bars[k]) {
                        bars[k].style.opacity = '0.2';
                        bars[k].style.transform = 'scale(1)';
                        bars[k].style.boxShadow = 'none';
                    }
                }
            }
        } 
        else if (type === "found") {
            // Green for found
            bars[idx1].style.backgroundColor = '#22c55e';
            bars[idx1].style.borderColor = '#15803d';
            bars[idx1].style.color = '#fff';
            bars[idx1].style.transform = 'scale(1.25)';
            bars[idx1].style.boxShadow = '0 0 20px #22c55e';
            bars[idx1].style.zIndex = '10';
            setFoundIndex(idx1);
            setMessage(`Found at Index ${idx1}!`);
        }
      }, i * (algo === 'binary' ? 800 : 150)); // Binary slower for readability
      
      timeouts.current.push(timeout);
    }

    const finalTimeout = setTimeout(() => {
        setIsSearching(false);
        const wasFound = animations[animations.length-1][0] === "found";
        if (!wasFound) setMessage("Target not present.");
    }, animations.length * (algo === 'binary' ? 800 : 150));
    timeouts.current.push(finalTimeout);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. CONTROLS HEADER */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-6">
            
            {/* Algo Tabs */}
            <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setAlgo('linear')}
                    disabled={isSearching}
                    className={`px-6 py-2 rounded-md font-bold transition-all text-sm uppercase tracking-wide ${
                        algo === 'linear' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    } ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Linear
                </button>
                <button
                    onClick={() => setAlgo('binary')}
                    disabled={isSearching}
                    className={`px-6 py-2 rounded-md font-bold transition-all text-sm uppercase tracking-wide ${
                        algo === 'binary' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                    } ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Binary
                </button>
            </div>

            {/* Target Display */}
            <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Target Number</span>
                <div className="text-4xl font-mono text-yellow-400 font-bold bg-gray-900 px-6 py-2 rounded border border-gray-700 shadow-inner">
                    {target}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button 
                    onClick={resetArray} 
                    disabled={isSearching}
                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors disabled:opacity-50"
                >
                    Shuffle Data
                </button>
                <button 
                    onClick={runSearch} 
                    disabled={isSearching}
                    className={`px-6 py-3 rounded-lg text-white font-bold transition-all shadow-lg flex items-center gap-2 ${
                        isSearching ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'
                    }`}
                >
                    {isSearching ? 'Scanning...' : 'Start Search ▶'}
                </button>
            </div>
        </div>
        
        {/* Live Status Message */}
        <div className="mt-6 text-center h-6 font-mono font-bold text-lg text-green-400">
            {message}
        </div>
      </div>

      {/* 2. VISUALIZATION GRID */}
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 flex flex-wrap justify-center gap-3 min-h-[300px] content-center relative">
         {/* Sort Warning for Binary */}
         {algo === 'binary' && !isSearching && (
             <div className="absolute top-2 right-2 text-[10px] uppercase font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20">
                 Data Sorted Automatically
             </div>
         )}
         
         {array.map((value, idx) => (
             <div 
                key={idx}
                className="search-box w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 border-gray-700 bg-gray-800 text-gray-400 font-bold text-lg md:text-xl transition-all duration-300 select-none"
             >
                 {value}
             </div>
         ))}
      </div>

      {/* 3. EDUCATIONAL CONTENT (Expanded) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description Card */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <span>💡</span> How it Works
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                  {SEARCH_INFO[algo].desc}
              </p>
              
              {SEARCH_INFO[algo].note && (
                  <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded mb-4">
                      <p className="text-yellow-400 text-sm font-bold">{SEARCH_INFO[algo].note}</p>
                  </div>
              )}

              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Step-by-Step Example</h4>
                  <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                      {SEARCH_INFO[algo].example}
                  </pre>
              </div>
          </div>

          {/* Complexity Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col justify-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                  <span>⚡</span> Performance
              </h3>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                  <span className="text-gray-400 font-bold text-sm">Time Complexity</span>
                  <span className="font-mono text-xl text-white bg-gray-700 px-3 py-1 rounded border border-gray-600">
                    {SEARCH_INFO[algo].time}
                  </span>
              </div>
              
              <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold text-sm">Space Complexity</span>
                  <span className="font-mono text-xl text-white bg-gray-700 px-3 py-1 rounded border border-gray-600">
                    {SEARCH_INFO[algo].space}
                  </span>
              </div>
          </div>
      </div>

    </div>
  );
};

export default SearchingVisualizer;