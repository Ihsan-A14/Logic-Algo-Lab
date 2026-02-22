import React, { useEffect, useState } from 'react';

const Home = ({ setActiveTab }) => {
  const [textIndex, setTextIndex] = useState(0);
  const words = ["Logic Gates", "Algorithms", "Data Structures", "Pathfinding"];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // TYPING EFFECT
  useEffect(() => {
    const currentWord = words[textIndex % words.length];
    const updateSpeed = isDeleting ? 100 : 150;

    const handleType = () => {
      setDisplayText(prev => 
        isDeleting ? currentWord.substring(0, prev.length - 1) : currentWord.substring(0, prev.length + 1)
      );

      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTextIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(handleType, updateSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  return (
    <div className="relative flex flex-col items-center overflow-hidden">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center relative w-full px-4">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
           <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-blue-800/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[10%] left-[30%] w-[700px] h-[700px] bg-indigo-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 backdrop-blur-md mb-8 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-teal-300 text-xs font-bold uppercase tracking-widest">v2.0 Now Live</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight animate-slideUp">
                Master <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                    {displayText}
                    <span className="w-1 h-16 ml-1 bg-blue-400 inline-block animate-pulse align-middle"></span>
                </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed animate-slideUp" style={{animationDelay: '0.2s'}}>
                Stop staring at code. Start visualizing it. <br/>
                The ultimate interactive playground for Computer Science students.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center animate-slideUp" style={{animationDelay: '0.4s'}}>
                <button 
                  onClick={() => setActiveTab('algorithms')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/50"
                >
                  Explore Algorithms
                </button>
                <button 
                  onClick={() => setActiveTab('logic')}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-lg border border-white/10 transition-all hover:border-white/30"
                >
                  Enter Logic Lab
                </button>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>


      {/* --- 2. FEATURES GRID --- */}
      <section className="w-full max-w-7xl px-6 py-24 border-t border-white/5 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Why AlgoVista?</h2>
              <p className="text-gray-400">Bridging the gap between theory and application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { icon: "⚡", title: "Real-Time Simulation", desc: "Change inputs and see results instantly. No compile times, just instant feedback." },
                  { icon: "🎨", title: "Visual Learning", desc: "Watch how sorting algorithms swap elements and how graphs find the shortest path." },
                  { icon: "🛠", title: "Engineering Tools", desc: "Simplify complex Boolean expressions and verify circuits before you build them." }
              ].map((feature, idx) => (
                  <div key={idx} className="bg-gray-900/50 border border-white/10 p-8 rounded-3xl hover:bg-gray-800/80 transition-all duration-300 hover:-translate-y-2 group">
                      <div className="text-4xl mb-6 bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
              ))}
          </div>
      </section>


      {/* --- 3. DETAILED MODULES --- */}
      <section className="w-full max-w-7xl px-6 py-24 relative z-10">
          
          {/* LOGIC MODULE */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
              <div className="flex-1 space-y-6">
                  <div className="inline-block px-3 py-1 bg-teal-900/30 text-teal-400 rounded-lg text-xs font-bold uppercase tracking-widest border border-teal-500/20">Logic Module</div>
                  <h2 className="text-4xl md:text-5xl font-black text-white">Digital Logic Simplified.</h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      Struggling with Karnaugh maps or Boolean Algebra? Our engine takes raw expressions and simplifies them using the Quine-McCluskey algorithm, then generates a dynamic circuit diagram.
                  </p>
                  <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-3"><span className="text-teal-400">✓</span> Truth Table Generator</li>
                      <li className="flex items-center gap-3"><span className="text-teal-400">✓</span> Circuit Visualizer with Live Simulation</li>
                      <li className="flex items-center gap-3"><span className="text-teal-400">✓</span> Canonical Sum of Products Simplification</li>
                  </ul>
                  <button onClick={() => setActiveTab('logic')} className="mt-4 text-teal-400 font-bold hover:text-teal-300 flex items-center gap-2 group">
                      Open Logic Lab <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
              </div>
              <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-1 border border-white/10 shadow-2xl rotate-1 hover:rotate-0 transition-all duration-500">
                   <div className="bg-gray-950 rounded-[22px] h-64 md:h-80 flex items-center justify-center relative overflow-hidden group">
                        {/* Fake UI illustration */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 to-transparent opacity-50"></div>
                        <div className="text-teal-500/20 text-9xl font-black select-none group-hover:scale-110 transition-transform duration-700">A + B</div>
                   </div>
              </div>
          </div>

          {/* ALGORITHM MODULE */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-6">
                  <div className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-500/20">Algorithm Module</div>
                  <h2 className="text-4xl md:text-5xl font-black text-white">See How Code Thinks.</h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      Algorithms shouldn't be black boxes. We visualize the step-by-step execution of sorting, searching, and graph traversal algorithms so you can understand the "Why" and "How".
                  </p>
                  <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Sorting: Bubble, Merge, Quick, etc.</li>
                      <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Pathfinding: Dijkstra, A*, BFS, DFS</li>
                      <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Dynamic Array & Graph Generation</li>
                  </ul>
                  <button onClick={() => setActiveTab('algorithms')} className="mt-4 text-blue-400 font-bold hover:text-blue-300 flex items-center gap-2 group">
                      Enter Arena <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
              </div>
              <div className="flex-1 bg-gradient-to-bl from-gray-800 to-gray-900 rounded-3xl p-1 border border-white/10 shadow-2xl -rotate-1 hover:rotate-0 transition-all duration-500">
                   <div className="bg-gray-950 rounded-[22px] h-64 md:h-80 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent opacity-50"></div>
                        <div className="flex items-end gap-2 h-32">
                             {[40, 70, 30, 80, 50].map((h, i) => (
                                 <div key={i} className="w-8 bg-blue-600 rounded-t-md opacity-50 group-hover:opacity-100 transition-all duration-500" style={{height: `${h}%`}}></div>
                             ))}
                        </div>
                   </div>
              </div>
          </div>
      </section>


      {/* --- 5. FOOTER --- */}
      <footer className="w-full border-t border-white/5 py-12 relative z-10 bg-black/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-black text-xs">A</div>
                  <span className="text-white font-bold">AlgoVista</span>
              </div>
              <div className="text-gray-500 text-sm">
                  © 2026 AlgoVista. Open Source Education.
              </div>
              <div className="flex gap-6">
                  <a href="https://github.com/Ihsan-A14" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
                  <a href="https://www.instagram.com/ihsan_mohd14" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
              </div>
          </div>
      </footer>

    </div>
  );
};

export default Home;