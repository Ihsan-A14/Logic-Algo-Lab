import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import FAQ from './components/FAQ';
import TruthTable from './components/Logic/TruthTable';
import AlgorithmHub from './components/Algorithms/AlgorithmHub';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0c] to-black text-white font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="container mx-auto p-4 md:py-8 md:px-6">
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
          {activeTab === 'about' && <About />}
          {activeTab === 'faq' && <FAQ />}
          {activeTab === 'logic' && <TruthTable />}
          {activeTab === 'algorithms' && <AlgorithmHub />}
      </main>

    </div>
  );
}

export default App;