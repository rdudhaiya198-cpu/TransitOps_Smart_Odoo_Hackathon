import { useCallback, useMemo, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2, 
  Users, 
  AlertCircle, 
  Calendar, 
  Phone, 
  Award
} from 'lucide-react';

export default function DriverDashboard({ token }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    license_number: '',
    license_category: 'Heavy',
    license_expiry_date: '',
    contact_number: '',
    safety_score: '100',
    status: 'Available'
  });

  const [isOffline, setIsOffline] = useState(false);

  // Default Mock Data for Offline fallback
  const mockDrivers = useMemo(() => [
    {
      id: 'mock-d1',
      name: 'Rajesh Kumar',
      license_number: 'DL-1420180098765',
      license_category: 'Commercial Heavy',
      license_expiry_date: '2028-12-15',
      contact_number: '+91 98765 43210',
      safety_score: 95,
      status: 'Available'
    },
    {
      id: 'mock-d2',
      name: 'Amit Patel',
      license_number: 'GJ-0120150012345',
      license_category: 'Commercial Heavy',
      license_expiry_date: '2029-05-20',
      contact_number: '+91 87654 32109',
      safety_score: 88,
      status: 'On Trip'
    },
    {
      id: 'mock-d3',
      name: 'Vikram Singh',
      license_number: 'HR-2620120054321',
      license_category: 'Medium Vehicle',
      license_expiry_date: '2025-09-10',
      contact_number: '+91 76543 21098',
      safety_score: 92,
      status: 'Off Duty'
    },
    {
      id: 'mock-d4',
      name: 'Suresh Sharma',
      license_number: 'MH-1220100067890',
      license_category: 'Commercial Heavy',
      license_expiry_date: '2024-03-12', // Expired license
      contact_number: '+91 65432 10987',
      safety_score: 65,
      status: 'Suspended'
    }
  ], []);

  // Fetch Drivers
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError('');

    // If it's a demo token, load mockup immediately
    if (token === 'demo-token') {
      const stored = localStorage.getItem('transitops_mock_drivers');
      if (stored) {
        setDrivers(JSON.parse(stored));
      } else {
        setDrivers(mockDrivers);
        localStorage.setItem('transitops_mock_drivers', JSON.stringify(mockDrivers));
      }
      setIsOffline(true);
      setLoading(false);
      return;
    }

    try {
      let url = `${API_BASE_URL}/drivers`;
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
      setDrivers(data);
      setIsOffline(false);
    } catch (err) {
      console.warn("Backend connection failed. Falling back to local storage.", err);
      // Fallback
      const stored = localStorage.getItem('transitops_mock_drivers');
      if (stored) {
        setDrivers(JSON.parse(stored));
      } else {
        setDrivers(mockDrivers);
        localStorage.setItem('transitops_mock_drivers', JSON.stringify(mockDrivers));
      }
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [mockDrivers, search, statusFilter, token]);

  useEffect(() => {
    // fetchDrivers is intentionally kept as a local workflow helper.
    fetchDrivers();
  }, [fetchDrivers]);

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
      name: '',
      license_number: '',
      license_category: 'Commercial Heavy',
      license_expiry_date: '',
      contact_number: '',
      safety_score: '100',
      status: 'Available'
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (driver) => {
    setEditId(driver.id);
    setForm({
      name: driver.name,
      license_number: driver.license_number,
      license_category: driver.license_category,
      license_expiry_date: driver.license_expiry_date,
      contact_number: driver.contact_number,
      safety_score: driver.safety_score.toString(),
      status: driver.status
    });
    setIsModalOpen(true);
  };

  // Submit Form (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedForm = {
      ...form,
      safety_score: parseFloat(form.safety_score || 100)
    };

    if (isOffline) {
      // Offline implementation
      let updatedDrivers;
      if (editId) {
        updatedDrivers = drivers.map(d => d.id === editId ? { ...d, ...formattedForm } : d);
      } else {
        const newDriver = {
          id: 'local-' + Date.now(),
          ...formattedForm
        };
        updatedDrivers = [newDriver, ...drivers];
      }
      setDrivers(updatedDrivers);
      localStorage.setItem('transitops_mock_drivers', JSON.stringify(updatedDrivers));
      setIsModalOpen(false);
      return;
    }

    try {
      const url = editId 
        ? `${API_BASE_URL}/drivers/${editId}` 
        : `${API_BASE_URL}/drivers`;
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
      if (!response.ok) throw new Error(data.detail || 'Failed to save driver');

      fetchDrivers();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error occurred while saving');
    }
  };

  // Delete Driver
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    if (isOffline) {
      const updated = drivers.filter(d => d.id !== id);
      setDrivers(updated);
      localStorage.setItem('transitops_mock_drivers', JSON.stringify(updated));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');
      fetchDrivers();
    } catch {
      setError('Could not delete driver');
    }
  };

  // Check if License is Expired
  const isLicenseExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Status Badge Design helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'On Trip':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Off Duty':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Suspended':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  // Safety Score Color helper
  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-rose-500';
  };

  // Filter logic
  const filteredDrivers = drivers.filter(d => 
    (d.name.toLowerCase().includes(search.toLowerCase()) || 
     d.license_number.toLowerCase().includes(search.toLowerCase()) ||
     d.contact_number.includes(search)) &&
    (statusFilter === '' || d.status === statusFilter)
  );

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Drivers Registry</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage transport operators, safety scores, and licenses.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-[6px] font-medium transition-all duration-200"
        >
          <Plus className="w-5 h-5" /> Add Driver
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
          <span>Running in <strong>Demo/Offline Mode</strong>. All edits will be stored in your local browser storage.</span>
        </div>
      )}

      {/* Toolbar / Search Filters */}
      <div className="bg-white border border-[var(--color-border)] rounded-[6px] p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3 my-auto w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, license number, or phone..."
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-[var(--color-border)] rounded-[6px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <span className="text-[var(--color-text-muted)]">Loading drivers database...</span>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="p-4 bg-[var(--color-surface)] rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-[var(--color-text-main)]">No drivers found</h3>
            <p className="text-[var(--color-text-muted)] mt-1 max-w-sm">No drivers match your search query. Add a new driver operator to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Driver Info</th>
                  <th className="py-3 px-6">License Details</th>
                  <th className="py-3 px-6">Contact Details</th>
                  <th className="py-3 px-6">Safety Score</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredDrivers.map((driver) => {
                  const isExpired = isLicenseExpired(driver.license_expiry_date);
                  return (
                    <tr key={driver.id} className="hover:bg-[var(--color-surface)] transition-all duration-150">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[6px] bg-[var(--color-primary-light)] border border-[var(--color-primary-light)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                            {driver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[var(--color-text-main)]">{driver.name}</p>
                            <span className="text-[10px] bg-[var(--color-surface)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded-[4px] font-semibold tracking-wide border border-[var(--color-border)]">ID: {driver.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="space-y-1">
                          <p className="font-mono text-xs font-semibold text-[var(--color-text-main)]">{driver.license_number}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">{driver.license_category}</span>
                            <span className={`text-[10px] flex items-center gap-1 font-semibold ${isExpired ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                              <Calendar className="w-3 h-3" /> Exp: {driver.license_expiry_date}
                              {isExpired && <span className="text-[9px] bg-red-50 text-red-600 px-1 rounded border border-red-200">Expired</span>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{driver.contact_number}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1.5">
                          <Award className={`w-4 h-4 ${getSafetyScoreColor(driver.safety_score)}`} />
                          <span className={`font-bold ${getSafetyScoreColor(driver.safety_score)}`}>{driver.safety_score}/100</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeClass(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(driver)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(driver.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">{editId ? 'Edit Operator' : 'Add New Operator'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Driver Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">License Number</label>
                  <input
                    type="text"
                    name="license_number"
                    required
                    placeholder="e.g. DL-1420180098765"
                    value={form.license_number}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">License Category</label>
                  <input
                    type="text"
                    name="license_category"
                    required
                    placeholder="e.g. Commercial Heavy, LMV"
                    value={form.license_category}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">License Expiry Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="license_expiry_date"
                      required
                      value={form.license_expiry_date}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] px-3 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Contact Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="contact_number"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={form.contact_number}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] pl-3 pr-10 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                    <Phone className="absolute right-3.5 inset-y-0 my-auto w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Safety Score (0-100)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="safety_score"
                      required
                      min="0"
                      max="100"
                      placeholder="100"
                      value={form.safety_score}
                      onChange={handleChange}
                      className="w-full bg-white border border-[var(--color-border)] pl-3 pr-10 py-2 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm text-[var(--color-text-main)]"
                    />
                    <Award className="absolute right-3.5 inset-y-0 my-auto w-4 h-4 text-slate-400" />
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
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
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
                  {editId ? 'Save Changes' : 'Create Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
