import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Truck, 
  Users, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

export default function MainDashboard({ token }) {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    avgSafetyScore: 100,
    inShopVehicles: 0,
    availableDrivers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let vehicles = [];
        let drivers = [];

        if (token === 'demo-token') {
          const storedV = localStorage.getItem('transitops_mock_vehicles');
          vehicles = storedV ? JSON.parse(storedV) : [];
          const storedD = localStorage.getItem('transitops_mock_drivers');
          drivers = storedD ? JSON.parse(storedD) : [];
        } else {
          const resV = await fetch(`${API_BASE_URL}/vehicles`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const resD = await fetch(`${API_BASE_URL}/drivers/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resV.ok && resD.ok) {
            vehicles = await resV.json();
            drivers = await resD.json();
          } else {
            throw new Error();
          }
        }

        const totalV = vehicles.length;
        const activeV = vehicles.filter(v => v.status === 'On Trip').length;
        const inShopV = vehicles.filter(v => v.status === 'In Shop').length;
        const totalD = drivers.length;
        const availableD = drivers.filter(d => d.status === 'Available').length;
        const totalSafety = drivers.reduce((acc, curr) => acc + parseFloat(curr.safety_score), 0);
        const avgSafety = totalD > 0 ? Math.round(totalSafety / totalD) : 100;

        setStats({
          totalVehicles: totalV,
          activeVehicles: activeV,
          totalDrivers: totalD,
          avgSafetyScore: avgSafety,
          inShopVehicles: inShopV,
          availableDrivers: availableD
        });
      } catch (err) {
        console.warn("Failed loading stats. Resetting to defaults.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      title: 'Total Fleet Size',
      value: stats.totalVehicles,
      icon: Truck,
      color: 'from-earth-clay to-earth-clay/80',
      shadow: 'shadow-earth-clay/10',
      description: `${stats.inShopVehicles} Vehicles in Shop`
    },
    {
      title: 'Active Operations',
      value: stats.activeVehicles,
      icon: Activity,
      color: 'from-earth-sage to-earth-sage/80',
      shadow: 'shadow-earth-sage/10',
      description: 'Vehicles currently on route'
    },
    {
      title: 'Operator Database',
      value: stats.totalDrivers,
      icon: Users,
      color: 'from-amber-600 to-amber-700',
      shadow: 'shadow-amber-500/10',
      description: `${stats.availableDrivers} Drivers available`
    },
    {
      title: 'Fleet Safety Score',
      value: `${stats.avgSafetyScore}%`,
      icon: ShieldCheck,
      color: 'from-earth-muted to-earth-muted/80',
      shadow: 'shadow-stone-500/10',
      description: stats.avgSafetyScore >= 85 ? 'Excellent Rating' : 'Needs attention'
    }
  ];

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8 text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-earth-text">Fleet Command Center</h1>
        <p className="text-earth-muted mt-1 text-xs md:text-sm">Real-time status overview of TransitOps operations.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="bg-earth-surface border border-earth-border rounded-3xl p-5 md:p-6 shadow-xs relative overflow-hidden text-left"
            >
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${card.color}`}></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-earth-muted uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 bg-gradient-to-tr ${card.color} text-white rounded-xl shadow-md ${card.shadow}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-3xl font-extrabold tracking-tight text-earth-text">{card.value}</span>
                <p className="text-[11px] text-earth-muted font-bold">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Quick Operations Metrics */}
        <div className="bg-earth-surface border border-earth-border rounded-3xl p-5 md:p-6 shadow-xs lg:col-span-2">
          <h3 className="font-extrabold text-base md:text-lg mb-4 text-earth-text">Operational Status Distribution</h3>
          
          <div className="space-y-4 md:space-y-5">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-earth-muted uppercase tracking-wider mb-2">
                <span>Vehicles On Route (Utilization Rate)</span>
                <span>{stats.totalVehicles > 0 ? Math.round((stats.activeVehicles / stats.totalVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-earth-bg rounded-full overflow-hidden border border-earth-border">
                <div 
                  className="h-full bg-earth-clay rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalVehicles > 0 ? (stats.activeVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-earth-muted uppercase tracking-wider mb-2">
                <span>Vehicles In Maintenance</span>
                <span>{stats.totalVehicles > 0 ? Math.round((stats.inShopVehicles / stats.totalVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-earth-bg rounded-full overflow-hidden border border-earth-border">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalVehicles > 0 ? (stats.inShopVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-earth-muted uppercase tracking-wider mb-2">
                <span>Operator Readiness</span>
                <span>{stats.totalDrivers > 0 ? Math.round((stats.availableDrivers / stats.totalDrivers) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-earth-bg rounded-full overflow-hidden border border-earth-border">
                <div 
                  className="h-full bg-earth-sage rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalDrivers > 0 ? (stats.availableDrivers / stats.totalDrivers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Safety Summary Card */}
        <div className="bg-earth-surface border border-earth-border rounded-3xl p-5 md:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-earth-clay/5 rounded-full filter blur-[50px] pointer-events-none"></div>
          <div>
            <h3 className="font-extrabold text-base md:text-lg mb-1 text-earth-text">Safety Command Overview</h3>
            <p className="text-[11px] text-earth-muted font-bold">Compliance & Driving Auditing score summaries.</p>
          </div>
          
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-earth-border">
              <div className="text-center">
                <span className="text-2xl font-extrabold tracking-tight text-earth-text">{stats.avgSafetyScore}</span>
                <p className="text-[9px] text-earth-muted font-bold uppercase tracking-wider mt-0.5">Rating</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-earth-muted text-center font-bold bg-earth-bg p-3 rounded-2xl border border-earth-border">
            {stats.avgSafetyScore >= 90 
              ? "🟢 Excellent driving patterns detected across fleet operators." 
              : stats.avgSafetyScore >= 75 
              ? "🟡 Moderate safety compliance. Keep monitoring driver checklists."
              : "🔴 Critical: Average safety rating below threshold. Perform reviews."
            }
          </div>
        </div>
      </div>
    </div>
  );
}
