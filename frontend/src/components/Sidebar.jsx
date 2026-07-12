import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ShieldAlert 
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  user, 
  onLogout, 
  darkMode, 
  setDarkMode 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-earth-bg border-b border-earth-border text-earth-text">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-earth-clay rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold tracking-wide text-sm">TransitOps</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-earth-muted hover:text-earth-text transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-earth-surface border-r border-earth-border flex flex-col justify-between
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header */}
          <div className="p-6 border-b border-earth-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-earth-clay rounded-xl shadow-md">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-earth-text text-md leading-tight">
                  Transit<span className="text-earth-clay">Ops</span>
                </h2>
                <span className="text-[10px] text-earth-muted font-bold tracking-wider uppercase">Console v1.0</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-earth-muted hover:text-earth-text"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Touch friendly paddings) */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-earth-clay text-white shadow-md shadow-earth-clay/10' 
                      : 'text-earth-muted hover:bg-earth-bg hover:text-earth-text'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-earth-muted'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with User info & Controls */}
        <div className="p-4 border-t border-earth-border space-y-4">
          
          {/* Theme & Actions */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-earth-muted font-bold uppercase tracking-wider">Appearance</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-earth-bg border border-earth-border text-earth-muted hover:text-earth-text transition-all duration-200 cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Details */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-earth-bg border border-earth-border rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-earth-clay/10 border border-earth-clay/20 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sm text-earth-clay">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-earth-text truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldAlert className="w-3 h-3 text-earth-clay" />
                  <span className="text-[9px] text-earth-clay font-extrabold truncate uppercase leading-none">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button (Touch friendly) */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-earth-border hover:border-rose-500/20 text-earth-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
