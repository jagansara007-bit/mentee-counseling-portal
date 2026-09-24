import React from 'react';
import { ShieldAlert, Sparkles, GraduationCap, LogOut } from 'lucide-react';
import { useMentorship } from '../context/MentorshipContext';

export interface AuthUser {
  role: string;
  email: string;
  name: string;
  roleTitle: string;
  department: string;
  avatar?: string | null;
}

export const Navbar: React.FC<{
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenNewSession: () => void;
  onOpenNewEscalation: () => void;
}> = ({ currentUser, onLogout, onOpenNewSession, onOpenNewEscalation }) => {
  const { stats } = useMentorship();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-surface border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Mentor<span className="text-indigo-400 font-extrabold">Sphere</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 rounded-full">
                Early Intervention v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Student Academic Monitoring & Counseling System
            </p>
          </div>
        </div>

        {/* Center / Stats pill if active warnings */}
        {stats.critical > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{stats.critical} Mentees Require Immediate Academic Intervention</span>
          </div>
        )}

        {/* Actions & User Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewSession}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-md shadow-indigo-600/30 transition duration-150 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Log Session</span>
          </button>

          <button
            onClick={onOpenNewEscalation}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 active:bg-rose-900/80 rounded-lg shadow-sm transition duration-150 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Escalate</span>
          </button>

          {/* User Profile Pill & Logout Button */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-semibold text-sm">
                {getInitials(currentUser?.name || 'Dr. Ramesh S.')}
              </div>
            )}
            <div className="hidden md:block text-left text-xs leading-tight">
              <p className="font-semibold text-slate-200">{currentUser?.name || 'Dr. Ramesh S.'}</p>
              <p className="text-[11px] text-slate-400">{currentUser?.roleTitle || 'CSE Senior Mentor'}</p>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Switch User / Sign Out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
