// src/App.tsx
import React, { useState } from 'react';
import PltPlh from './pages/PltPlh';
import Lpp from './pages/Lpp';
import Pangkat from './pages/Pangkat';
import Cuti from './pages/Cuti';
import Gaji from './pages/Gaji';
import JF from './pages/JF';
import Pemberhentian from './pages/Pemberhentian';

function App() {
  const [activeTab, setActiveTab] = useState("pltplh");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderPage = () => {
    switch (activeTab) {
      case "pltplh":
        return <PltPlh activeTab={activeTab} onTabChange={handleTabChange} />;
      case "lpp":
        return <Lpp activeTab={activeTab} onTabChange={handleTabChange} />;
      case "pangkat":
        return <Pangkat activeTab={activeTab} onTabChange={handleTabChange} />;
      case "cuti":
        return <Cuti activeTab={activeTab} onTabChange={handleTabChange} />;
      case "gaji":
        return <Gaji activeTab={activeTab} onTabChange={handleTabChange} />;
      case "jf":  // <-- Tambahkan case untuk jf
        return <JF activeTab={activeTab} onTabChange={handleTabChange} />;
      case "pemberhentian":
        return <Pemberhentian activeTab={activeTab} onTabChange={handleTabChange} />;
      case "rekap_cuti":
        return <div className="p-8 text-center">Halaman Rekap Cuti (Coming Soon)</div>;
      default:
        return <PltPlh activeTab={activeTab} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;