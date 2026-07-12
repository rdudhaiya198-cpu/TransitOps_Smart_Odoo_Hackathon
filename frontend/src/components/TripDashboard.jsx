import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Plus, X, Truck, User, MapPin, Weight, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export default function TripDashboard({ token }) {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    start_location: '',
    destination: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resT, resV, resD] = await Promise.all([
        fetch(`${API_BASE_URL}/trips`, { headers }),
        fetch(`${API_BASE_URL}/vehicles`, { headers }),
        fetch(`${API_BASE_URL}/drivers`, { headers })
      ]);
      
      if (resT.ok && resV.ok && resD.ok) {
        const t = await resT.json();
        const v = await resV.json();
        const d = await resD.json();
        setTrips(t);
        setVehicles(v);
        setDrivers(d);
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

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        cargo_weight: parseFloat(formData.cargo_weight)
      };

      const res = await fetch(`${API_BASE_URL}/trips/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create trip");
      }
      
      setIsModalOpen(false);
      setFormData({
        vehicle_id: '', driver_id: '', cargo_weight: '', start_location: '', destination: ''
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTripStatus = async (tripId, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${tripId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Error: ${errData.detail}`);
      } else {
        fetchData();
      }
    } catch (err) {
      alert("Error updating trip status");
    }
  };

  // Organize trips into Kanban columns
  const columns = {
    'Scheduled': trips.filter(t => t.status === 'Scheduled'),
    'Dispatched': trips.filter(t => t.status === 'Dispatched'),
    'Completed': trips.filter(t => t.status === 'Completed'),
    'Cancelled': trips.filter(t => t.status === 'Cancelled')
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  return (
    <div className="app-shell flex-1 flex flex-col min-h-0 p-4 sm:p-6 lg:p-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="mobile-title text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Trip Management</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Schedule, dispatch, and monitor trips.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[6px] font-medium transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Create Trip
        </button>
      </div>

      {loading && <div className="text-center py-10">Loading...</div>}

      {/* Kanban Board */}
      {!loading && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 sm:gap-6 h-full min-w-max pb-4">
            {Object.entries(columns).map(([status, statusTrips]) => (
              <div key={status} className="w-[min(20rem,calc(100vw-2rem))] sm:w-80 flex flex-col bg-slate-50/50 rounded-[6px] border border-[var(--color-border)] flex-shrink-0 max-h-full">
                {/* Column Header */}
                <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-white rounded-t-[6px]">
                  <h3 className="font-bold text-[var(--color-text-main)] flex items-center gap-2">
                    {status === 'Scheduled' && <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>}
                    {status === 'Dispatched' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                    {status === 'Completed' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                    {status === 'Cancelled' && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                    {status}
                  </h3>
                  <span className="text-xs font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-0.5 rounded-full text-[var(--color-text-muted)]">
                    {statusTrips.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {statusTrips.map(trip => {
                    const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
                    const driver = drivers.find(d => d.id === trip.driver_id);
                    return (
                    <div key={trip.id} className="bg-white p-4 rounded-[6px] shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-mono text-[var(--color-text-muted)]">#{trip.id.slice(0, 8)}</span>
                          <span className="text-xs font-medium text-[var(--color-text-muted)]">{new Date(trip.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-[var(--color-text-main)]">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="truncate">{trip.start_location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-[var(--color-text-muted)]">
                          <ArrowRight className="w-4 h-4 text-gray-400 ml-0.5" />
                          <span className="truncate">{trip.destination}</span>
                        </div>

                        <div className="space-y-2 mb-4 bg-slate-50 p-2.5 rounded-[6px] text-xs border border-[var(--color-border)]">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><Truck className="w-3.5 h-3.5"/> Vehicle</span>
                            <span className="font-medium text-[var(--color-text-main)] truncate max-w-[120px]">{vehicle ? vehicle.registration_number : 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><User className="w-3.5 h-3.5"/> Driver</span>
                            <span className="font-medium text-[var(--color-text-main)] truncate max-w-[120px]">{driver ? driver.name : 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><Weight className="w-3.5 h-3.5"/> Cargo</span>
                            <span className="font-medium text-[var(--color-text-main)]">{trip.cargo_weight} kg</span>
                          </div>
                        </div>

                        {/* Actions */}
                        {status === 'Scheduled' && (
                          <div className="flex gap-2">
                            <button onClick={() => updateTripStatus(trip.id, 'dispatch')} className="flex-1 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-[4px] hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                              <Truck className="w-3.5 h-3.5"/> Dispatch
                            </button>
                            <button onClick={() => updateTripStatus(trip.id, 'cancel')} className="p-1.5 bg-red-50 text-red-600 border border-red-200 rounded-[4px] hover:bg-red-100 transition-colors">
                              <XCircle className="w-4 h-4"/>
                            </button>
                          </div>
                        )}
                        {status === 'Dispatched' && (
                          <button onClick={() => updateTripStatus(trip.id, 'complete')} className="w-full py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold rounded-[4px] hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5"/> Complete Trip
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {statusTrips.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400">
                      No {status.toLowerCase()} trips.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="app-modal app-panel bg-white w-full max-w-lg rounded-[6px] shadow-sm overflow-hidden border border-[var(--color-border)]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">Schedule New Trip</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTrip} className="p-6">
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Vehicle</label>
                    <select 
                      name="vehicle_id" 
                      value={formData.vehicle_id} 
                      onChange={handleInputChange} 
                      required
                      className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    >
                      <option value="">Select Vehicle</option>
                      {availableVehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.registration_number} (Max: {v.max_load_capacity}kg)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Driver</label>
                    <select 
                      name="driver_id" 
                      value={formData.driver_id} 
                      onChange={handleInputChange} 
                      required
                      className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    >
                      <option value="">Select Driver</option>
                      {availableDrivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Cargo Weight (kg)</label>
                  <input 
                    type="number" 
                    name="cargo_weight" 
                    value={formData.cargo_weight} 
                    onChange={handleInputChange} 
                    required min="0" step="0.1"
                    className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Start Location</label>
                    <input 
                      type="text" 
                      name="start_location" 
                      value={formData.start_location} 
                      onChange={handleInputChange} 
                      required
                      className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                      placeholder="Origin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">Destination</label>
                    <input 
                      type="text" 
                      name="destination" 
                      value={formData.destination} 
                      onChange={handleInputChange} 
                      required
                      className="app-field w-full bg-white border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm text-[var(--color-text-main)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                      placeholder="Destination"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-[6px] font-medium text-[var(--color-text-main)] bg-white border border-[var(--color-border)] hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-[6px] transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Schedule Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
