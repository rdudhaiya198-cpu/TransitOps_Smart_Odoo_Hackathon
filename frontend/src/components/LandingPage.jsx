import React from 'react';
import { 
  Shield, 
  Truck, 
  Users, 
  FileText, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage({ 
  onLaunchConsole, 
  darkMode, 
  setDarkMode 
}) {
  const features = [
    {
      icon: Truck,
      title: 'Central Fleet Registry',
      description: 'Track and monitor active vs idle heavy carriers, load capacity, and logs in real-time.',
      color: 'text-earth-clay bg-earth-clay/10 border-earth-clay/20'
    },
    {
      icon: Users,
      title: 'Operator Performance Profiles',
      description: 'Audit safety ratings and license expirations to ensure full transport regulation compliance.',
      color: 'text-earth-sage bg-earth-sage/10 border-earth-sage/20'
    },
    {
      icon: FileText,
      title: 'Digital Permit Storage',
      description: 'Manage fitness, insurance, and PUC certificates safely with mock file uploads.',
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-earth-bg text-earth-text overflow-x-hidden relative">
      {/* Decorative ambient background glows using Earthen accents */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-earth-clay/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] bg-earth-sage/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* Grid Mesh Overlay for Earthen look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-70"></div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-earth-border bg-earth-bg/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-earth-clay text-white rounded-xl shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-extrabold tracking-wide text-lg text-earth-text">
              Transit<span className="text-earth-clay">Ops</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-earth-muted">
            <a href="#features" className="hover:text-earth-clay transition-colors">Features</a>
            <a href="#tech" className="hover:text-earth-clay transition-colors">Tech Stack</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button in Landing Navbar */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-earth-surface border border-earth-border text-earth-muted hover:text-earth-text transition-all duration-200 cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onLaunchConsole}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-earth-clay hover:bg-earth-clay-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all duration-200"
            >
              Launch Console <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-earth-surface border border-earth-border rounded-full text-[10px] sm:text-xs font-bold tracking-wide text-earth-clay mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Hackathon Edition 2026
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-earth-text">
          Optimize Your Fleet Operations with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-earth-clay via-amber-600 to-earth-sage">
            Intelligent Tracking
          </span>
        </h1>

        <p className="text-earth-muted mt-6 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          TransitOps is a unified management console built for fleet administrators, safety compliance teams, and logistical operators. Monitor capacities, safety scores, and licenses.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-earth-clay hover:bg-earth-clay-hover text-white font-bold rounded-2xl shadow-lg transition-all duration-200 text-sm cursor-pointer"
          >
            Get Started Free <ArrowRight className="w-4.5 h-4.5" />
          </button>
          <a
            href="https://github.com/rdudhaiya198-cpu/TransitOps_Smart_Odoo_Hackathon"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-earth-surface hover:bg-earth-border/50 border border-earth-border text-earth-text font-bold rounded-2xl transition-all duration-200 text-sm"
          >
            View Repository
          </a>
        </div>

        {/* Dashboard Mockup Showcase (Responsive) */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative rounded-3xl border border-earth-border bg-earth-surface/40 backdrop-blur-xl p-2.5 sm:p-3 shadow-xl earth-glow">
          <div className="bg-earth-bg border border-earth-border rounded-2xl overflow-hidden p-4 md:p-6 text-left">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-earth-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-earth-clay"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-earth-sage"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-505"></div>
                <span className="text-[9px] font-bold text-earth-muted ml-2 uppercase tracking-widest">TransitOps Console</span>
              </div>
              <div className="hidden sm:block w-48 h-2 bg-earth-surface rounded-full"></div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-earth-surface/50 p-4 border border-earth-border rounded-xl space-y-1.5">
                <span className="text-[9px] text-earth-muted font-bold uppercase">Utilization Rate</span>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-earth-text">84%</span>
                  <TrendingUp className="w-3.5 h-3.5 text-earth-sage mb-0.5" />
                </div>
                <div className="w-full h-1 bg-earth-border rounded-full overflow-hidden">
                  <div className="h-full bg-earth-clay rounded-full w-[84%]"></div>
                </div>
              </div>
              <div className="bg-earth-surface/50 p-4 border border-earth-border rounded-xl space-y-1.5">
                <span className="text-[9px] text-earth-muted font-bold uppercase">Active Carriers</span>
                <span className="text-xl font-bold block text-earth-text">14 / 18</span>
                <div className="w-full h-1 bg-earth-border rounded-full overflow-hidden">
                  <div className="h-full bg-earth-sage rounded-full w-[78%]"></div>
                </div>
              </div>
              <div className="bg-earth-surface/50 p-4 border border-earth-border rounded-xl space-y-1.5">
                <span className="text-[9px] text-earth-muted font-bold uppercase">Safety Compliance</span>
                <span className="text-xl font-bold block text-earth-sage">92%</span>
                <div className="w-full h-1 bg-earth-border rounded-full overflow-hidden">
                  <div className="h-full bg-earth-sage rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 border-t border-earth-border bg-earth-surface/30 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-text">Full Operational Control</h2>
            <p className="text-earth-muted mt-2 text-sm font-semibold">Every feature designed to streamline transport logistics workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-earth-bg border border-earth-border hover:border-earth-clay/55 p-6 sm:p-8 rounded-3xl transition-all duration-200 group hover:shadow-md"
                >
                  <div className={`p-3 w-fit rounded-2xl border ${feature.color} mb-6 transition-transform group-hover:scale-105 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-earth-text group-hover:text-earth-clay transition-colors">{feature.title}</h3>
                  <p className="text-earth-muted text-xs sm:text-sm mt-3 leading-relaxed font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section id="tech" className="relative z-10 border-t border-earth-border py-16 bg-earth-surface/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[9px] font-bold text-earth-muted tracking-widest uppercase">Under the Hood</span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-earth-text mt-2 mb-8 sm:mb-10">Built with Hackathon Stack</h3>
          
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {['FastAPI', 'Supabase', 'React 19', 'Vite 8', 'Tailwind CSS v4'].map((tech, idx) => (
              <div 
                key={idx} 
                className="px-4 py-2 bg-earth-surface border border-earth-border rounded-2xl text-[11px] font-bold text-earth-muted hover:text-earth-text transition-colors cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 border-t border-earth-border py-20 bg-earth-surface/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-earth-text">Ready to Deploy Your Operations?</h2>
          <p className="text-earth-muted max-w-md mx-auto text-xs sm:text-sm leading-relaxed font-semibold">
            Configure your local Supabase database keys or click the demo toggle to preview now.
          </p>
          <button
            onClick={onLaunchConsole}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-earth-clay hover:bg-earth-clay-hover text-white font-bold rounded-2xl shadow-lg transition-all duration-200 text-sm cursor-pointer"
          >
            Launch TransitOps Console <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
