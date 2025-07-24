import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const IncidentList = ({ 
  incidents, 
  selectedIncident, 
  onIncidentSelect, 
  onIncidentResolve, 
  loading, 
  showResolved 
}) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return date.toLocaleDateString('en-GB');
  };

  const getIncidentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return '🔒';
      case 'gun threat':
        return '🔫';
      case 'face recognised':
        return '👤';
      case 'traffic congestion':
        return '🚗';
      default:
        return '⚠️';
    }
  };

  if (loading) {
    return (
      <div className="incident-list">
        <div className="incident-list-header">
          <h2>{showResolved ? 'Resolved' : 'Unresolved'} Incidents</h2>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="incident-list">
      <div className="incident-list-header">
        <h2>
          {showResolved ? (
            <>
              <span className="resolved-count">{incidents.length}</span> Resolved Incidents
            </>
          ) : (
            <>
              <span className="warning-icon">⚠️</span> 
              <span className="unresolved-count">{incidents.length}</span> Unresolved Incidents
            </>
          )}
        </h2>
        <div className="header-actions">
          <span className="resolved-indicator">✓ 4 resolved incidents</span>
        </div>
      </div>
      
      <div className="incident-items">
        {incidents.length === 0 ? (
          <div className="no-incidents">
            <p>No {showResolved ? 'resolved' : 'unresolved'} incidents found</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className={`incident-item ${
                selectedIncident && selectedIncident.id === incident.id ? 'selected' : ''
              }`}
              onClick={() => onIncidentSelect(incident)}
            >
              <div className="incident-thumbnail">
                <img 
                  src="https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg"
                  alt="Security camera footage"
                />
                <div className="incident-type-badge">
                  <span className={`type-icon ${incident.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {getIncidentIcon(incident.type)}
                  </span>
                </div>
              </div>
              
              <div className="incident-details">
                <div className="incident-header">
                  <span className={`incident-type ${incident.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {incident.type}
                  </span>
                  {incident.resolved && (
                    <span className="resolved-badge">✓ Resolved</span>
                  )}
                </div>
                
                <div className="incident-location">
                  <span className="camera-icon">📹</span> {incident.camera}
                </div>
                
                <div className="incident-time">
                  <span className="clock-icon">🕒</span> {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)} on {formatDate(incident.tsStart)}
                </div>
              </div>
              
              <div className="incident-actions">
                {!incident.resolved && !showResolved && (
                  <button 
                    className="resolve-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIncidentResolve(incident.id);
                    }}
                  >
                    Resolve
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

// Demo component with sample data
const SecurityDashboard = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  const sampleIncidents = [
    {
      id: 1,
      type: 'Unauthorised Access',
      camera: 'Shop Floor Camera A',
      tsStart: '2025-07-25T14:35:00Z',
      tsEnd: '2025-07-25T14:37:00Z',
      resolved: false
    },
    {
      id: 2,
      type: 'Gun Threat',
      camera: 'Shop Floor Camera A',
      tsStart: '2025-07-25T14:35:00Z',
      tsEnd: '2025-07-25T14:37:00Z',
      resolved: false
    },
    {
      id: 3,
      type: 'Unauthorised Access',
      camera: 'Shop Floor Camera A',
      tsStart: '2025-07-25T14:35:00Z',
      tsEnd: '2025-07-25T14:37:00Z',
      resolved: false
    },
    {
      id: 4,
      type: 'Unauthorised Access',
      camera: 'Shop Floor Camera A',
      tsStart: '2025-07-25T14:35:00Z',
      tsEnd: '2025-07-25T14:37:00Z',
      resolved: false
    },
    {
      id: 5,
      type: 'Unauthorised Access',
      camera: 'Shop Floor Camera A',
      tsStart: '2025-07-25T14:35:00Z',
      tsEnd: '2025-07-25T14:37:00Z',
      resolved: false
    }
  ];

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
  };

  const handleIncidentResolve = (incidentId) => {
    console.log('Resolving incident:', incidentId);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)', 
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <IncidentList
        incidents={sampleIncidents}
        selectedIncident={selectedIncident}
        onIncidentSelect={handleIncidentSelect}
        onIncidentResolve={handleIncidentResolve}
        loading={false}
        showResolved={showResolved}
      />
    </div>
  );
};

export default SecurityDashboard;