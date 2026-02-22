import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn p-6">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-400 mb-8">
          Behind the Code
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
          AlgoVista was built to bridge the gap between abstract computer science concepts and 
          interactive understanding. It serves as a playground for students and developers alike.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-2">Developed By</h3>
              <p className="text-white font-bold text-lg">Ihsan Muhammad Anjakkulam</p>
              <div className="flex justify-center gap-4 mt-4">
                  {/* Social Placeholders */}
                  <a href="https://linkedin.com/in/ihsan-muhammad-anjakkulam-8324723a2" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://github.com/Ihsan-A14" className="p-2 bg-white/5 rounded-full hover:bg-gray-600 transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
              </div>
           </div>
           
           <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">Co-Authored by AI</h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-2">
                 This project was crafted with the assistance of advanced LLMs to accelerate development, optimize algorithms, and generate educational content.
              </p>
           </div>
        </div>

        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            © 2026 AlgoVista • Edmonton, AB
        </div>
      </div>
    </div>
  );
};

export default About;