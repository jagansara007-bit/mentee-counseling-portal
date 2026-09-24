import React from 'react';
import type { Mentee, RiskLevel } from '../types';
import { Calendar, AlertCircle, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

interface MenteeCardProps {
  mentee: Mentee;
  isSelected: boolean;
  onSelect: () => void;
}

export const MenteeCard: React.FC<MenteeCardProps> = ({ mentee, isSelected, onSelect }) => {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-900/30">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Critical
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Moderate
          </span>
        );
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Normal
          </span>
        );
    }
  };

  const getAttendanceColor = (att: number) => {
    if (att >= 75) return 'text-emerald-400';
    if (att >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getAttendanceBarColor = (att: number) => {
    if (att >= 75) return 'bg-emerald-500';
    if (att >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getAvatarBorder = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'border-rose-500 ring-2 ring-rose-500/20';
      case 'Moderate': return 'border-amber-500 ring-2 ring-amber-500/20';
      case 'Normal': return 'border-emerald-500 ring-2 ring-emerald-500/20';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group ${
        isSelected
          ? 'bg-slate-900/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
          : 'hover:border-slate-700'
      }`}
    >
      {/* Active Selection Glow Accent */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={mentee.avatar}
            alt={mentee.name}
            className={`w-12 h-12 rounded-xl object-cover border ${getAvatarBorder(mentee.riskLevel)}`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {mentee.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>{mentee.rollNo}</span>
              <span>•</span>
              <span className="font-sans">Sem {mentee.semester} ({mentee.section})</span>
            </div>
          </div>
        </div>

        <div>{getRiskBadge(mentee.riskLevel)}</div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">CGPA</span>
          <span className="text-sm font-bold text-slate-100">{mentee.cgpa.toFixed(2)}</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Attendance</span>
          <span className={`text-sm font-bold ${getAttendanceColor(mentee.attendance)}`}>
            {mentee.attendance}%
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Backlogs</span>
          <span
            className={`text-sm font-bold ${
              mentee.backlogs > 0 ? 'text-rose-400 font-extrabold' : 'text-slate-300'
            }`}
          >
            {mentee.backlogs > 0 ? `${mentee.backlogs} Active` : '0 Nil'}
          </span>
        </div>
      </div>

      {/* Attendance Progress Track */}
      <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getAttendanceBarColor(mentee.attendance)}`}
          style={{ width: `${Math.min(mentee.attendance, 100)}%` }}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last session: {mentee.lastCounselingDate}</span>
        </div>
        <div className="flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
