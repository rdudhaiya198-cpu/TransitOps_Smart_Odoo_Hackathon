import { useCallback, useMemo, useState, useEffect } from 'react';
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
  
  // Document Management State (Mock feature)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeDocVehicle, setActiveDocVehicle] = useState(null);
  const [docs, setDocs] = useState({}); // {vehicleId: [{name: '', date: ''}]}

  const [isOffline, setIsOffline] = useState(false);

  // Default Mock Data for Offline fallback
  const mockVehicles = useMemo(() => [
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
  ], []);

  // Fetch Vehicles
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    
    // If it's a demo token, load mockup immediately
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
      if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
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
      // Fallback
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
  }, [mockVehicles, search, statusFilter, token]);

  useEffect(() => {
    // fetchVehicles is intentionally kept as a local workflow helper.
    fetchVehicles();
  }, [fetchVehicles]);

  // Handle Form Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Open Modal for Add
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

  // Open Modal for Edit
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

  // Submit Form (Add/Edit)
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
      // Offline implementation
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
        : `${API_BASE_URL}/vehicles`;
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

  // Delete Vehicle
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
    } catch {
      setError('Could not delete vehicle');
    }
  };

  // Status Badge Design helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'On Trip':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'In Shop':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Retired':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  // Document Management mock actions
  const openDocModal = (vehicle) => {
    setActiveDocVehicle(vehicle);
    setIsDocModalOpen(true);
    
    // Load documents
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

  // Filter logic
  const filteredVehicles = vehicles.filter(v => 
    (v.name_model.toLowerCase().includes(search.toLowerCase()) || 
     v.registration_number.toLowerCase().includes(search.toLowerCase()) ||
     v.type.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === '' || v.status === statusFilter)
  );

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Vehicles Registry</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage and track fleet transport vehicles.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[6px] font-medium transition-all duration-200"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-2xl mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {isOffline && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-3 rounded-2xl mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Running in <strong>Demo/Offline Mode</strong>. All additions and edits will be stored in your local browser storage.</span>
        </div>
      )}

      {/* Toolbar / Search Filters */}
      <div className="bg-white border border-[var(--color-border)] rounded-[6px] p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3 my-auto w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model, registration, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[var(--color-border)] pl-10 pr-4 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--color-text-main)]"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-[var(--color-border)] px-4 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--color-text-main)] appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-[var(--color-border)] rounded-[6px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <span className="text-[var(--color-text-muted)]">Loading fleet registry...</span>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="p-4 bg-[var(--color-surface)] rounded-full mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-[var(--color-text-main)]">No vehicles found</h3>
            <p className="text-[var(--color-text-muted)] mt-1 max-w-sm">No vehicles match your search query. Add a new one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Vehicle Info</th>
                  <th className="py-3 px-6">Reg Number</th>
                  <th className="py-3 px-6">Max capacity</th>
                  <th className="py-3 px-6">Odometer</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-[var(--color-surface)] transition-all duration-150">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-[6px] flex items-center justify-center">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--color-text-main)]">{vehicle.name_model}</p>
                          <span className="text-xs text-[var(--color-text-muted)]">{vehicle.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm font-semibold">{vehicle.registration_number}</td>
                    <td className="py-4 px-6 text-sm">{vehicle.max_load_capacity.toLocaleString()} kg</td>
                    <td className="py-4 px-6 text-sm">{vehicle.odometer.toLocaleString()} km</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeClass(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDocModal(vehicle)}
                          className="p-2 text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-xl transition-all"
                          title="Manage Documents"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[var(--color-border)] rounded-[6px] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Model Name</label>
                  <input
                    type="text"
                    name="name_model"
                    required
                    placeholder="e.g. Tata Prima 4025.S"
                    value={form.name_model}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Reg Number</label>
                  <input
                    type="text"
                    name="registration_number"
                    required
                    placeholder="e.g. MH-12-PQ-9876"
                    value={form.registration_number}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  >
                    <option value="Light Truck">Light Truck</option>
                    <option value="Medium Truck">Medium Truck</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                    <option value="Container">Container</option>
                    <option value="Trailer">Trailer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Load (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="max_load_capacity"
                      required
                      min="1"
                      placeholder="e.g. 24000"
                      value={form.max_load_capacity}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] pl-3 pr-10 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                    <Weight className="absolute right-3.5 inset-y-0 my-auto w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Odometer (km)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="odometer"
                      required
                      min="0"
                      placeholder="e.g. 45000"
                      value={form.odometer}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] pl-3 pr-10 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                    <Gauge className="absolute right-3.5 inset-y-0 my-auto w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Acquisition Cost</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="acquisition_cost"
                      required
                      min="0"
                      placeholder="e.g. 2500000"
                      value={form.acquisition_cost}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] pl-8 pr-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                    <span className="absolute left-3.5 inset-y-0 my-auto h-fit text-sm text-slate-400 font-bold">Rs.</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-gray-50 rounded-[6px] text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[6px] text-sm font-medium transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-[6px] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-main)]">Documents Manager</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{activeDocVehicle.name_model} ({activeDocVehicle.registration_number})</p>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">Close</button>
            </div>
            
            <div className="p-5 space-y-5">
              {/* Add Doc Form */}
              <form onSubmit={addMockDoc} className="space-y-3">
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase">Upload Vehicle Document (Mock)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="docName"
                    required
                    placeholder="e.g. Pollution Certificate, Insurance"
                    className="flex-1 bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] text-[var(--color-text-main)] text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[6px] text-sm font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Docs List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">Stored Documents</h4>
                {(!docs[activeDocVehicle.id] || docs[activeDocVehicle.id].length === 0) ? (
                  <div className="text-center p-6 border border-dashed border-[var(--color-border)] rounded-[6px]">
                    <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                    <span className="text-xs text-[var(--color-text-muted)]">No documents uploaded.</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {docs[activeDocVehicle.id].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[var(--color-border)] rounded-[6px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--color-text-main)] truncate leading-tight">{doc.name}</p>
                            <span className="text-[9px] text-[var(--color-text-muted)]">{doc.date} - {doc.size}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDoc(idx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-[4px] hover:bg-red-50 transition"
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
