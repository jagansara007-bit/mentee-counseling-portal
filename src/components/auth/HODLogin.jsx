import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ShieldAlert,
  KeyRound,
  Fingerprint,
  Award,
} from 'lucide-react';

const HOD_PRESETS = [
  {
    executiveId: 'HOD-CYS-EXEC-01',
    email: 'hod.cys@college.edu',
    password: 'HODExecutive@2026',
    pin: '884920',
    name: 'Dr. K. Ramachandran',
    roleTitle: 'Head of Department & Academic Dean',
    department: 'Cyber Security',
    clearanceLevel: 'Level 4 (Institutional Executive)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const HODLogin = ({ onBack, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('hod.cys@college.edu');
  const [password, setPassword] = useState('HODExecutive@2026');
  const [securityPin, setSecurityPin] = useState('884920');
  const [clearance, setClearance] = useState('Level 4: Head of Department & Dean');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPreset = (preset) => {
    setIdentifier(preset.email);
    setPassword(preset.password);
    setSecurityPin(preset.pin);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter Executive ID / Email and Master Passkey.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const matched = HOD_PRESETS[0];

      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'Admin/HOD',
          email: matched.email,
          name: matched.name,
          roleTitle: matched.roleTitle,
          department: matched.department,
          avatar: matched.avatar,
          executiveId: matched.executiveId,
          clearanceLevel: matched.clearanceLevel,
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-rose-500/30 selection:text-rose-200">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-32 right-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Center Container Card */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-rose-950/40 overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: Executive Command Telemetry */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between relative bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="relative z-10">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/50 transition-all cursor-pointer mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campus Gateway</span>
            </button>

            {/* Portal Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-rose-400">
                  Institutional Governance
                </span>
                <h1 className="text-xl font-bold text-white tracking-tight">HOD Command Hub</h1>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>Executive Telemetry & Surveillance Online</span>
            </div>

            {/* Hero text */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Institutional Oversight.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300">
                  Total Compliance.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Centralized department-wide early-warning surveillance, mentor escalation audit trail, and regulatory debarment dispatch.
              </p>
            </div>

            {/* HOD Feature Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span>Department Arrear Radar & Severe Debarment Queue</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span>Faculty Mentorship Roster Audits & SLA Metrics</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-red-950/80 text-red-400">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <span>Direct Disciplinary Warnings & Parent Summoning</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-rose-400" />
              <span>Multi-Factor Clearance Vault</span>
            </span>
            <span className="font-mono">Security Tier 1</span>
          </div>
        </div>

        {/* RIGHT PANEL: HOD Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Executive Access Clearance
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">HOD & Dean Command Login</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your executive credentials and master authentication passkey.
              </p>
            </div>

            {/* QUICK PRESETS CHIPS */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Executive Profile:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {HOD_PRESETS.map((preset) => (
                  <button
                    key={preset.executiveId}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      identifier === preset.email
                        ? 'bg-rose-950/70 border-rose-500/60 shadow-md shadow-rose-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{preset.executiveId}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                        {preset.clearanceLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium truncate mt-1">{preset.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.roleTitle} • {preset.department}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR BANNER */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Executive ID / Email */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Executive ID or Dean Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. hod.cys@college.edu or HOD-CYS-EXEC-01"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Master Passkey */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Master Access Passkey
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter executive master passkey"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Clearance Level & 2FA Audit PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Clearance Tier
                  </label>
                  <select
                    value={clearance}
                    onChange={(e) => setClearance(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-all"
                  >
                    <option value="Level 4: Head of Department & Dean">Level 4: Dept Head & Dean</option>
                    <option value="Level 3: Vice Principal / Academic Auditor">Level 3: Academic Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Audit Session PIN (2FA)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-all font-mono tracking-widest text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                  <span>Enforce high-security TLS session</span>
                </label>
                <a
                  href="#dean-sec"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact Campus Registrar or Principal Office for Dean passkey re-issuance.');
                  }}
                  className="text-rose-400 hover:underline hover:text-rose-300"
                >
                  Clearance Recovery
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/30 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing Executive Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Enter HOD Command Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
