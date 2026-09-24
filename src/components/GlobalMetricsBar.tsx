import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Flame, Percent, Bell } from 'lucide-react';
import { useMentorship } from '../context/MentorshipContext';

export const GlobalMetricsBar: React.FC = () => {
  const { stats, filterRisk, setFilterRisk } = useMentorship();

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {/* Total Mentees */}
      <div 
        onClick={() => setFilterRisk('All')}
        className={`glass-card p-4 rounded-xl cursor-pointer select-none transition-all ${
          filterRisk === 'All' ? 'ring-2 ring-indigo-500/80 bg-slate-900/70' : ''
        }`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider">Mentees</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{stats.total}</span>
          <span className="text-xs text-indigo-300 font-medium">Batch 22-26</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">All assigned students</p>
      </div>

      {/* Critical Alerts */}
      <div 
        onClick={() => setFilterRisk('Critical')}
        className={`glass-card p-4 rounded-xl cursor-pointer select-none transition-all border-rose-900/40 ${
          filterRisk === 'Critical' ? 'ring-2 ring-rose-500 bg-rose-950/30' : 'hover:border-rose-500/50'
        }`}
      >
        <div className="flex items-center justify-between text-rose-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Critical Risk</span>
          <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800/60 animate-pulse">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-400 tracking-tight">{stats.critical}</span>
          <span className="text-xs text-rose-400/80 font-medium">Urgent</span>
        </div>
        <p className="text-[11px] text-rose-300/70 mt-1">&lt;65% Att. / 3+ Arrears</p>
      </div>

      {/* Moderate Alerts */}
      <div 
        onClick={() => setFilterRisk('Moderate')}
        className={`glass-card p-4 rounded-xl cursor-pointer select-none transition-all border-amber-900/40 ${
          filterRisk === 'Moderate' ? 'ring-2 ring-amber-500 bg-amber-950/30' : 'hover:border-amber-500/50'
        }`}
      >
        <div className="flex items-center justify-between text-amber-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Moderate</span>
          <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-400 tracking-tight">{stats.moderate}</span>
          <span className="text-xs text-amber-400/80 font-medium">Watchlist</span>
        </div>
        <p className="text-[11px] text-amber-300/70 mt-1">70-75% Att. / 1 Arrear</p>
      </div>

      {/* Normal / Good Standing */}
      <div 
        onClick={() => setFilterRisk('Normal')}
        className={`glass-card p-4 rounded-xl cursor-pointer select-none transition-all border-emerald-900/40 ${
          filterRisk === 'Normal' ? 'ring-2 ring-emerald-500 bg-emerald-950/30' : 'hover:border-emerald-500/50'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-400 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider">Safe Standing</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.normal}</span>
          <span className="text-xs text-emerald-400/80 font-medium">On Track</span>
        </div>
        <p className="text-[11px] text-emerald-300/70 mt-1">&gt;75% Att. / 0 Arrears</p>
      </div>

      {/* Average Attendance */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider">Avg Attendance</span>
          <div className="p-1.5 rounded-lg bg-slate-800/80 text-cyan-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-300 tracking-tight">{stats.avgAttendance}%</span>
        </div>
        {/* Visual Mini Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ 
              width: `${Math.min(stats.avgAttendance, 100)}%`,
              backgroundColor: stats.avgAttendance >= 75 ? '#10b981' : stats.avgAttendance >= 65 ? '#f59e0b' : '#f43f5e'
            }} 
          />
        </div>
      </div>

      {/* Active Interventions */}
      <div className="glass-card p-4 rounded-xl border-indigo-900/30">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium uppercase tracking-wider">Interventions</span>
          <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
            <Bell className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-indigo-300 tracking-tight">{stats.activeEscalations}</span>
          <span className="text-xs text-indigo-400/80 font-medium">Active Logs</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Pending follow-ups</p>
      </div>
    </section>
  );
};
