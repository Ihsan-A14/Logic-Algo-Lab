import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TruthTable from './components/Logic/TruthTable';
import AlgorithmHub from './components/Algorithms/AlgorithmHub';

function App() {
  // Default to 'home' so the landing page shows on reload
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-gradient-to-b from-gray-900 via-[#0f1014] to-black text-white font-sans selection:bg-blue-500/30">
      
      {/* Pass setActiveTab so the Logo can reset the view */}
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* HOME PAGE */}
          {activeTab === 'home' && (
            <div className="animate-fadeIn">
               <Home setActiveTab={setActiveTab} />
            </div>
          )}
          
          {/* LOGIC TAB */}
          {activeTab === 'logic' && (
            <div className="animate-fadeIn">
              <TruthTable />
            </div>
          )}
          
          {/* ALGORITHMS TAB */}
          {activeTab === 'algorithms' && (
            <div className="animate-fadeIn">
              <AlgorithmHub />
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default App;