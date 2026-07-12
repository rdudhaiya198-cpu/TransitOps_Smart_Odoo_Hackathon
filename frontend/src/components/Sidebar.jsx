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
  ShieldAlert, 
  FileText
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
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-wide">TransitOps</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl shadow-lg shadow-purple-500/10">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-lg leading-tight">
                  Transit<span className="text-purple-400">Ops</span>
                </h2>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Platform v1.0</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/15' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with User info & Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-4">
          
          {/* Theme & Actions */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 font-medium">Appearance</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all duration-200"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Details */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-800 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <span className="font-bold text-sm text-purple-400">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldAlert className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] text-purple-400 font-bold truncate leading-none">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold transition-all duration-200 bg-slate-850 hover:bg-red-500/5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
