import React from 'react';
import {
  GraduationCap,
  User,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronRight,
  BookOpen,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

export const AuthGateway = ({ onSelectRole, onQuickLogin }) => {
  const roleCards = [
    {
      id: 'Student',
      title: 'Student Portal',
      subtitle: 'Undergraduate Services',
      description: 'Access CAT exam marks, review attendance shortages, check hall ticket status, and lodge academic grievances.',
      badge: 'Student Self-Service',
      icon: User,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'hover:border-emerald-500/50',
      tagColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
      accentColor: 'text-emerald-400',
      demoUser: 'Aarav Sharma (22CS104)',
      highlights: [
        'CAT 1 & CAT 2 Internal Marks',
        'Attendance Shortage & Debarment Alert',
        'Anonymous / Direct Grievance Filing',
      ],
    },
    {
      id: 'Mentor',
      title: 'Faculty Mentor Console',
      subtitle: 'Mentorship & Intervention',
      description: 'Manage assigned student cohorts, track attendance debarment risks, record counseling logs, and report to HOD.',
      badge: 'Faculty Advisors',
      icon: UserCheck,
      gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
      borderColor: 'hover:border-indigo-500/50',
      tagColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40',
      accentColor: 'text-indigo-400',
      demoUser: 'Dr. Ramesh Sundaram (Senior Mentor)',
      highlights: [
        'Real-Time Arrear Early-Warning Radar',
        '1-Click Counseling Action Tracker',
        'Automated Parent Notice Triggers',
      ],
    },
    {
      id: 'Admin/HOD',
      title: 'HOD Command Hub',
      subtitle: 'Executive Surveillance & Dean',
      description: 'Department-wide arrear telemetry, faculty counseling compliance, staff escalations, and official warning issuances.',
      badge: 'High Security Clearance',
      icon: ShieldCheck,
      gradient: 'from-rose-500/20 via-amber-500/10 to-transparent',
      borderColor: 'hover:border-rose-500/50',
      tagColor: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      buttonBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40',
      accentColor: 'text-rose-400',
      demoUser: 'Dr. K. Ramachandran (HOD & Dean)',
      highlights: [
        'Institutional Debarment Surveillance (<65%)',
        'Staff Escalation & Complaint Resolutions',
        'Autonomous Regulatory Audit Reports',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Mentor<span className="text-indigo-400 font-extrabold">Sphere</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 rounded-full">
                v2.4 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">Department of Cyber Security • Institutional Mentorship System</p>
          </div>
        </div>

        {/* Live System Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Gateway Active • Spring 2026 Sem VI</span>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 max-w-7xl w-full mx-auto my-auto py-8 lg:py-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-indigo-400 font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unified Institutional Access Control</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Select Your Designated{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
              Campus Portal
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to the Anna University & AICTE compliant academic mentorship ecosystem. Each campus stakeholder is provided with a dedicated, secure login gateway.
          </p>
        </div>

        {/* 3 DEDICATED ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {roleCards.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`relative rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group ${role.borderColor} overflow-hidden`}
              >
                {/* Background radial gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${role.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                <div className="relative z-10">
                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border ${role.tagColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {role.title}
                    </h3>
                    <p className={`text-xs font-medium ${role.accentColor} mt-0.5`}>
                      {role.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Key Capabilities List */}
                  <div className="space-y-2 mb-8">
                    {role.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${role.accentColor}`} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Section */}
                <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectRole(role.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${role.buttonBg}`}
                  >
                    <span>Open {role.title}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickLogin(role.id)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Instant Demo:</span>
                    <span className="font-semibold text-slate-300 underline underline-offset-2 decoration-slate-600">
                      {role.demoUser.split(' ')[0]}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRUST & COMPLIANCE BADGES */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <p className="text-[11px] font-semibold text-slate-400">Institutional Governance</p>
            <p className="text-xs font-bold text-white mt-0.5">Anna University Regs 2021</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <p className="text-[11px] font-semibold text-slate-400">Early Intervention</p>
            <p className="text-xs font-bold text-white mt-0.5">AICTE Mentorship Norms</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <p className="text-[11px] font-semibold text-slate-400">Data Protection</p>
            <p className="text-xs font-bold text-white mt-0.5">AES-256 Multi-Vault</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <p className="text-[11px] font-semibold text-slate-400">Security Clearance</p>
            <p className="text-xs font-bold text-white mt-0.5">Role-Based Access (RBAC)</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Institutional Single Sign-On Gateway • Department of Cyber Security</span>
        </div>
        <p>© 2026 MentorSphere Academic Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};
