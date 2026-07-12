import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Truck, 
  Users, 
  Activity, 
  ShieldCheck, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockVehicles = [
  { id: 'mock-v1', registration_number: 'MH-12-PQ-9876', name_model: 'Tata Prima 4025.S', type: 'Heavy Truck', max_load_capacity: 40000, odometer: 125430, acquisition_cost: 4500000, status: 'Available' },
  { id: 'mock-v2', registration_number: 'DL-01-AB-1234', name_model: 'Mahindra Blazo X 35', type: 'Medium Truck', max_load_capacity: 28000, odometer: 85200, acquisition_cost: 3200000, status: 'On Trip' },
  { id: 'mock-v3', registration_number: 'KA-03-XY-5678', name_model: 'Volvo FM 420', type: 'Heavy Truck', max_load_capacity: 49000, odometer: 245900, acquisition_cost: 6500000, status: 'In Shop' },
  { id: 'mock-v4', registration_number: 'GJ-01-ZZ-9999', name_model: 'Ashok Leyland Ecomet', type: 'Light Truck', max_load_capacity: 12000, odometer: 310500, acquisition_cost: 1800000, status: 'Retired' }
];

const mockDrivers = [
  { id: 'mock-d1', name: 'Rajesh Kumar', license_number: 'DL-1420180098765', license_category: 'Commercial Heavy', license_expiry_date: '2028-12-15', contact_number: '+91 98765 43210', safety_score: 95, status: 'Available' },
  { id: 'mock-d2', name: 'Amit Patel', license_number: 'GJ-0120150012345', license_category: 'Commercial Heavy', license_expiry_date: '2029-05-20', contact_number: '+91 87654 32109', safety_score: 88, status: 'On Trip' },
  { id: 'mock-d3', name: 'Vikram Singh', license_number: 'HR-2620120054321', license_category: 'Medium Vehicle', license_expiry_date: '2025-09-10', contact_number: '+91 76543 21098', safety_score: 92, status: 'Off Duty' },
  { id: 'mock-d4', name: 'Suresh Sharma', license_number: 'MH-1220100067890', license_category: 'Commercial Heavy', license_expiry_date: '2024-03-12', contact_number: '+91 65432 10987', safety_score: 65, status: 'Suspended' }
];

