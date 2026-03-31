// src/App.tsx
import React, { useState } from 'react';
import PltPlh from './pages/PltPlh';
import Lpp from './pages/Lpp';
import Pangkat from './pages/Pangkat';
import Cuti from './pages/Cuti';
import Gaji from './pages/Gaji';
import JF from './pages/JF';
import Pemberhentian from './pages/Pemberhentian';
import Kompetensi from './pages/Kompetensi';
import Tubel from './pages/Tubel';
import DataRiwayat from './pages/DataRiwayat';
import Diklat from './pages/Diklat';
import Slks from './pages/Slks';
import IntegrasiSIASN from './pages/IntegrasiSIASN';
import DataASN from './pages/DataASN';

function App() {
  // Set default activeTab ke "data_asn"
  const [activeTab, setActiveTab] = useState("data_asn");

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
      case "jf":
        return <JF activeTab={activeTab} onTabChange={handleTabChange} />;
      case "pemberhentian":
        return <Pemberhentian activeTab={activeTab} onTabChange={handleTabChange} />;
      case "kompetensi":
        return <Kompetensi activeTab={activeTab} onTabChange={handleTabChange} />;
      case "tubel":
        return <Tubel activeTab={activeTab} onTabChange={handleTabChange} />;
      case "data":
        return <DataRiwayat activeTab={activeTab} onTabChange={handleTabChange} />;
      case "diklat":
        return <Diklat activeTab={activeTab} onTabChange={handleTabChange} />;
      case "slks":
        return <Slks activeTab={activeTab} onTabChange={handleTabChange} />;
      case "data_asn":
        return <DataASN activeTab={activeTab} onTabChange={handleTabChange} />;
      case "integrasi_siasn":
        return <IntegrasiSIASN activeTab={activeTab} onTabChange={handleTabChange} />;
      default:
        return <DataASN activeTab={activeTab} onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;