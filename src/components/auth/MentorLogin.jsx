import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  ShieldAlert,
  Building,
  ClipboardList,
} from 'lucide-react';

const MENTOR_PRESETS = [
  {
    staffId: 'FAC-CYS-409',
    email: 'mentor.dr.sharma@college.edu',
    password: 'MentorSecure@2026',
    name: 'Dr. Ramesh Sundaram',
    roleTitle: 'Senior Faculty Mentor',
    department: 'Cyber Security',
    menteeCount: 30,
    atRiskCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    staffId: 'FAC-CYS-212',
    email: 'ananya.iyer@college.edu',
    password: 'MentorSecure@2026',
    name: 'Prof. Ananya Iyer',
    roleTitle: 'Assistant Professor & Counselor',
    department: 'Cyber Security',
    menteeCount: 28,
    atRiskCount: 2,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const MentorLogin = ({ onBack, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('mentor.dr.sharma@college.edu');
  const [password, setPassword] = useState('MentorSecure@2026');
  const [department, setDepartment] = useState('Cyber Security');
  const [cohort, setCohort] = useState('Cohort A (Roll 22CS101 - 22CS130)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPreset = (preset) => {
    setIdentifier(preset.email);
    setPassword(preset.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide your Faculty Staff ID or Institutional Email and Password.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const matched = MENTOR_PRESETS.find(
        (p) => p.email.toLowerCase() === identifier.trim().toLowerCase() || p.staffId.toLowerCase() === identifier.trim().toLowerCase()
      ) || MENTOR_PRESETS[0];

      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'Mentor',
          email: matched.email,
          name: matched.name,
          roleTitle: matched.roleTitle,
          department: department || matched.department,
          avatar: matched.avatar,
          staffId: matched.staffId,
        });
      }
    }, 550);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-32 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Center Container Card */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-indigo-950/40 overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: Faculty Telemetry & Capabilities */}
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
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-indigo-400">
                  Faculty Advisor Portal
                </span>
                <h1 className="text-xl font-bold text-white tracking-tight">Faculty Mentor Console</h1>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span>Counseling Telemetry Engine Active</span>
            </div>

            {/* Hero text */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Early Intervention.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
                  Academic Growth.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Empower your assigned student batches with automated arrear early-warning detection, 1-click counseling documentation, and direct HOD escalation.
              </p>
            </div>

            {/* Faculty Feature Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span>Real-Time At-Risk Telemetry & Debarment Watch</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400">
                  <ClipboardList className="w-3.5 h-3.5" />
                </div>
                <span>1-Click Counseling Log & Action Plan Generator</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span>Direct High-Risk Escalation to HOD Command Hub</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Faculty RBAC Clearance</span>
            </span>
            <span className="font-mono">AICTE Regs</span>
          </div>
        </div>

        {/* RIGHT PANEL: Mentor Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Faculty Authentication
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Faculty Mentor Login</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your institutional faculty ID or college email to access mentee cohorts.
              </p>
            </div>

            {/* QUICK PRESETS CHIPS */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Quick Demo Faculty Accounts:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MENTOR_PRESETS.map((preset) => (
                  <button
                    key={preset.staffId}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      identifier === preset.email
                        ? 'bg-indigo-950/70 border-indigo-500/60 shadow-md shadow-indigo-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{preset.staffId}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {preset.menteeCount} Mentees
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium truncate mt-1">{preset.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.roleTitle}</p>
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
              {/* Faculty Email / Staff ID */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Faculty Email or Staff ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. mentor.dr.sharma@college.edu or FAC-CYS-409"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Faculty Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter faculty password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
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

              {/* Department & Mentorship Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="Cyber Security">Dept of Cyber Security</option>
                    <option value="Computer Science">Dept of Computer Science</option>
                    <option value="AI & Data Science">Dept of AI & DS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Mentee Cohort
                  </label>
                  <select
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="Cohort A (Roll 22CS101 - 22CS130)">Cohort A (22CS101-130)</option>
                    <option value="Cohort B (Roll 22CS131 - 22CS160)">Cohort B (22CS131-160)</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>Trust this faculty workstation</span>
                </label>
                <a
                  href="#it-cell"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Contact Campus IT Cell (ext: 4099) or HOD Secretariat for faculty password resets.');
                  }}
                  className="text-indigo-400 hover:underline hover:text-indigo-300"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/30 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Validating Faculty Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Mentor Console</span>
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