export default function MainDashboard({ token }) {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    avgSafetyScore: 100,
    inShopVehicles: 0,
    availableDrivers: 0,
    activeTrips: 0,
    fleetUtilization: 0,
    totalCosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        let vehicles = [];
        let drivers = [];
        let kpis = {
            active_vehicles: 0,
            vehicles_in_maintenance: 0,
            active_trips: 0,
            fleet_utilization_percent: 0,
            total_operational_costs: 0
        };

        if (token === 'demo-token') {
          // Demo/offline mode
          const storedV = localStorage.getItem('transitops_mock_vehicles');
          vehicles = storedV ? JSON.parse(storedV) : mockVehicles;
          if (!storedV) localStorage.setItem('transitops_mock_vehicles', JSON.stringify(mockVehicles));

          const storedD = localStorage.getItem('transitops_mock_drivers');
          drivers = storedD ? JSON.parse(storedD) : mockDrivers;
          if (!storedD) localStorage.setItem('transitops_mock_drivers', JSON.stringify(mockDrivers));

          kpis = {
            active_vehicles: vehicles.filter(v => v.status === 'On Trip').length,
            vehicles_in_maintenance: vehicles.filter(v => v.status === 'In Shop').length,
            active_trips: vehicles.filter(v => v.status === 'On Trip').length,
            fleet_utilization_percent: vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100) : 0,
            total_operational_costs: 45000
          };
          setIsOffline(true);
        } else {
          // Try to fetch from backend API
          try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [resV, resD, resKPI] = await Promise.all([
              fetch(`${API_BASE_URL}/vehicles`, { headers }),
              fetch(`${API_BASE_URL}/drivers`, { headers }),
              fetch(`${API_BASE_URL}/dashboard/kpis`, { headers })
            ]);
            
            if (resV.ok && resD.ok && resKPI.ok) {
              vehicles = await resV.json();
              drivers = await resD.json();
              kpis = await resKPI.json();
              setIsOffline(false);
            } else {
              throw new Error("One or more APIs responded with an error");
            }
          } catch (apiErr) {
            console.warn("Backend API failed. Falling back to local storage / mock data in dashboard.");
            const storedV = localStorage.getItem('transitops_mock_vehicles');
            vehicles = storedV ? JSON.parse(storedV) : mockVehicles;
            const storedD = localStorage.getItem('transitops_mock_drivers');
            drivers = storedD ? JSON.parse(storedD) : mockDrivers;
            kpis = {
              active_vehicles: vehicles.filter(v => v.status === 'On Trip').length,
              vehicles_in_maintenance: vehicles.filter(v => v.status === 'In Shop').length,
              active_trips: vehicles.filter(v => v.status === 'On Trip').length,
              fleet_utilization_percent: vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100) : 0,
              total_operational_costs: 45000
            };
            setIsOffline(true);
          }
        }

        const totalV = vehicles.length;
        const totalD = drivers.length;
        const availableD = drivers.filter(d => d.status === 'Available').length;
        const totalSafety = drivers.reduce((acc, curr) => acc + parseFloat(curr.safety_score), 0);
        const avgSafety = totalD > 0 ? Math.round(totalSafety / totalD) : 100;

        setStats({
          totalVehicles: totalV,
          activeVehicles: kpis.active_vehicles || 0,
          totalDrivers: totalD,
          avgSafetyScore: avgSafety,
          inShopVehicles: kpis.vehicles_in_maintenance || 0,
          availableDrivers: availableD,
          activeTrips: kpis.active_trips || 0,
          fleetUtilization: kpis.fleet_utilization_percent || 0,
          totalCosts: kpis.total_operational_costs || 0
        });
      } catch (err) {
        console.warn("Failed loading stats. Resetting to defaults.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/10',
      description: 'Trips currently dispatched'
    },
    {
      title: 'Fleet Utilization',
      value: `${stats.fleetUtilization}%`,
      icon: Truck,
      color: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/10',
      description: `${stats.activeVehicles} active vehicles`
    },
    {
      title: 'Operational Costs',
      value: `$${stats.totalCosts}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      description: 'Total expenses & fuel'
    },
    {
      title: 'Fleet Safety Score',
      value: `${stats.avgSafetyScore}%`,
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/10',
      description: stats.avgSafetyScore >= 85 ? 'Excellent Safety Rating' : 'Needs attention'
    }
  ];

  // Dummy chart data for demo purposes if backend isn't returning timeseries yet.
  const costData = [
    { name: 'Mon', cost: Math.max(stats.totalCosts * 0.1, 100) },
    { name: 'Tue', cost: Math.max(stats.totalCosts * 0.2, 150) },
    { name: 'Wed', cost: Math.max(stats.totalCosts * 0.15, 120) },
    { name: 'Thu', cost: Math.max(stats.totalCosts * 0.25, 200) },
    { name: 'Fri', cost: Math.max(stats.totalCosts * 0.3, 250) },
  ];

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="mobile-title text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Fleet Command Center</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Real-time status overview of TransitOps operations.</p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-[6px] mb-6 text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <span>Running in <strong>Demo/Offline Mode</strong>. Records are saved locally in your browser.</span>
        </div>
      )}

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`app-panel bg-white border border-[var(--color-border)] rounded-[6px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 bg-[var(--color-surface)] text-[var(--color-primary)] rounded-[6px]`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="mobile-title text-3xl font-bold tracking-tight text-[var(--color-text-main)]">{loading ? '...' : card.value}</span>
                <p className="text-xs text-[var(--color-text-muted)] font-medium">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Chart (Recharts) */}
        <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-text-main)]">Weekly Operational Costs (Simulated)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-surface)' }}
                  contentStyle={{ borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--app-panel)', color: 'var(--color-text-main)', boxShadow: 'var(--app-shadow)' }}
                />
                <Bar dataKey="cost" fill="#714B67" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Safety Summary Card */}
        <div className="app-panel bg-white border border-[var(--color-border)] rounded-[6px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1.5 text-[var(--color-text-main)]">Safety Command Overview</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Compliance & Driving Auditing score summaries.</p>
          </div>
          
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-[3px] border-[var(--color-primary-light)]">
              <div className="text-center">
                <span className="text-3xl font-bold tracking-tight text-[var(--color-primary)]">{stats.avgSafetyScore}</span>
                <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider mt-0.5">Rating</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-[var(--color-text-main)] text-center font-medium bg-[var(--color-surface)] p-3 rounded-[6px] border border-[var(--color-border)]">
            {stats.avgSafetyScore >= 90 
              ? "Excellent driving patterns detected across fleet operators." 
              : stats.avgSafetyScore >= 75 
              ? "Moderate safety compliance. Keep monitoring driver checklists."
              : "Critical: Average safety rating below threshold. Perform reviews."
            }
          </div>
        </div>
      </div>
    </div>
  );
}
