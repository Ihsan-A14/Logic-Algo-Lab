import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TruthTable from './components/Logic/TruthTable';
// 1. IMPORT THE HUB (This was missing)
import AlgorithmHub from './components/Algorithms/AlgorithmHub'; 

function App() {
  const [activeTab, setActiveTab] = useState('logic');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="container mx-auto p-8">
        {/* Expanded width to max-w-7xl so the algorithms have space */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'logic' && <TruthTable />}
          {activeTab === 'algorithms' && <AlgorithmHub />}
        </div>
      </main>
    </div>
  );
}

export default App;