import { useState } from 'react';

const IncidentTimeline = ({ incidents, selectedIncident, onIncidentSelect }) => {
  const [currentCamera, setCurrentCamera] = useState('Camera - 01');

  const cameras = [
    { id: 'cam-01', name: 'Camera - 01', label: 'Camera - 01' },
    { id: 'cam-02', name: 'Camera - 02', label: 'Camera - 02' },
    { id: 'cam-03', name: 'Camera - 03', label: 'Camera - 03' }
  ];

  const getIncidentTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'unauthorised access':
        return '#ff6b6b';
      case 'gun threat':
        return '#ff4757';
      case 'face recognised':
        return '#5f27cd';
      case 'traffic congestion':
        return '#00d2d3';
      default:
        return '#ffa502';
    }
  };

  const generateTimeMarkers = () => {
    const markers = [];
    for (let hour = 0; hour <= 23; hour++) {
      markers.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        position: (hour / 24) * 100
      });
    }
    return markers;
  };

  const getIncidentPosition = (incident) => {
    const incidentTime = new Date(incident.tsStart);
    const hours = incidentTime.getHours();
    const minutes = incidentTime.getMinutes();
    return ((hours + minutes / 60) / 24) * 100;
  };

  const timeMarkers = generateTimeMarkers();
  const filteredIncidents = incidents.filter(incident => 
    incident.cameraId === currentCamera.toLowerCase().replace(' - ', '-')
  );

  return (
    <div className="incident-timeline">
      <div className="timeline-header">
        <h3>Camera Timeline</h3>
        <div className="camera-selector">
          {cameras.map(camera => (
            <button
              key={camera.id}
              className={`camera-btn ${currentCamera === camera.label ? 'active' : ''}`}
              onClick={() => setCurrentCamera(camera.label)}
            >
              {camera.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="timeline-container">
        <div className="timeline-track">
          {/* Time markers */}
          <div className="time-markers">
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="time-marker"
                style={{ left: `${marker.position}%` }}
              >
                <div className="marker-line"></div>
                <div className="marker-time">{marker.time}</div>
              </div>
            ))}
          </div>
          
          {/* Current time indicator */}
          <div className="current-time-indicator" style={{ left: '15%' }}>
            <div className="current-time-line"></div>
            <div className="current-time-label">LIVE NOW</div>
          </div>
          
          {/* Incidents */}
          <div className="incidents-track">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className={`timeline-incident ${
                  selectedIncident && selectedIncident.id === incident.id ? 'selected' : ''
                }`}
                style={{
                  left: `${getIncidentPosition(incident)}%`,
                  backgroundColor: getIncidentTypeColor(incident.type)
                }}
                onClick={() => onIncidentSelect(incident)}
                title={`${incident.type} - ${new Date(incident.tsStart).toLocaleTimeString()}`}
              >
                <div className="incident-dot"></div>
                <div className="incident-tooltip">
                  <div className="tooltip-type">{incident.type}</div>
                  <div className="tooltip-time">
                    {new Date(incident.tsStart).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Event indicators */}
          <div className="event-indicators">
            <div className="event-indicator unauthorised" style={{ left: '25%' }}>
              <div className="indicator-label">Unauthorised Access</div>
            </div>
            <div className="event-indicator gun-threat" style={{ left: '45%' }}>
              <div className="indicator-label">Gun Threat</div>
            </div>
            <div className="event-indicator multiple-events" style={{ left: '65%' }}>
              <div className="indicator-label">4 Multiple Events</div>
            </div>
            <div className="event-indicator face-recognised" style={{ left: '75%' }}>
              <div className="indicator-label">Face Recognised</div>
            </div>
            <div className="event-indicator traffic" style={{ left: '85%' }}>
              <div className="indicator-label">Traffic congestion</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-color unauthorised"></div>
          <span>Unauthorised Access</span>
        </div>
        <div className="legend-item">
          <div className="legend-color gun-threat"></div>
          <span>Gun Threat</span>
        </div>
        <div className="legend-item">
          <div className="legend-color face-recognised"></div>
          <span>Face Recognised</span>
        </div>
        <div className="legend-item">
          <div className="legend-color traffic"></div>
          <span>Traffic Congestion</span>
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;