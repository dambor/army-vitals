import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SoldierSidebar from './components/SoldierSidebar';
import VitalCharts from './components/VitalCharts';
import './index.css';

const API_BASE = 'http://localhost:8000/api/vitals';

function App() {
  const [soldiers, setSoldiers] = useState([]);
  const [selectedSoldierId, setSelectedSoldierId] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch latest data for sidebar
  const fetchLatest = async () => {
    try {
      const response = await fetch(`${API_BASE}/latest`);
      const data = await response.json();
      setSoldiers(data);

      // Select first soldier by default if none selected
      if (!selectedSoldierId && data.length > 0) {
        setSelectedSoldierId(data[0].soldier_id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching latest:", error);
    }
  };

  // Fetch history for selected soldier
  const fetchHistory = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_BASE}/history/${id}?hours=24`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSoldierId) {
      fetchHistory(selectedSoldierId);
      // Refresh history occasionally too
      const interval = setInterval(() => fetchHistory(selectedSoldierId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedSoldierId]);

  const filteredSoldiers = soldiers.filter(s =>
    s.soldier_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSoldierData = soldiers.find(s => s.soldier_id === selectedSoldierId);

  return (
    <div className="app-container">
      <Navbar onSearch={setSearchTerm} />

      <div className="main-content">
        <SoldierSidebar
          soldiers={filteredSoldiers}
          selectedId={selectedSoldierId}
          onSelect={setSelectedSoldierId}
        />

        <div className="dashboard-panel">
          {selectedSoldierData ? (
            <>
              <div className="soldier-header">
                <h2>UNIT: <span className="highlight">{selectedSoldierData.soldier_id}</span></h2>
                <div className="live-stats">
                  <div className="stat-box">
                    <span className="label">HR</span>
                    <span className={`value ${selectedSoldierData.heart_rate > 100 ? 'critical' : ''}`}>
                      {selectedSoldierData.heart_rate}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="label">TEMP</span>
                    <span className="value">{selectedSoldierData.temperature}°C</span>
                  </div>
                  <div className="stat-box">
                    <span className="label">SpO2</span>
                    <span className={`value ${selectedSoldierData.spo2 < 95 ? 'warning' : ''}`}>
                      {selectedSoldierData.spo2}%
                    </span>
                  </div>
                </div>
              </div>

              <VitalCharts history={history} />
            </>
          ) : (
            <div className="loading-state">INITIALIZING TACTICAL LINK...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
