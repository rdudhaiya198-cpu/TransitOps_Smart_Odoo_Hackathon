import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import VehicleDashboard from './components/VehicleDashboard';
import DriverDashboard from './components/DriverDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('transitops_token') || null);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('transitops_token'));
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
    setShowLanding(true); // Return to landing page on logout
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
      default:
        return <MainDashboard token={token} />;
    }
  };

  // 1. Show Landing Page if active (with theme toggle support)
  if (showLanding) {
    return (
      <LandingPage 
        onLaunchConsole={() => setShowLanding(false)} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  // 2. Show Authenticate wrapper if no session
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${darkMode ? 'dark' : ''} bg-earth-bg text-earth-text`}>
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
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Top Floating Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-earth-clay/5 rounded-full filter blur-[100px] pointer-events-none"></div>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
