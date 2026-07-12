import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AlertsPanel({ token }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/unread`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const dismissAlert = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error("Failed to dismiss alert:", error);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'High': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Medium': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'Low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return 'border-red-200 bg-red-50';
      case 'High': return 'border-orange-200 bg-orange-50';
      case 'Medium': return 'border-amber-200 bg-amber-50';
      case 'Low': return 'border-blue-200 bg-blue-50';
      default: return 'border-[var(--color-border)] bg-[var(--color-surface)]';
    }
  };

  return (
    <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-[var(--color-text-main)]">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          Predictive Maintenance Alerts
        </h3>
        {alerts.length > 0 && (
          <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
            {alerts.length} NEW
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {loading ? (
          <div className="text-center text-sm text-[var(--color-text-muted)] py-4">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-main)]">All Systems Nominal</p>
            <p className="text-xs text-[var(--color-text-muted)]">No active maintenance alerts.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-[4px] border transition-all duration-300 ${getSeverityStyles(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-main)] mb-2">
                    {alert.message}
                  </p>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
