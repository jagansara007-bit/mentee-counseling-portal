import React, { useState } from 'react';
import { MentorshipProvider, useMentorship } from './context/MentorshipContext';
import { BrandLogo } from './components/BrandLogo';
import { StudentPortalView } from './components/StudentPortalView';
import { FacultyRosterView } from './components/FacultyRosterView';
import { HODCommandHubView } from './components/HODCommandHubView';
import { RaiseComplaintModal } from './components/RaiseComplaintModal';
import { LoginView } from './components/LoginView.jsx';

// Main Navigation Layout Shell conforming to Stitch Design System
const AppShell = () => {
  const { mentees, complaints } = useMentorship();

  // Active user state (default initialized with Senior Faculty/HOD Dr. K. Ramachandran for immediate dashboard preview)
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. K. Ramachandran',
    role: 'Admin/HOD',
    roleTitle: 'Faculty Mentor / HOD',
    department: 'CSE & AI',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2BjT1uHsqhEsHiuYsOxe_oyn4U8bJU7yWRvIjQA84JUXZPXkUPg9PFdXxXWGc3MYk8aAd3wT9aImOAQhpepYXsj7B8kcNwAgoMWQceQX2c-ofLsxzzoSQI2iDJrw-I06bNNPYdif69C5Ue683MAM63ThgprbARlCt2O7x1OcPb5y51Wik8mnGvQdrl2zpi2ZFuol1sgef8nUNUFukN1v49BZQT8NU5PDV3V5fdYYgP3Lx4jzNZ8_x9g',
  });

  // Current view: 'student-portal' | 'faculty-roster' | 'hod-command-hub'
  const [activeView, setActiveView] = useState('faculty-roster');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isRaiseComplaintOpen, setIsRaiseComplaintOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Severe attendance debarment count (<65%)
  const debarredStudentsCount = mentees.filter((m) => m.attendance < 65).length;
  const pendingGrievanceCount = complaints.filter((c) => c.status !== 'Resolved').length;

  const handleInspectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setActiveView('student-portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'Student') {
      setActiveView('student-portal');
    } else if (user.role === 'Admin/HOD') {
      setActiveView('hod-command-hub');
    } else {
      setActiveView('faculty-roster');
    }
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary/25 selection:text-primary">
      {/* ================= STITCH FIXED HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand and System Alert */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setSelectedStudentId(null);
                setActiveView('faculty-roster');
              }}
            >
              <BrandLogo className="h-8 w-auto object-contain" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                    MentorSphere
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-label-sm text-label-sm border border-tertiary/20">
                    Spring 2026 • Sem VI
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
                  Engineering College Academic Portal | Dept of CSE &amp; AI
                </span>
              </div>
            </div>

            {/* Debarment Alert Banner */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-error-container/20 border border-error/30 text-error font-label-md text-label-md animate-pulse">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>
                Debarment Alert: {debarredStudentsCount} students below 65% attendance limit
              </span>
            </div>
          </div>

          {/* Central Module Navigation Bar */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20"
            aria-label="Module Navigation"
          >
            <button
              onClick={() => {
                setSelectedStudentId(null);
                setActiveView('student-portal');
              }}
              className={`px-3.5 py-1.5 rounded-md font-title-md text-sm transition-all cursor-pointer ${
                activeView === 'student-portal'
                  ? 'bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
              data-path="student-portal"
              type="button"
            >
              Student Portal
            </button>

            <button
              onClick={() => {
                setSelectedStudentId(null);
                setActiveView('faculty-roster');
              }}
              className={`px-3.5 py-1.5 rounded-md font-title-md text-sm transition-all cursor-pointer ${
                activeView === 'faculty-roster'
                  ? 'bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
              data-path="faculty-roster"
              type="button"
            >
              Faculty Roster
            </button>

            <button
              onClick={() => {
                setSelectedStudentId(null);
                setActiveView('hod-command-hub');
              }}
              className={`px-3.5 py-1.5 rounded-md font-title-md text-sm transition-all cursor-pointer ${
                activeView === 'hod-command-hub'
                  ? 'bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
              data-path="hod-command-hub"
              type="button"
            >
              HOD Command Hub
            </button>
          </nav>

          {/* Search, Action, and Profile Cockpit */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden md:flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-outline text-sm">
                search
              </span>
              <input
                className="w-56 xl:w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-8 pr-12 py-1.5 text-xs text-on-surface placeholder-outline focus:outline-none focus:border-primary/60 transition-all shadow-inner"
                placeholder="Search Roll No / Grievance ID..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-mono border border-outline-variant/30">
                ⌘K
              </span>
            </div>

            {/* + Raise Grievance Action Button */}
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_rgba(192,193,255,0.25)] cursor-pointer"
              onClick={() => setIsRaiseComplaintOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-base">add_alert</span>
              <span>+ Raise Grievance</span>
            </button>

            {/* Notification Bell */}
            <div className="relative flex items-center">
              <button
                className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                type="button"
                aria-label="View Notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <span className="absolute 0 top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error text-[10px] font-bold">
                {pendingGrievanceCount || 4}
              </span>
            </div>

            {/* Settings Toggle */}
            <button
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors hidden sm:inline-flex"
              type="button"
              aria-label="Portal Settings"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>

            {/* Profile Chip & Dropdown */}
            <div className="relative">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-outline-variant/30 cursor-pointer group"
              >
                <div className="hidden 2xl:flex flex-col text-right">
                  <span className="text-xs text-on-surface font-semibold group-hover:text-primary transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-secondary">
                    Role: {currentUser.roleTitle}
                  </span>
                </div>
                <img
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40 shadow-sm"
                  src={currentUser.avatar}
                />
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-low rounded-xl border border-outline-variant/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-surface-container-highest">
                    <p className="text-xs font-bold text-on-surface">{currentUser.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{currentUser.roleTitle}</p>
                    <p className="text-[10px] text-outline font-mono mt-0.5">
                      {currentUser.department}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveView('student-portal');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">school</span>
                      <span>Switch to Student View</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('faculty-roster');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">groups</span>
                      <span>Switch to Faculty Roster</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('hod-command-hub');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      <span>Switch to HOD Hub</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-surface-container-highest">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-error hover:bg-error-container/20 rounded flex items-center gap-2 font-semibold"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= STITCH FIXED SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-20 bottom-0 w-64 bg-surface-container-lowest/80 backdrop-blur-md border-r border-outline-variant/30 z-40 flex flex-col justify-between py-4 transition-transform duration-300 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 space-y-6">
          {/* Operational Modules Navigation */}
          <div>
            <span className="px-2 text-[11px] uppercase tracking-wider text-outline font-semibold">
              Operational Modules
            </span>
            <nav className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setActiveView('student-portal');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all text-left ${
                  activeView === 'student-portal'
                    ? 'bg-surface-container-high text-primary border-l-2 border-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-base">monitoring</span>
                <span>Academic Telemetry</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setActiveView('faculty-roster');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all text-left ${
                  activeView === 'faculty-roster'
                    ? 'bg-surface-container-high text-primary border-l-2 border-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-base">event_busy</span>
                <span>Attendance Debarment</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setActiveView('hod-command-hub');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all text-left ${
                  activeView === 'hod-command-hub'
                    ? 'bg-surface-container-high text-primary border-l-2 border-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-base">gavel</span>
                <span>Disciplinary Tribunal</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setActiveView('faculty-roster');
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium"
              >
                <span className="material-symbols-outlined text-base">psychology</span>
                <span>Mentorship Case Notes</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setActiveView('hod-command-hub');
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all text-left text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium"
              >
                <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                <span>Regulatory Compliance</span>
              </button>
            </nav>
          </div>

          {/* Institutional Queues */}
          <div>
            <span className="px-2 text-[11px] uppercase tracking-wider text-outline font-semibold">
              Institutional Queues
            </span>
            <div className="mt-2 space-y-1.5">
              <div
                onClick={() => setActiveView('hod-command-hub')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container/50 text-xs text-on-surface-variant hover:bg-surface-container-high cursor-pointer transition-colors"
              >
                <span>Pending Grievances</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-mono font-bold">
                  {pendingGrievanceCount || 18}
                </span>
              </div>

              <div
                onClick={() => setActiveView('faculty-roster')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container/50 text-xs text-on-surface-variant hover:bg-surface-container-high cursor-pointer transition-colors"
              >
                <span>Severe Probations</span>
                <span className="px-2 py-0.5 rounded bg-error-container/30 text-error font-mono font-bold">
                  {debarredStudentsCount || 6}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Telemetry Node Status Footnote */}
        <div className="px-4 pt-4 border-t border-outline-variant/30">
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-tertiary text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-tertiary animate-ping" />
              <span>Telemetry Node Active</span>
            </div>
            <span className="text-[11px] text-outline font-mono">
              Latency: 28ms • v4.8.2 • MERN
            </span>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="pl-0 lg:pl-64">
        <main className="w-full pt-20 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen bg-background">
          {activeView === 'student-portal' && (
            <StudentPortalView
              selectedStudentId={selectedStudentId}
              onBackToRoster={() => {
                setSelectedStudentId(null);
                setActiveView('faculty-roster');
              }}
              onOpenRaiseGrievance={() => setIsRaiseComplaintOpen(true)}
            />
          )}

          {activeView === 'faculty-roster' && (
            <FacultyRosterView
              onInspectStudent={handleInspectStudent}
              onOpenReportModal={() => {}}
            />
          )}

          {activeView === 'hod-command-hub' && (
            <HODCommandHubView onInspectStudent={handleInspectStudent} />
          )}
        </main>
      </div>

      {/* Global Raise Grievance Modal */}
      <RaiseComplaintModal
        isOpen={isRaiseComplaintOpen}
        onClose={() => setIsRaiseComplaintOpen(false)}
        currentStudent={mentees[0]}
      />
    </div>
  );
};

export default function App() {
  return (
    <MentorshipProvider>
      <AppShell />
    </MentorshipProvider>
  );
}
