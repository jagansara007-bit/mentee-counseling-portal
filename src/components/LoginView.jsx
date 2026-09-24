import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  ShieldAlert,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';

const ROLE_PRESETS = {
  Mentor: {
    email: 'mentor.dr.sharma@college.edu',
    password: 'MentorSecure@2026',
    name: 'Dr. Ramesh Sundaram',
    roleTitle: 'Senior Faculty Mentor',
    department: 'Cyber Security',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Access student rosters, track attendance shortages, and report underperforming students directly to the HOD module.',
  },
  Student: {
    email: '22ai104.jagan@college.edu',
    password: 'StudentPass@2026',
    name: 'Aarav Sharma',
    roleTitle: 'Undergraduate Student (22CS104)',
    department: 'Cyber Security',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    description: 'View internal marks, raise grievances/complaints with tracking status, and monitor academic progress.',
  },
  'Admin/HOD': {
    email: 'hod.cys@college.edu',
    password: 'HODExecutive@2026',
    name: 'Dr. K. Ramachandran',
    roleTitle: 'Head of Department & Academic Dean',
    department: 'Cyber Security',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Department-wide underperformance surveillance, staff escalation feed, student grievances, and official warnings.',
  },
};

export const LoginView = ({ onLoginSuccess }) => {
  const [activeRole, setActiveRole] = useState('Mentor');
  const [email, setEmail] = useState(ROLE_PRESETS.Mentor.email);
  const [password, setPassword] = useState(ROLE_PRESETS.Mentor.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setEmail(ROLE_PRESETS[role].email);
    setPassword(ROLE_PRESETS[role].password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate authenticating with smooth micro-interaction
    setTimeout(() => {
      setIsLoading(false);
      const preset = ROLE_PRESETS[activeRole];
      if (onLoginSuccess) {
        onLoginSuccess({
          role: activeRole,
          email,
          name: preset ? preset.name : email.split('@')[0],
          roleTitle: preset ? preset.roleTitle : activeRole,
          department: preset ? preset.department : 'Engineering',
          avatar: preset ? preset.avatar : null,
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -top-32 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Container Card */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-indigo-950/40 overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: High Contrast Branding & Telemetry */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between relative bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border-b lg:border-b-0 lg:border-r border-slate-800/80">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Logo & Telemetry Status */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    Mentor<span className="text-indigo-400 font-extrabold">Sphere</span>
                  </h1>
                </div>
              </div>

              {/* Version Tag */}
              <span className="px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wider uppercase text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 rounded-full">
                v2.4 PRO
              </span>
            </div>

            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Telemetry Engine: Active • AY 2025-26</span>
            </div>

            {/* Hero Catchphrase */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Early Intervention.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
                  Guaranteed Growth.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering faculty mentors with automated arrear early-warning detection, counseling workflows, and institutional intervention tracking.
              </p>
            </div>

            {/* Feature Chips */}
            <div className="mt-8 space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Real-time At-Risk Telemetry & Shortage Warnings</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">1-Click Counseling Action Items & Study Plans</span>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Automated Parent Notice & Debarment Safeguards</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / System Stamp */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <LockKeyhole className="w-3.5 h-3.5 text-slate-400" />
              <span>AES-256 Multi-Factor Vault</span>
            </div>
            <span className="font-mono">Anna Univ. Regs</span>
          </div>
        </div>

        {/* RIGHT PANEL: Role Switcher & Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Unified Institutional Portal
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Welcome back</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select your designated campus role to load pre-configured credentials.
              </p>
            </div>

            {/* ROLE SWITCHER TABS */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Signing In As:
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                {/* Mentor Pill */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('Mentor')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRole === 'Mentor'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mentor</span>
                </button>

                {/* Student Pill */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('Student')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRole === 'Student'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Student</span>
                </button>

                {/* Admin/HOD Pill */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('Admin/HOD')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRole === 'Admin/HOD'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin/HOD</span>
                </button>
              </div>

              {/* Selected Role Scope Note */}
              <p className="text-[11px] text-slate-400 mt-2 px-1">
                {ROLE_PRESETS[activeRole].description}
              </p>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Institutional Email / Roll Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/70 border border-slate-800/90 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert(`Temporary reset link dispatched to ${email}`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-950/70 border border-slate-800/90 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-slate-950"
                  />
                  <span>Remember active workstation session</span>
                </label>
              </div>

              {/* SUBMIT BUTTON WITH GRADIENT & MICRO-INTERACTION */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-xl p-px font-semibold text-white shadow-xl shadow-indigo-600/25 transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-400 group-hover:opacity-90 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-[11px] bg-indigo-600/30 group-hover:bg-transparent backdrop-blur-sm text-sm font-semibold transition-all">
                  {isLoading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter {activeRole} Portal</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Quick Demo Hint */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-400">
                💡 <span className="text-slate-300 font-semibold">Demo Quick Sign-In:</span> Credentials are auto-filled for each role. Simply toggle tabs and click <strong className="text-indigo-300">Enter Portal</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
