import { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route,
  Wrench,
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
    { id: 'trips', label: 'Trips', icon: Route },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
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
      <div className="lg:hidden flex items-center justify-between p-4 bg-[var(--color-primary-dark)] text-white border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-wide">TransitOps</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-white/70 hover:text-white transition-colors"
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-primary-dark)] border-r border-white/10 flex flex-col justify-between
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:h-screen text-white
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">
                  Transit<span className="text-[var(--color-secondary)]">Ops</span>
                </h2>
                <span className="text-[10px] text-white/50 font-semibold tracking-wider uppercase">Platform v1.0</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-white/50 hover:text-white"
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
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with User info & Controls */}
        <div className="p-4 border-t border-white/10 space-y-4">
          
          {/* Theme & Actions */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-white/50 font-medium">Appearance</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Details */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="font-bold text-sm text-white">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldAlert className="w-3 h-3 text-[var(--color-secondary)]" />
                  <span className="text-[10px] text-[var(--color-secondary)] font-bold truncate leading-none">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 bg-white/5 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
