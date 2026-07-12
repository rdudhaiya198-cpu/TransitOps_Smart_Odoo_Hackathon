import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import VehicleDashboard from './components/VehicleDashboard';
import DriverDashboard from './components/DriverDashboard';
import TripDashboard from './components/TripDashboard';
import MaintenanceDashboard from './components/MaintenanceDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('transitops_token') || null);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('transitops_dark') === 'true' || false
  );

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('transitops_dark', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('transitops_dark', 'false');
    }
  }, [darkMode]);

  // Load user data on startup
  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('transitops_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
    setToken(null);
    setUser(null);
  };

  // View Router Render Helper
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <MainDashboard token={token} />;
      case 'vehicles':
        return <VehicleDashboard token={token} />;
      case 'drivers':
        return <DriverDashboard token={token} />;
      case 'trips':
        return <TripDashboard token={token} />;
      case 'maintenance':
        return <MaintenanceDashboard token={token} />;
      default:
        return <MainDashboard token={token} />;
    }
  };

  // Authenticate wrapper
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`app-shell flex flex-col lg:flex-row min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navigation Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={handleLogout} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Dashboard / Table Area */}
      <main className="app-shell flex-1 flex flex-col min-h-0 relative">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
