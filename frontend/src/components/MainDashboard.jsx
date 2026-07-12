import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Truck, 
  Users, 
  Award, 
  Clock, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Wrench 
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
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        let vehicles = [];
        let drivers = [];

        if (token === 'demo-token') {
          // Demo/offline mode
          const storedV = localStorage.getItem('transitops_mock_vehicles');
          vehicles = storedV ? JSON.parse(storedV) : [];
          const storedD = localStorage.getItem('transitops_mock_drivers');
          drivers = storedD ? JSON.parse(storedD) : [];
        } else {
          // Try to fetch from backend API
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
      color: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/10',
      description: `${stats.inShopVehicles} Vehicles currently in Shop`
    },
    {
      title: 'Active Operations',
      value: stats.activeVehicles,
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/10',
      description: 'Vehicles currently on route'
    },
    {
      title: 'Operator Database',
      value: stats.totalDrivers,
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      description: `${stats.availableDrivers} Drivers ready for trip`
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

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Fleet Command Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time status overview of TransitOps operations.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
            >
              {/* Background gradient bar */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${card.color}`}></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 bg-gradient-to-tr ${card.color} text-white rounded-xl shadow-lg ${card.shadow}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-4xl font-extrabold tracking-tight">{card.value}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-extrabold text-lg mb-4">Operational Status Distribution</h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Vehicles On Route (Utilization Rate)</span>
                <span>{stats.totalVehicles > 0 ? Math.round((stats.activeVehicles / stats.totalVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalVehicles > 0 ? (stats.activeVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Vehicles In Maintenance</span>
                <span>{stats.totalVehicles > 0 ? Math.round((stats.inShopVehicles / stats.totalVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalVehicles > 0 ? (stats.inShopVehicles / stats.totalVehicles) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Operator Readiness</span>
                <span>{stats.totalDrivers > 0 ? Math.round((stats.availableDrivers / stats.totalDrivers) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.totalDrivers > 0 ? (stats.availableDrivers / stats.totalDrivers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Safety Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full filter blur-[80px] opacity-20"></div>
          <div>
            <h3 className="font-extrabold text-lg mb-1.5 text-white">Safety Command Overview</h3>
            <p className="text-xs text-slate-400">Compliance & Driving Auditing score summaries.</p>
          </div>
          
          <div className="my-6 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-slate-800">
              <div className="text-center">
                <span className="text-3xl font-extrabold tracking-tight">{stats.avgSafetyScore}</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Rating</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center font-medium bg-slate-850 p-3 rounded-2xl border border-slate-800">
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
