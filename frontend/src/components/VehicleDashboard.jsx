import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2, 
  Truck, 
  AlertCircle, 
  Gauge, 
  Weight, 
  FileText
} from 'lucide-react';

export default function VehicleDashboard({ token }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    registration_number: '',
    name_model: '',
    type: 'Truck',
    max_load_capacity: '',
    odometer: '',
    acquisition_cost: '',
    status: 'Available'
  });
  
  // Document Management State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeDocVehicle, setActiveDocVehicle] = useState(null);
  const [docs, setDocs] = useState({});

  const [isOffline, setIsOffline] = useState(false);

  // Default Mock Data
  const mockVehicles = [
    {
      id: 'mock-v1',
      registration_number: 'MH-12-PQ-9876',
      name_model: 'Tata Prima 4025.S',
      type: 'Heavy Truck',
      max_load_capacity: 40000,
      odometer: 125430,
      acquisition_cost: 4500000,
      status: 'Available'
    },
    {
      id: 'mock-v2',
      registration_number: 'DL-01-AB-1234',
      name_model: 'Mahindra Blazo X 35',
      type: 'Medium Truck',
      max_load_capacity: 28000,
      odometer: 85200,
      acquisition_cost: 3200000,
      status: 'On Trip'
    },
    {
      id: 'mock-v3',
      registration_number: 'KA-03-XY-5678',
      name_model: 'Volvo FM 420',
      type: 'Heavy Truck',
      max_load_capacity: 49000,
      odometer: 245900,
      acquisition_cost: 6500000,
      status: 'In Shop'
    },
    {
      id: 'mock-v4',
      registration_number: 'GJ-01-ZZ-9999',
      name_model: 'Ashok Leyland Ecomet',
      type: 'Light Truck',
      max_load_capacity: 12000,
      odometer: 310500,
      acquisition_cost: 1800000,
      status: 'Retired'
    }
  ];

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    
    if (token === 'demo-token') {
      const stored = localStorage.getItem('transitops_mock_vehicles');
      if (stored) {
        setVehicles(JSON.parse(stored));
      } else {
        setVehicles(mockVehicles);
        localStorage.setItem('transitops_mock_vehicles', JSON.stringify(mockVehicles));
      }
      setIsOffline(true);
      setLoading(false);
      return;
    }

    try {
      let url = `${API_BASE_URL}/vehicles`;
      const params = [];
      if (statusFilter) params.push(`status=${statusFilter}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Backend failed');
      }

      const data = await response.json();
      setVehicles(data);
      setIsOffline(false);
    } catch (err) {
      console.warn("Backend connection failed. Falling back to local storage.", err);
      const stored = localStorage.getItem('transitops_mock_vehicles');
      if (stored) {
        setVehicles(JSON.parse(stored));
      } else {
        setVehicles(mockVehicles);
        localStorage.setItem('transitops_mock_vehicles', JSON.stringify(mockVehicles));
      }
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [token, statusFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      registration_number: '',
      name_model: '',
      type: 'Truck',
      max_load_capacity: '',
      odometer: '',
      acquisition_cost: '',
      status: 'Available'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditId(vehicle.id);
    setForm({
      registration_number: vehicle.registration_number,
      name_model: vehicle.name_model,
      type: vehicle.type,
      max_load_capacity: vehicle.max_load_capacity,
      odometer: vehicle.odometer,
      acquisition_cost: vehicle.acquisition_cost,
      status: vehicle.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedForm = {
      ...form,
      max_load_capacity: parseFloat(form.max_load_capacity),
      odometer: parseFloat(form.odometer || 0),
      acquisition_cost: parseFloat(form.acquisition_cost || 0)
    };

    if (isOffline) {
      let updatedVehicles;
      if (editId) {
        updatedVehicles = vehicles.map(v => v.id === editId ? { ...v, ...formattedForm } : v);
      } else {
        const newVehicle = {
          id: 'local-' + Date.now(),
          ...formattedForm
        };
        updatedVehicles = [newVehicle, ...vehicles];
      }
      setVehicles(updatedVehicles);
      localStorage.setItem('transitops_mock_vehicles', JSON.stringify(updatedVehicles));
      setIsModalOpen(false);
      return;
    }

    try {
      const url = editId 
        ? `${API_BASE_URL}/vehicles/${editId}` 
        : `${API_BASE_URL}/vehicles/`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to save vehicle');

      fetchVehicles();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error occurred while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    if (isOffline) {
      const updated = vehicles.filter(v => v.id !== id);
      setVehicles(updated);
      localStorage.setItem('transitops_mock_vehicles', JSON.stringify(updated));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');
      fetchVehicles();
    } catch (err) {
      setError('Could not delete vehicle');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-earth-sage/10 text-earth-sage border border-earth-sage/20';
      case 'On Trip':
        return 'bg-amber-600/10 text-amber-700 border border-amber-600/20';
      case 'In Shop':
        return 'bg-earth-clay/10 text-earth-clay border border-earth-clay/20';
      case 'Retired':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-earth-muted/10 text-earth-muted border border-earth-border';
    }
  };

  const openDocModal = (vehicle) => {
    setActiveDocVehicle(vehicle);
    setIsDocModalOpen(true);
    const savedDocs = localStorage.getItem('transitops_mock_docs');
    if (savedDocs) {
      setDocs(JSON.parse(savedDocs));
    }
  };

  const addMockDoc = (e) => {
    e.preventDefault();
    const docName = e.target.docName.value;
    if (!docName.trim()) return;

    const newDoc = {
      name: docName,
      date: new Date().toLocaleDateString(),
      size: '1.2 MB'
    };

    const updatedDocs = {
      ...docs,
      [activeDocVehicle.id]: [...(docs[activeDocVehicle.id] || []), newDoc]
    };

    setDocs(updatedDocs);
    localStorage.setItem('transitops_mock_docs', JSON.stringify(updatedDocs));
    e.target.reset();
  };

  const deleteDoc = (index) => {
    const updated = docs[activeDocVehicle.id].filter((_, i) => i !== index);
    const updatedDocs = {
      ...docs,
      [activeDocVehicle.id]: updated
    };
    setDocs(updatedDocs);
    localStorage.setItem('transitops_mock_docs', JSON.stringify(updatedDocs));
  };

  const filteredVehicles = vehicles.filter(v => 
    (v.name_model.toLowerCase().includes(search.toLowerCase()) || 
     v.registration_number.toLowerCase().includes(search.toLowerCase()) ||
     v.type.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === '' || v.status === statusFilter)
  );

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Vehicles Registry</h1>
          <p className="text-earth-muted mt-1 text-xs md:text-sm">Manage and track fleet transport vehicles.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-earth-clay hover:bg-earth-clay-hover text-white rounded-2xl font-bold shadow-md transition-all duration-200 cursor-pointer text-sm sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {isOffline && (
        <div className="bg-earth-clay/10 border border-earth-clay/20 text-earth-clay p-3.5 rounded-2xl mb-6 text-xs sm:text-sm flex items-center gap-2 text-left font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Running in <strong>Demo/Offline Mode</strong>. Records are saved locally.</span>
        </div>
      )}

      {/* Toolbar / Search Filters */}
      <div className="bg-earth-surface border border-earth-border rounded-3xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3 my-auto w-5 h-5 text-earth-muted" />
          <input
            type="text"
            placeholder="Search by model, registration, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-earth-bg border border-earth-border pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-earth-bg border border-earth-border px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 appearance-none cursor-pointer text-xs sm:text-sm text-earth-text"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Loader / Empty States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3 bg-earth-surface border border-earth-border rounded-3xl">
          <Loader2 className="w-8 h-8 text-earth-clay animate-spin" />
          <span className="text-earth-muted text-sm font-semibold">Loading fleet registry...</span>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-earth-surface border border-earth-border rounded-3xl">
          <div className="p-4 bg-earth-bg border border-earth-border rounded-full mb-4">
            <Truck className="w-8 h-8 text-earth-muted" />
          </div>
          <h3 className="font-bold text-base md:text-lg">No vehicles found</h3>
          <p className="text-earth-muted mt-1 max-w-sm text-xs sm:text-sm">No vehicles match your search query. Add a new one to get started.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-earth-surface border border-earth-border rounded-3xl overflow-hidden shadow-xs text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-earth-border bg-earth-surface/80 text-earth-muted text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Vehicle Info</th>
                    <th className="py-4 px-6">Reg Number</th>
                    <th className="py-4 px-6">Max capacity</th>
                    <th className="py-4 px-6">Odometer</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-earth-bg/50 transition-all duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-earth-clay/10 rounded-xl text-earth-clay flex items-center justify-center border border-earth-clay/10">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{vehicle.name_model}</p>
                            <span className="text-xs text-earth-muted font-bold">{vehicle.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm font-semibold">{vehicle.registration_number}</td>
                      <td className="py-4 px-6 text-sm">{vehicle.max_load_capacity.toLocaleString()} kg</td>
                      <td className="py-4 px-6 text-sm">{vehicle.odometer.toLocaleString()} km</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${getStatusBadgeClass(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDocModal(vehicle)}
                            className="p-2 text-earth-muted hover:text-earth-clay hover:bg-earth-clay/10 rounded-xl transition-all cursor-pointer"
                            title="Manage Documents"
                          >
                            <FileText className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(vehicle)}
                            className="p-2 text-earth-muted hover:text-earth-clay hover:bg-earth-clay/10 rounded-xl transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 text-earth-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (Extremely User Friendly) */}
          <div className="grid grid-cols-1 gap-4 md:hidden text-left">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-earth-surface border border-earth-border p-5 rounded-3xl shadow-xs space-y-4"
              >
                {/* Header: Title and Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-earth-clay/10 rounded-xl text-earth-clay border border-earth-clay/10">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-earth-text">{vehicle.name_model}</h4>
                      <span className="text-[10px] text-earth-muted font-extrabold uppercase tracking-wide">{vehicle.type}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide ${getStatusBadgeClass(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                {/* Specs: Capacity & Odometer */}
                <div className="grid grid-cols-2 gap-2 bg-earth-bg p-3 border border-earth-border rounded-2xl text-xs">
                  <div>
                    <span className="text-[9px] text-earth-muted font-bold uppercase tracking-wider block">Max Load</span>
                    <span className="font-bold text-earth-text">{vehicle.max_load_capacity.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-earth-muted font-bold uppercase tracking-wider block">Odometer</span>
                    <span className="font-bold text-earth-text">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] text-earth-muted font-bold block uppercase tracking-wider">Reg Number</span>
                    <span className="font-mono font-bold text-earth-text">{vehicle.registration_number}</span>
                  </div>
                </div>

                {/* Actions (Touch friendly: 48px height target zones) */}
                <div className="flex items-center gap-2 pt-2 border-t border-earth-border">
                  <button
                    onClick={() => openDocModal(vehicle)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-earth-bg hover:bg-earth-border border border-earth-border text-earth-text rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4" /> Docs
                  </button>
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-earth-bg hover:bg-earth-border border border-earth-border text-earth-text rounded-xl font-bold text-xs cursor-pointer"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="px-3.5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal (Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-earth-bg border border-earth-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-earth-border flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-earth-muted hover:text-earth-text font-bold text-sm cursor-pointer">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-left max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Model Name</label>
                  <input
                    type="text"
                    name="name_model"
                    required
                    placeholder="e.g. Tata Prima 4025.S"
                    value={form.name_model}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Reg Number</label>
                  <input
                    type="text"
                    name="registration_number"
                    required
                    placeholder="e.g. MH-12-PQ-9876"
                    value={form.registration_number}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text appearance-none"
                  >
                    <option value="Light Truck">Light Truck</option>
                    <option value="Medium Truck">Medium Truck</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                    <option value="Container">Container</option>
                    <option value="Trailer">Trailer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Max Load (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="max_load_capacity"
                      required
                      min="1"
                      placeholder="e.g. 24000"
                      value={form.max_load_capacity}
                      onChange={handleChange}
                      className="w-full bg-earth-surface border border-earth-border pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                    />
                    <Weight className="absolute right-3.5 inset-y-0 my-auto w-4.5 h-4.5 text-earth-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Odometer (km)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="odometer"
                      required
                      min="0"
                      placeholder="e.g. 45000"
                      value={form.odometer}
                      onChange={handleChange}
                      className="w-full bg-earth-surface border border-earth-border pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                    />
                    <Gauge className="absolute right-3.5 inset-y-0 my-auto w-4.5 h-4.5 text-earth-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Acquisition Cost</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="acquisition_cost"
                      required
                      min="0"
                      placeholder="e.g. 2500000"
                      value={form.acquisition_cost}
                      onChange={handleChange}
                      className="w-full bg-earth-surface border border-earth-border pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                    />
                    <span className="absolute left-3.5 inset-y-0 my-auto h-fit text-xs sm:text-sm text-earth-muted font-bold">₹</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text appearance-none"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-earth-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-initial px-5 py-3 bg-earth-surface hover:bg-earth-border border border-earth-border rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-3 bg-earth-clay hover:bg-earth-clay-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                >
                  {editId ? 'Save Changes' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Management Modal */}
      {isDocModalOpen && activeDocVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-earth-bg border border-earth-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-earth-border flex items-center justify-between text-left">
              <div>
                <h2 className="text-base font-extrabold">Documents Manager</h2>
                <p className="text-[10px] text-earth-muted mt-0.5">{activeDocVehicle.name_model} ({activeDocVehicle.registration_number})</p>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="text-earth-muted hover:text-earth-text font-bold text-xs cursor-pointer">Close</button>
            </div>
            
            <div className="p-5 space-y-6 text-left">
              <form onSubmit={addMockDoc} className="space-y-3">
                <label className="block text-[10px] font-bold text-earth-muted uppercase tracking-wider">Upload Vehicle Document (Mock)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="docName"
                    required
                    placeholder="e.g. Pollution Certificate"
                    className="flex-1 bg-earth-surface border border-earth-border px-3 py-2.5 rounded-xl focus:outline-none text-xs text-earth-text"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-earth-clay hover:bg-earth-clay-hover text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-earth-muted uppercase tracking-wide">Stored Documents</h4>
                {(!docs[activeDocVehicle.id] || docs[activeDocVehicle.id].length === 0) ? (
                  <div className="text-center p-6 border border-dashed border-earth-border rounded-2xl bg-earth-surface/50">
                    <FileText className="w-6 h-6 text-earth-muted mx-auto mb-1.5" />
                    <span className="text-xs text-earth-muted">No documents uploaded.</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {docs[activeDocVehicle.id].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-earth-surface border border-earth-border rounded-xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-earth-clay flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">{doc.name}</p>
                            <span className="text-[9px] text-earth-muted">{doc.date} • {doc.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDoc(idx)}
                          className="p-1 text-earth-muted hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
