import React, { useState } from 'react';
import type { Mentee } from '../types';
import { AcademicMarksTab } from './AcademicMarksTab';
import { CounselingLogsTab } from './CounselingLogsTab';
import { EscalationsTab } from './EscalationsTab';
import {
  Phone,
  Mail,
  User,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface MenteeDetailViewProps {
  mentee: Mentee;
  onOpenNewSession: () => void;
  onOpenNewEscalation: () => void;
}

export const MenteeDetailView: React.FC<MenteeDetailViewProps> = ({
  mentee,
  onOpenNewSession,
  onOpenNewEscalation,
}) => {
  const [activeTab, setActiveTab] = useState<'academics' | 'counseling' | 'escalations'>('academics');

  const getRiskPill = () => {
    switch (mentee.riskLevel) {
      case 'Critical':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-950/50 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Critical Risk Category
          </span>
        );
      case 'Moderate':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Moderate Risk Watchlist
          </span>
        );
      case 'Normal':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Satisfactory Standing
          </span>
        );
    }
  };

  const getAttendanceColor = (att: number) => {
    if (att >= 75) return 'text-emerald-400';
    if (att >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Student Glass Hero Header */}
      <div className="glass-surface p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        {mentee.riskLevel === 'Critical' && (
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Avatar & Core Bio */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={mentee.avatar}
                alt={mentee.name}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-slate-700/80 shadow-md"
              />
              <div className="absolute -bottom-1.5 -right-1.5">
                {mentee.riskLevel === 'Critical' ? (
                  <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-slate-950 flex items-center justify-center text-white">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                ) : mentee.riskLevel === 'Moderate' ? (
                  <div className="w-6 h-6 rounded-full bg-amber-600 border-2 border-slate-950 flex items-center justify-center text-white">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-slate-950 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {mentee.name}
                </h2>
                {getRiskPill()}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
                <span className="text-indigo-400 font-semibold">{mentee.rollNo}</span>
                <span>•</span>
                <span className="font-sans text-slate-300">{mentee.department}</span>
                <span>•</span>
                <span className="font-sans">
                  Sem {mentee.semester} (Sec {mentee.section})
                </span>
                <span>•</span>
                <span className="font-sans">Batch {mentee.batch}</span>
              </div>

              {/* Contacts Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
                <div className="flex items-center gap-1 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{mentee.email}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{mentee.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Parent: <strong className="text-slate-300 font-medium">{mentee.parentName}</strong> ({mentee.parentPhone})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenNewSession}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Session</span>
            </button>

            <button
              onClick={onOpenNewEscalation}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/70 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Initiate Escalation</span>
            </button>
          </div>
        </div>

        {/* Quick Student Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-white">{mentee.cgpa.toFixed(2)}</span>
              <span className="text-xs text-slate-500">/ 10.0</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Attendance</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-xl font-bold ${getAttendanceColor(mentee.attendance)}`}>
                {mentee.attendance}%
              </span>
              <span className="text-[11px] text-slate-500">{mentee.attendance >= 75 ? '(Eligible)' : '(Shortage)'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Active Arrears</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-xl font-bold ${mentee.backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {mentee.backlogs}
              </span>
              <span className="text-xs text-slate-500">{mentee.backlogs > 0 ? 'Papers' : 'Clean'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Last Mentored</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-semibold text-slate-200">{mentee.lastCounselingDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl glass-surface border border-slate-800/80 max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab('academics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'academics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Internal Marks & Academics</span>
        </button>

        <button
          onClick={() => setActiveTab('counseling')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'counseling'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Counseling History ({mentee.counselingHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escalations')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'escalations'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Escalations & Interventions ({mentee.escalationHistory.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 pb-6">
        {activeTab === 'academics' && <AcademicMarksTab mentee={mentee} />}
        {activeTab === 'counseling' && (
          <CounselingLogsTab mentee={mentee} onOpenNewSession={onOpenNewSession} />
        )}
        {activeTab === 'escalations' && (
          <EscalationsTab mentee={mentee} onOpenNewEscalation={onOpenNewEscalation} />
        )}
      </div>
    </div>
  );
};
