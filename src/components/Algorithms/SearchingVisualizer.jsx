import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TruthTable from './components/Logic/TruthTable';
import SortingVisualizer from './components/Algorithms/SortingVisualizer';

function App() {
  const [activeTab, setActiveTab] = useState('logic');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Pass the setActiveTab function to Navbar so buttons work */}
      <Navbar setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'logic' && <TruthTable />}
          {activeTab === 'algorithms' && <SortingVisualizer />}
        </div>
      </main>
    </div>
  );
}

export default App;