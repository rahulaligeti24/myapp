import { LayoutDashboard, Camera, AlertTriangle, Users, User } from 'lucide-react';

const Navbar = ({ stats, showResolved, onToggleResolved }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Camera size={24} />
          </div>
          <span className="brand-text">SECURESIGHT</span>
        </div>
        
        <div className="navbar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <Camera size={18} />
            Cameras
          </a>
          <a href="#" className="nav-item">
            <AlertTriangle size={18} />
            Scenes
          </a>
          <a href="#" className="nav-item">
            <AlertTriangle size={18} />
            Incidents
          </a>
          <a href="#" className="nav-item">
            <Users size={18} />
            Users
          </a>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="stats-summary">
          <div className="stat-item">
            <AlertTriangle size={16} className="stat-icon unresolved" />
            <span className="stat-count">{stats.unresolved}</span>
            <span className="stat-label">Unresolved Incidents</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-count resolved">{stats.resolved}</span>
            <span className="stat-label">resolved incidents</span>
          </div>
        </div>
        
        <button 
          className={`toggle-btn ${showResolved ? 'active' : ''}`}
          onClick={onToggleResolved}
        >
          {showResolved ? 'Show Unresolved' : 'Show Resolved'}
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Rahul Aligeti</span>
            <span className="user-email">rahul24@gmail.com</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;