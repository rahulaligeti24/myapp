import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

const IncidentPlayer = ({ incident, onResolve }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [incident]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 100);
    } else if (currentTime >= duration) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!incident) {
    return (
      <div className="incident-player">
        <div className="no-incident">
          <div className="placeholder-content">
            <img src="https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg" width={1200} alt="" />
            <h3>No incident selected</h3>
            <p>Select an incident from the list to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="incident-player">
      <div className="player-header">
        <div className="incident-date">
          {formatDate(incident.tsStart)} - {formatTimeOnly(incident.tsStart)}
        </div>
      </div>
      
      <div className="video-container">
        <img 
          src={incident.thumbnailUrl} 
          alt={`Incident ${incident.id}`}
          className="video-frame"
        />
        
        <div className="video-overlay">
          <div className="camera-info">
            <span className="camera-label">Camera - {incident.cameraId.split('-')[1]}</span>
          </div>
          
          <div className="incident-badge">
            <span className={`incident-type ${incident.type.toLowerCase().replace(/\s+/g, '-')}`}>
              {incident.type}
            </span>
          </div>
        </div>
        
        <div className="mini-thumbnails">
          <div className="mini-thumb active">
            <img src={incident.thumbnailUrl} alt="Camera 1" />
          </div>
          <div className="mini-thumb">
            <img src={incident.thumbnailUrl} alt="Camera 2" />
          </div>
        </div>
      </div>
      
      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-btn">
            <SkipBack size={18} />
          </button>
          <button className="control-btn">
            <RotateCcw size={18} />
          </button>
          <button 
            className="control-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="control-btn">
            <RotateCw size={18} />
          </button>
          <button className="control-btn">
            <SkipForward size={18} />
          </button>
        </div>
        
        <div className="time-display">
          {formatTime(Math.floor(currentTime))} ({formatDate(incident.tsStart)})
        </div>
        
        <div className="speed-control">
          1x
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="time-labels">
          <span>00:00</span>
          <span>01:40</span>
          <span>02:00</span>
          <span>04:00</span>
          <span>05:00</span>
          <span>06:00</span>
          <span>08:00</span>
          <span>10:00</span>
          <span>12:00</span>
          <span>14:00</span>
          <span>15:00</span>
          <span>16:00</span>
        </div>
      </div>
      
      {!incident.resolved && (
        <div className="resolve-section">
          <button 
            className="resolve-btn"
            onClick={() => onResolve(incident.id)}
          >
            Resolve Incident
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentPlayer;