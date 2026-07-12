import React from 'react';
import { 
  Shield, 
  Truck, 
  Users, 
  FileText, 
  ArrowRight, 
  Activity, 
  Layers, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';

export default function LandingPage({ onLaunchConsole }) {
  const features = [
    {
      icon: Truck,
      title: 'Central Fleet Registry',
      description: 'Track and monitor active vs idle heavy carriers, loads capacity, and logs in real-time.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: Users,
      title: 'Operator Performance Profiles',
      description: 'Audit safety ratings and license expirations to ensure full transport regulation compliance.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: FileText,
      title: 'Digital Permit Storage',
      description: 'Manage fitness, insurance, and PUC certificates safely with mock file uploads.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold tracking-wide text-lg text-white">
              Transit<span className="text-purple-400">Ops</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#tech" className="hover:text-purple-400 transition-colors">Tech Stack</a>
          </div>

          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/10 transition-all duration-200"
          >
            Launch Console <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold tracking-wide text-purple-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Hackathon Edition 2026
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
          Optimize Your Fleet Operations with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
            Intelligent Tracking
          </span>
        </h1>

        <p className="text-slate-400 mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          TransitOps is a unified management console built for fleet administrators, safety compliance teams, and logistical operators. Monitor capacities, safety scores, and licenses.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all duration-200"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="https://github.com/rdudhaiya198-cpu/TransitOps_Smart_Odoo_Hackathon"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-2xl transition-all duration-200"
          >
            View Repository
          </a>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div className="mt-16 max-w-5xl mx-auto relative rounded-3xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl p-3 shadow-2xl shadow-purple-500/5">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-10 filter blur-[15px] pointer-events-none"></div>
          
          <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden p-4 md:p-6 text-left">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-bold text-slate-600 ml-2 uppercase tracking-widest">TransitOps Console</span>
              </div>
              <div className="w-48 h-3 bg-slate-900 rounded-full"></div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Utilization Rate</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">84%</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                </div>
                <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[84%]"></div>
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Active Carriers</span>
                <span className="text-2xl font-bold block">14 / 18</span>
                <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[78%]"></div>
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Safety Compliance</span>
                <span className="text-2xl font-bold block text-emerald-400">92%</span>
                <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 border-t border-slate-900 bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Full Operational Control</h2>
            <p className="text-slate-400 mt-2">Every feature designed to streamline transport logistics workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-900/25 border border-slate-900 hover:border-slate-800/80 p-8 rounded-3xl transition-all duration-200 group hover:shadow-lg"
                >
                  <div className={`p-3 w-fit rounded-2xl border ${feature.color} mb-6 transition-transform group-hover:scale-105 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section id="tech" className="relative z-10 border-t border-slate-900 py-20 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Under the Hood</span>
          <h3 className="text-2xl font-extrabold text-white mt-2 mb-10">Built with Hackathon Stack</h3>
          
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
            {['FastAPI', 'Supabase', 'React 19', 'Vite 8', 'Tailwind CSS v4'].map((tech, idx) => (
              <div 
                key={idx} 
                className="px-5 py-2.5 bg-slate-900/60 border border-slate-800/60 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 border-t border-slate-900 py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to Deploy Your Operations?</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Configure your local Supabase database keys or click the demo toggle to preview now.
          </p>
          <button
            onClick={onLaunchConsole}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl transition-all duration-200"
          >
            Launch TransitOps Console <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
