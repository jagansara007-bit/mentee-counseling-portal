import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const STUDENT_PRESETS = [
  {
    rollNo: '22CS104',
    email: '22ai104.jagan@college.edu',
    password: 'StudentPass@2026',
    name: 'Aarav Sharma',
    batch: '2022-2026 (Semester VI)',
    status: '1 Active Arrear (At-Risk)',
    attendance: '62%',
    note: 'Needs immediate counseling & arrear coaching',
  },
  {
    rollNo: '22CS108',
    email: '22cs108.priya@college.edu',
    password: 'StudentPass@2026',
    name: 'Priya Sundaram',
    batch: '2022-2026 (Semester VI)',
    status: 'All Clear (CGPA 8.92)',
    attendance: '91%',
    note: 'Dean Honor Roll & Research Fellowship',
  },
  {
    rollNo: '22CS115',
    email: '22cs115.karthik@college.edu',
    password: 'StudentPass@2026',
    name: 'K. Karthik',
    batch: '2022-2026 (Semester VI)',
    status: 'Severe Debarment Risk',
    attendance: '58%',
    note: 'Debarment warning issued to parents',
  },
];

export const StudentLogin = ({ onBack, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('22CS104');
  const [password, setPassword] = useState('StudentPass@2026');
  const [semester, setSemester] = useState('Sem VI (Spring 2026)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPreset = (preset) => {
    setIdentifier(preset.rollNo);
    setPassword(preset.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide your Register / Roll Number and Password.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const matched = STUDENT_PRESETS.find(
        (p) => p.rollNo.toLowerCase() === identifier.trim().toLowerCase() || p.email.toLowerCase() === identifier.trim().toLowerCase()
      ) || STUDENT_PRESETS[0];

      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'Student',
          email: matched.email,
          name: matched.name,
          roleTitle: `Undergraduate Student (${matched.rollNo})`,
          department: 'Cyber Security',
          rollNo: matched.rollNo,
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        });
      }
    }, 550);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Center Container Card */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-emerald-950/40 overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: Student Services & Features */}
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
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-emerald-400">
                  Student Services Portal
                </span>
                <h1 className="text-xl font-bold text-white tracking-tight">Student Self-Service</h1>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Online • Spring 2026 Examination Portal</span>
            </div>

            {/* Hero text */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Track Marks, Attendance &{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Academic Progress.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Log in to inspect continuous assessment test (CAT) marks, verify attendance shortage thresholds, and lodge official grievances.
              </p>
            </div>

            {/* Student Feature Highlights */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>CAT 1 & CAT 2 Internal Marks Dossier</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>Real-Time Attendance Shortage & Debarment Alert</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <div className="p-1.5 rounded-lg bg-teal-950/80 text-teal-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span>Confidential Student Grievance / Complaint Desk</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Student ID Authentication</span>
            </span>
            <span className="font-mono">Regs 2021</span>
          </div>
        </div>

        {/* RIGHT PANEL: Student Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Student Sign In
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Access Your Student Portal</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your university roll number or registered college email.
              </p>
            </div>

            {/* QUICK PRESETS CHIPS */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Quick Demo Student Accounts:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {STUDENT_PRESETS.map((preset) => (
                  <button
                    key={preset.rollNo}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      identifier === preset.rollNo
                        ? 'bg-emerald-950/70 border-emerald-500/60 shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{preset.rollNo}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        parseInt(preset.attendance) < 65 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {preset.attendance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium truncate mt-1">{preset.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{preset.status}</p>
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
              {/* Roll No / Register No */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Roll Number or College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 22CS104 or 22ai104.jagan@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Student Portal Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
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

              {/* Academic Semester Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Academic Term & Cohort
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="Sem VI (Spring 2026)">B.E. Cyber Security • Semester VI (Spring 2026)</option>
                  <option value="Sem IV (Spring 2026)">B.E. Cyber Security • Semester IV (Spring 2026)</option>
                  <option value="Sem VIII (Final Year)">B.E. Cyber Security • Semester VIII (Spring 2026)</option>
                </select>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Save session on this device</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Please approach your Faculty Mentor (Dr. Ramesh Sundaram) to reset your student portal credentials.');
                  }}
                  className="text-emerald-400 hover:underline hover:text-emerald-300"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authenticating Student Record...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Student Portal</span>
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
