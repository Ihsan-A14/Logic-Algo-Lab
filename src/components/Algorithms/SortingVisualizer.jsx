import React, { useState, useEffect, useRef } from 'react';
import { 
  getBubbleSortAnimations, 
  getInsertionSortAnimations, 
  getMergeSortAnimations, 
  getQuickSortAnimations, 
  getBogoSortAnimations,
  randomIntFromInterval 
} from '../../utils/sortingAlgos';

// --- 1. EXPANDED EDUCATIONAL DATA ---
const ALGO_INFO = {
  bubble: { 
    name: 'Bubble Sort', 
    time: 'O(N²)', 
    space: 'O(1)', 
    desc: 'The simplest sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    example: '[5, 1, 4, 2] → Compare 5 & 1 → Swap → [1, 5, 4, 2]'
  },
  insertion: { 
    name: 'Insertion Sort', 
    time: 'O(N²)', 
    space: 'O(1)', 
    desc: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    example: '[5, 2, 4, 6] → Take 2, insert before 5 → [2, 5, 4, 6]'
  },
  merge: { 
    name: 'Merge Sort', 
    time: 'O(N log N)', 
    space: 'O(N)', 
    desc: 'A Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    example: '[38, 27, 43, 3] → [38, 27] & [43, 3] → Sort & Merge → [3, 27, 38, 43]'
  },
  quick: { 
    name: 'Quick Sort', 
    time: 'O(N log N)', 
    space: 'O(log N)', 
    desc: 'Picks an element as a "pivot" and partitions the given array around the picked pivot. There are many different versions of quickSort that pick pivot in different ways.',
    example: '[10, 80, 30, 90] → Pivot 30 → [10, 30, 80, 90]'
  },
  bogo: { 
    name: 'Bogo Sort', 
    time: 'O((N+1)!)', 
    space: 'O(1)', 
    desc: 'Also known as Permutation Sort or Stupid Sort. It simply shuffles the array randomly and checks if it is sorted. It is highly ineffective and used only for educational purposes.',
    example: '[3, 1, 2] → Shuffle → [2, 3, 1] → Shuffle → [1, 2, 3] (Maybe?)'
  }
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(10);
  const [algo, setAlgo] = useState('bubble');
  
  // Refs for canceling animations
  const timeouts = useRef([]);

  useEffect(() => {
    resetArray();
    return () => clearTimeouts();
  }, [arraySize, algo]); // Reset when size OR algo changes

  const clearTimeouts = () => {
    timeouts.current.forEach(t => clearTimeout(t));
    timeouts.current = [];
  };

  const resetArray = () => {
    stopSorting(); // Ensure everything stops
    const newArray = [];
    // Adjust max bar height based on size to look good
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(10, 500));
    }
    setArray(newArray);
    
    // Reset colors visually immediately
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = '#60a5fa'; // Blue
    }
  };

  // --- NEW: STOP BUTTON LOGIC ---
  const stopSorting = () => {
    clearTimeouts();
    setIsSorting(false);
    // Optional: Turn bars red to indicate stop? Or just leave them.
    // Let's reset colors to blue to look clean.
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = '#60a5fa';
    }
  };

  const runAlgorithm = () => {
    if (isSorting) return;
    setIsSorting(true);
    let animations = [];
    
    switch (algo) {
        case 'bubble': animations = getBubbleSortAnimations(array); break;
        case 'insertion': animations = getInsertionSortAnimations(array); break;
        case 'merge': animations = getMergeSortAnimations(array); break;
        case 'quick': animations = getQuickSortAnimations(array); break;
        case 'bogo': animations = getBogoSortAnimations(array); break;
        default: break;
    }

    animate(animations);
  };

  const animate = (animations) => {
    const arrayBars = document.getElementsByClassName('array-bar');
    
    for (let i = 0; i < animations.length; i++) {
      const [type, idx1, val1, idx2, val2] = animations[i];
      const isColorChange = type === "compare" || type === "revert";

      const timeoutId = setTimeout(() => {
        if (!arrayBars[idx1]) return; // Safety check if user switched tabs fast

        if (isColorChange) {
           const color = type === "compare" ? '#ef4444' : '#60a5fa'; // Red vs Blue
           arrayBars[idx1].style.backgroundColor = color;
           if (arrayBars[val1]) arrayBars[val1].style.backgroundColor = color; 
        } else if (type === "swap") {
           if (arrayBars[idx1]) arrayBars[idx1].style.height = `${val1 / 5}%`;
           if (arrayBars[idx2]) arrayBars[idx2].style.height = `${val2 / 5}%`;
        } else if (type === "overwrite") {
           if (arrayBars[idx1]) {
             arrayBars[idx1].style.height = `${val1 / 5}%`;
             arrayBars[idx1].style.backgroundColor = '#10b981'; // Green flash
             setTimeout(() => {
                 if (arrayBars[idx1]) arrayBars[idx1].style.backgroundColor = '#60a5fa';
             }, speed * 2);
           }
        }
      }, i * speed);
      
      timeouts.current.push(timeoutId);
    }

    const finalTimeout = setTimeout(() => {
      setIsSorting(false);
    }, animations.length * speed);
    timeouts.current.push(finalTimeout);
  };

  return (
    <div className="flex flex-col gap-6">
        
      {/* 1. NAVIGATION TABS */}
      <div className="bg-gray-800 rounded-lg p-2 flex flex-wrap gap-2 border border-gray-700 shadow-lg">
        {Object.keys(ALGO_INFO).map(key => (
            <button
                key={key}
                onClick={() => setAlgo(key)}
                disabled={isSorting}
                className={`flex-1 min-w-[100px] py-3 rounded-md font-bold transition-all text-sm uppercase tracking-wider
                ${algo === key 
                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                } ${isSorting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {ALGO_INFO[key].name}
            </button>
        ))}
      </div>

      {/* 2. VISUALIZER AREA */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl">
          {/* Controls Header */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-6">
              <div className="flex gap-6 items-center">
                  <div className="flex flex-col">
                      <label className="text-xs text-gray-500 font-bold mb-1 uppercase">Size</label>
                      <input 
                        type="range" min="10" max="100" value={arraySize} 
                        onChange={(e) => setArraySize(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-32 accent-blue-500 cursor-pointer"
                      />
                  </div>
                  <div className="flex flex-col">
                      <label className="text-xs text-gray-500 font-bold mb-1 uppercase">Speed</label>
                      <input 
                        type="range" min="1" max="50" value={51 - speed} 
                        onChange={(e) => setSpeed(51 - Number(e.target.value))}
                        disabled={isSorting}
                        className="w-32 accent-green-500 cursor-pointer"
                      />
                  </div>
              </div>

              <div className="flex gap-3">
                  <button 
                    onClick={resetArray} 
                    disabled={isSorting}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors disabled:opacity-50"
                  >
                    Reset
                  </button>
                  
                  {isSorting ? (
                      <button 
                        onClick={stopSorting} 
                        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-red-900/20 shadow-lg"
                      >
                        STOP ⏹
                      </button>
                  ) : (
                      <button 
                        onClick={runAlgorithm} 
                        className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition-colors shadow-green-900/20 shadow-lg"
                      >
                        START ▶
                      </button>
                  )}
              </div>
          </div>

          {/* Bars Container */}
          <div className="h-80 bg-gray-900 rounded-lg border border-gray-700 flex items-end justify-center overflow-hidden p-2 relative">
             {!isSorting && (
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 text-5xl font-black opacity-20 pointer-events-none uppercase tracking-widest">
                     {ALGO_INFO[algo].name}
                 </div>
             )}
             {array.map((value, idx) => (
              <div
                className="array-bar bg-blue-400 mx-[1px] rounded-t-sm transition-colors"
                key={idx}
                style={{ 
                    height: `${value / 5}%`,
                    width: `${Math.floor(600 / arraySize)}px`
                }} 
              ></div>
            ))}
          </div>
      </div>

      {/* 3. INFO & COMPLEXITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description Card */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <span>💡</span> How it Works
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                  {ALGO_INFO[algo].desc}
              </p>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Step-by-Step Example</h4>
                  <p className="font-mono text-green-400">{ALGO_INFO[algo].example}</p>
              </div>
          </div>

          {/* Complexity Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <span>⚡</span> Complexity
              </h3>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                  <span className="text-gray-400 font-bold">Time (Worst)</span>
                  <span className="font-mono text-xl text-white bg-gray-700 px-2 py-1 rounded">
                    {ALGO_INFO[algo].time}
                  </span>
              </div>
              
              <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Space (Memory)</span>
                  <span className="font-mono text-xl text-white bg-gray-700 px-2 py-1 rounded">
                    {ALGO_INFO[algo].space}
                  </span>
              </div>
          </div>
      </div>

    </div>
  );
};

export default SortingVisualizer;