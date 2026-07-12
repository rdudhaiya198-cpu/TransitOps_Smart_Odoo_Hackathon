import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Wrench, Droplet, DollarSign, CheckCircle } from 'lucide-react';

export default function MaintenanceDashboard({ token }) {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms state
  const [activeTab, setActiveTab] = useState('maintenance'); // maintenance, fuel, expense
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [closeModalData, setCloseModalData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resV, resM, resE] = await Promise.all([
        fetch(`${API_BASE_URL}/vehicles`, { headers }),
        fetch(`${API_BASE_URL}/maintenance`, { headers }),
        fetch(`${API_BASE_URL}/expenses`, { headers })
      ]);
      
      if (resV.ok && resM.ok && resE.ok) {
        setVehicles(await resV.json());
        setMaintenanceLogs(await resM.json());
        setExpenses(await resE.json());
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token !== 'demo-token') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let endpoint = '';
      let payload = { ...formData };
      
      if (activeTab === 'maintenance') {
        endpoint = '/maintenance';
      } else if (activeTab === 'fuel') {
        endpoint = '/fuel-logs';
        payload.liters = parseFloat(payload.liters);
        payload.cost = parseFloat(payload.cost);
      } else if (activeTab === 'expense') {
        endpoint = '/expenses';
        payload.amount = parseFloat(payload.amount);
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to submit log");
      }
      
      setFormData({});
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseMaintenance = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        end_date: closeModalData.end_date || new Date().toISOString().split('T')[0],
        cost: parseFloat(closeModalData.cost) || 0
      };
      const res = await fetch(`${API_BASE_URL}/maintenance/${closeModalData.id}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Error: ${errData.detail}`);
      } else {
        setCloseModalData(null);
        fetchData();
      }
    } catch (err) {
      alert("Error closing maintenance log");
    }
  };

  return (
    <div className="app-shell flex-1 flex flex-col min-h-0 p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="mobile-title text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Maintenance & Expenses</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Manage fleet maintenance and operational costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Forms */}
        <div className="lg:col-span-1 space-y-6">
          <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-[var(--color-text-main)]">Log Activity</h2>
            
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => {setActiveTab('maintenance'); setFormData({}); setError(null);}}
                className={`flex-1 py-2 text-sm font-semibold rounded-[4px] flex justify-center items-center gap-2 transition-colors border ${activeTab === 'maintenance' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary-light)]' : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-gray-50'}`}
              >
                <Wrench className="w-4 h-4" /> Maint
              </button>
              <button 
                onClick={() => {setActiveTab('fuel'); setFormData({}); setError(null);}}
                className={`flex-1 py-2 text-sm font-semibold rounded-[4px] flex justify-center items-center gap-2 transition-colors border ${activeTab === 'fuel' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary-light)]' : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-gray-50'}`}
              >
                <Droplet className="w-4 h-4" /> Fuel
              </button>
              <button 
                onClick={() => {setActiveTab('expense'); setFormData({}); setError(null);}}
                className={`flex-1 py-2 text-sm font-semibold rounded-[4px] flex justify-center items-center gap-2 transition-colors border ${activeTab === 'expense' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary-light)]' : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-gray-50'}`}
              >
                <DollarSign className="w-4 h-4" /> Expense
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Vehicle</label>
                <select name="vehicle_id" value={formData.vehicle_id || ''} onChange={handleInputChange} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none">
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                </select>
              </div>

              {activeTab === 'maintenance' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Description</label>
                    <input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Start Date</label>
                    <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleInputChange} className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'fuel' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Liters</label>
                      <input type="number" name="liters" value={formData.liters || ''} onChange={handleInputChange} required min="0" step="0.1" className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Total Cost</label>
                      <input type="number" name="cost" value={formData.cost || ''} onChange={handleInputChange} required min="0" step="0.01" className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Date</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'expense' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Category</label>
                      <select name="category" value={formData.category || ''} onChange={handleInputChange} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none">
                        <option value="">Select</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Toll">Toll</option>
                        <option value="Food">Food</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Amount</label>
                      <input type="number" name="amount" value={formData.amount || ''} onChange={handleInputChange} required min="0" step="0.01" className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Date</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Description</label>
                    <input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none" />
                  </div>
                </>
              )}

              <button type="submit" disabled={submitting} className="w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-[6px] transition-colors disabled:opacity-50 mt-4">
                {submitting ? 'Submitting...' : 'Save Log'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Logs Tables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Maintenance Logs */}
          <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] shadow-sm overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-5 border-b border-[var(--color-border)] bg-white">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text-main)]"><Wrench className="w-5 h-5 text-gray-500"/> Maintenance Logs</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="app-table w-full text-left text-sm">
                <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] sticky top-0">
                  <tr>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Vehicle</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Status</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Desc</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Date</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {maintenanceLogs.map(log => {
                    const vehicle = vehicles.find(v => v.id === log.vehicle_id);
                    return (
                      <tr key={log.id} className="hover:bg-[var(--color-surface)]">
                        <td className="px-5 py-3 font-medium text-[var(--color-text-main)]">{vehicle?.registration_number}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-[4px] text-[10px] font-bold tracking-wide uppercase ${log.status === 'Open' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 truncate max-w-[150px] text-[var(--color-text-main)]">{log.description}</td>
                        <td className="px-5 py-3 text-[var(--color-text-muted)]">{log.start_date}</td>
                        <td className="px-5 py-3 text-right">
                          {log.status === 'Open' && (
                            <button onClick={() => setCloseModalData(log)} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-semibold text-xs border border-[var(--color-primary-light)] bg-white px-2 py-1 rounded-[4px]">
                              Close Log
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {maintenanceLogs.length === 0 && (
                    <tr><td colSpan="5" className="px-5 py-8 text-center text-[var(--color-text-muted)]">No maintenance records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses & Fuel Logs */}
          <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-5 border-b border-[var(--color-border)] bg-white">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text-main)]"><DollarSign className="w-5 h-5 text-gray-500"/> Recent Expenses</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="app-table w-full text-left text-sm">
                <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] sticky top-0">
                  <tr>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Date</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Category</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs">Desc</th>
                    <th className="px-5 py-3 font-semibold uppercase text-xs text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {expenses.slice(0, 20).map(exp => (
                    <tr key={exp.id} className="hover:bg-[var(--color-surface)]">
                      <td className="px-5 py-3 text-[var(--color-text-muted)]">{exp.date}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 rounded-[4px] text-[10px] font-bold tracking-wide uppercase bg-gray-100 text-gray-600 border border-gray-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 truncate max-w-[150px] text-[var(--color-text-main)]">{exp.description || '-'}</td>
                      <td className="px-5 py-3 text-right font-medium text-[var(--color-text-main)]">
                        ${exp.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan="4" className="px-5 py-8 text-center text-[var(--color-text-muted)]">No expense records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Close Maintenance Modal */}
      {closeModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="app-modal app-panel bg-white w-full max-w-sm rounded-[6px] shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border)] bg-white">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text-main)]"><CheckCircle className="w-5 h-5 text-gray-500"/> Close Maintenance</h2>
            </div>
            <form onSubmit={handleCloseMaintenance} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Final Cost</label>
                  <input type="number" value={closeModalData.cost || ''} onChange={(e) => setCloseModalData({...closeModalData, cost: e.target.value})} required min="0" step="0.01" className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Completion Date</label>
                  <input type="date" value={closeModalData.end_date || ''} onChange={(e) => setCloseModalData({...closeModalData, end_date: e.target.value})} required className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
              </div>
              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button type="button" onClick={() => setCloseModalData(null)} className="px-4 py-2 rounded-[6px] font-medium text-[var(--color-text-main)] bg-white border border-[var(--color-border)] hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-[6px]">Complete</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
