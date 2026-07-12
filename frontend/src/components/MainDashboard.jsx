import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Truck, 
  Users, 
  Activity, 
  ShieldCheck, 
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
          vehicles = storedV ? JSON.parse(storedV) : [];
          const storedD = localStorage.getItem('transitops_mock_drivers');
          drivers = storedD ? JSON.parse(storedD) : [];
        } else {
          // Try to fetch from backend API
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
          } else {
            console.warn("One or more API requests failed");
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
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">Fleet Command Center</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Real-time status overview of TransitOps operations.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white border border-[var(--color-border)] rounded-[6px] p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 bg-[var(--color-surface)] text-[var(--color-primary)] rounded-[6px]`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">{loading ? '...' : card.value}</span>
                <p className="text-xs text-[var(--color-text-muted)] font-medium">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Chart (Recharts) */}
        <div className="bg-white border border-[var(--color-border)] rounded-[6px] p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-text-main)]">Weekly Operational Costs (Simulated)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6C757D' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6C757D' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-surface)' }}
                  contentStyle={{ borderRadius: '6px', border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="cost" fill="#714B67" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Safety Summary Card */}
        <div className="bg-white border border-[var(--color-border)] rounded-[6px] p-6 shadow-sm flex flex-col justify-between">
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
