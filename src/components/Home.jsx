import React from 'react';

const Home = ({ setActiveTab }) => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. LIQUID BACKGROUND BLOBS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* 2. HERO CONTENT */}
      <div className="relative z-10 text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 mb-6 drop-shadow-2xl tracking-tight">
          Logic Algo Lab
        </h1>
        <p className="text-xl md:text-2xl text-blue-200/80 font-light tracking-wide max-w-2xl mx-auto">
          The interactive playground for Computer Science mastery.
          <br/>
          <span className="text-sm font-bold uppercase tracking-[0.3em] opacity-50 mt-4 block">
            Visualize • Simulate • Understand
          </span>
        </p>
      </div>

      {/* 3. GLASS CARDS */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-6">
        
        {/* Card 1: Logic */}
        <button 
          onClick={() => setActiveTab('logic')}
          className="group relative h-64 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 focus:outline-none"
        >
          {/* Glass Layer */}
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:bg-gray-800/50 group-hover:border-blue-500/30"></div>
          
          {/* Inner Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-500">
               <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Logic Lab</h2>
            <p className="text-gray-400 text-center group-hover:text-gray-300">
              Boolean Algebra, Truth Tables, K-Maps, and Circuit Simulation.
            </p>
          </div>
        </button>

        {/* Card 2: Algorithms */}
        <button 
          onClick={() => setActiveTab('algorithms')}
          className="group relative h-64 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 focus:outline-none"
        >
          {/* Glass Layer */}
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl border border-white/10 transition-all duration-500 group-hover:bg-gray-800/50 group-hover:border-green-500/30"></div>
          
          {/* Inner Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all duration-500">
               <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">Algorithm Arena</h2>
            <p className="text-gray-400 text-center group-hover:text-gray-300">
              Sorting, Searching, Trees, Graphs, and Pathfinding Visualizers.
            </p>
          </div>
        </button>

      </div>

      {/* 4. FOOTER BADGE */}
      <div className="mt-20 relative z-10">
         <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
            v2.0 • System Ready
         </div>
      </div>

    </div>
  );
};

export default Home;