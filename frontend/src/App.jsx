import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import IncidentPlayer from './components/IncidentPlayer';
import IncidentList from './components/IncidentList';
import IncidentTimeline from './components/IncidentTimeline';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [stats, setStats] = useState({ unresolved: 0, resolved: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    fetchIncidents();
    fetchStats();
  }, [showResolved]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/incidents?resolved=${showResolved}`);
      setIncidents(response.data);
      if (response.data.length > 0 && !selectedIncident) {
        setSelectedIncident(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
  };

  const handleIncidentResolve = async (incidentId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/incidents/${incidentId}/resolve`);
      const updatedIncident = response.data;
      
      // Update incidents list
      setIncidents(prevIncidents => 
        prevIncidents.map(inc => 
          inc.id === incidentId ? updatedIncident : inc
        ).filter(inc => showResolved ? true : !inc.resolved)
      );
      
      // Update selected incident if it's the one being resolved
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident(updatedIncident);
      }
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  };

  return (
    <div className="app">
      <Navbar 
        stats={stats} 
        showResolved={showResolved}
        onToggleResolved={() => setShowResolved(!showResolved)}
      />
      
      <div className="main-content">
        <div className="content-grid">
          <div className="left-panel">
            <IncidentPlayer 
              incident={selectedIncident}
              onResolve={handleIncidentResolve}
            />
          </div>
          
          <div className="right-panel">
            <IncidentList
              incidents={incidents}
              selectedIncident={selectedIncident}
              onIncidentSelect={handleIncidentSelect}
              onIncidentResolve={handleIncidentResolve}
              loading={loading}
              showResolved={showResolved}
            />
          </div>
        </div>
        
        <div className="bottom-panel">
          <IncidentTimeline
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={handleIncidentSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default App;