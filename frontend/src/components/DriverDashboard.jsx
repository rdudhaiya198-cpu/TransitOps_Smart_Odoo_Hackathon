import React, { useState, useEffect } from 'react';
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

  // Default Mock Data
  const mockDrivers = [
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
      license_expiry_date: '2024-03-12',
      contact_number: '+91 65432 10987',
      safety_score: 65,
      status: 'Suspended'
    }
  ];

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');

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
      let url = `${API_BASE_URL}/drivers/`;
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
  };

  useEffect(() => {
    fetchDrivers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formattedForm = {
      ...form,
      safety_score: parseFloat(form.safety_score || 100)
    };

    if (isOffline) {
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
        : `${API_BASE_URL}/drivers/`;
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
    } catch (err) {
      setError('Could not delete driver');
    }
  };

  const isLicenseExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-earth-sage/10 text-earth-sage border border-earth-sage/20';
      case 'On Trip':
        return 'bg-amber-600/10 text-amber-700 border border-amber-600/20';
      case 'Off Duty':
        return 'bg-earth-clay/10 text-earth-clay border border-earth-clay/20';
      case 'Suspended':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-earth-muted/10 text-earth-muted border border-earth-border';
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-earth-sage';
    if (score >= 75) return 'text-amber-600';
    return 'text-rose-600 dark:text-rose-400';
  };

  const filteredDrivers = drivers.filter(d => 
    (d.name.toLowerCase().includes(search.toLowerCase()) || 
     d.license_number.toLowerCase().includes(search.toLowerCase()) ||
     d.contact_number.includes(search)) &&
    (statusFilter === '' || d.status === statusFilter)
  );

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Drivers Registry</h1>
          <p className="text-earth-muted mt-1 text-xs md:text-sm">Manage transport operators, safety scores, and licenses.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-earth-clay hover:bg-earth-clay-hover text-white rounded-2xl font-bold shadow-md transition-all duration-200 cursor-pointer text-sm sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Add Driver
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
            placeholder="Search by name, license number, or phone..."
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Loader / Empty States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3 bg-earth-surface border border-earth-border rounded-3xl">
          <Loader2 className="w-8 h-8 text-earth-clay animate-spin" />
          <span className="text-earth-muted text-sm font-semibold">Loading drivers database...</span>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-earth-surface border border-earth-border rounded-3xl">
          <div className="p-4 bg-earth-bg border border-earth-border rounded-full mb-4">
            <Users className="w-8 h-8 text-earth-muted" />
          </div>
          <h3 className="font-bold text-base md:text-lg">No drivers found</h3>
          <p className="text-earth-muted mt-1 max-w-sm text-xs sm:text-sm">No drivers match your search query. Add a new driver operator to get started.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-earth-surface border border-earth-border rounded-3xl overflow-hidden shadow-xs text-left">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-earth-border bg-earth-surface/80 text-earth-muted text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Driver Info</th>
                    <th className="py-4 px-6">License Details</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Safety Score</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-border">
                  {filteredDrivers.map((driver) => {
                    const isExpired = isLicenseExpired(driver.license_expiry_date);
                    return (
                      <tr key={driver.id} className="hover:bg-earth-bg/50 transition-all duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-earth-clay/10 border border-earth-clay/20 flex items-center justify-center font-bold text-earth-clay">
                              {driver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{driver.name}</p>
                              <span className="text-[10px] bg-earth-bg text-earth-muted border border-earth-border px-1.5 py-0.5 rounded-md font-semibold tracking-wide">ID: {driver.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <p className="font-mono text-xs font-semibold text-earth-text">{driver.license_number}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-earth-muted bg-earth-bg border border-earth-border px-1.5 py-0.5 rounded">{driver.license_category}</span>
                              <span className={`text-[10px] flex items-center gap-1 font-semibold ${isExpired ? 'text-rose-500' : 'text-earth-muted'}`}>
                                <Calendar className="w-3 h-3" /> Exp: {driver.license_expiry_date}
                                {isExpired && <span className="text-[9px] bg-rose-500/10 text-rose-600 px-1 rounded border border-rose-500/20 font-bold">Expired</span>}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center gap-1 text-earth-muted font-medium">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{driver.contact_number}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <Award className={`w-4.5 h-4.5 ${getSafetyScoreColor(driver.safety_score)}`} />
                            <span className={`font-bold ${getSafetyScoreColor(driver.safety_score)}`}>{driver.safety_score}/100</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${getStatusBadgeClass(driver.status)}`}>
                            {driver.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(driver)}
                              className="p-2 text-earth-muted hover:text-earth-clay hover:bg-earth-clay/10 rounded-xl transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(driver.id)}
                              className="p-2 text-earth-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (Extremely User Friendly) */}
          <div className="grid grid-cols-1 gap-4 md:hidden text-left">
            {filteredDrivers.map((driver) => {
              const isExpired = isLicenseExpired(driver.license_expiry_date);
              return (
                <div 
                  key={driver.id} 
                  className="bg-earth-surface border border-earth-border p-5 rounded-3xl shadow-xs space-y-4"
                >
                  {/* Header: Driver Name & Initials icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-earth-clay/10 border border-earth-clay/20 flex items-center justify-center font-bold text-earth-clay">
                        {driver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-earth-text">{driver.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide ${getStatusBadgeClass(driver.status)}`}>
                          {driver.status}
                        </span>
                      </div>
                    </div>
                    {/* Safety Badge */}
                    <div className="flex items-center gap-1">
                      <Award className={`w-4 h-4 ${getSafetyScoreColor(driver.safety_score)}`} />
                      <span className={`font-extrabold text-xs ${getSafetyScoreColor(driver.safety_score)}`}>{driver.safety_score}</span>
                    </div>
                  </div>

                  {/* License Info Panel */}
                  <div className="bg-earth-bg p-3 border border-earth-border rounded-2xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-earth-muted font-bold uppercase tracking-wider">License Number</span>
                      <span className="font-mono font-bold text-earth-text">{driver.license_number}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-earth-border pt-2">
                      <span className="text-[9px] text-earth-muted font-bold uppercase tracking-wider">Expiration</span>
                      <span className={`font-semibold flex items-center gap-1 ${isExpired ? 'text-rose-500 font-bold' : 'text-earth-text'}`}>
                        <Calendar className="w-3.5 h-3.5 text-earth-muted" /> {driver.license_expiry_date}
                        {isExpired && <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1 rounded font-extrabold">Expired</span>}
                      </span>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] text-earth-muted font-bold block uppercase tracking-wider">Contact Number</span>
                      <span className="font-semibold text-earth-text flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-earth-muted" /> {driver.contact_number}
                      </span>
                    </div>
                    <span className="text-[9px] text-earth-muted bg-earth-bg border border-earth-border px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">{driver.license_category}</span>
                  </div>

                  {/* Actions (Touch friendly: 48px target zone) */}
                  <div className="flex items-center gap-2 pt-2 border-t border-earth-border">
                    <button
                      onClick={() => openEditModal(driver)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-earth-bg hover:bg-earth-border border border-earth-border text-earth-text rounded-xl font-bold text-xs cursor-pointer"
                    >
                      <Edit className="w-4.5 h-4.5" /> Edit Operator
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="px-3.5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl font-bold text-xs cursor-pointer"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add/Edit Modal (Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-earth-bg border border-earth-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-earth-border flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{editId ? 'Edit Operator' : 'Add New Operator'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-earth-muted hover:text-earth-text font-bold text-sm cursor-pointer">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-left max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Driver Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">License Number</label>
                  <input
                    type="text"
                    name="license_number"
                    required
                    placeholder="e.g. DL-1420180098765"
                    value={form.license_number}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">License Category</label>
                  <input
                    type="text"
                    name="license_category"
                    required
                    placeholder="e.g. Commercial Heavy"
                    value={form.license_category}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">License Expiry Date</label>
                  <input
                    type="date"
                    name="license_expiry_date"
                    required
                    value={form.license_expiry_date}
                    onChange={handleChange}
                    className="w-full bg-earth-surface border border-earth-border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Contact Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="contact_number"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={form.contact_number}
                      onChange={handleChange}
                      className="w-full bg-earth-surface border border-earth-border pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                    />
                    <Phone className="absolute right-3.5 inset-y-0 my-auto w-4.5 h-4.5 text-earth-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-earth-muted mb-1.5 uppercase tracking-wider">Safety Score (0-100)</label>
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
                      className="w-full bg-earth-surface border border-earth-border pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-clay/40 text-xs sm:text-sm text-earth-text placeholder-earth-muted"
                    />
                    <Award className="absolute right-3.5 inset-y-0 my-auto w-4.5 h-4.5 text-earth-muted" />
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
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
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
