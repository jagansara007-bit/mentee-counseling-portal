import React, { useState, useMemo } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import { RaiseComplaintModal } from './RaiseComplaintModal';
import { ReportToHODModal } from './ReportToHODModal';
import { ComplaintsTab } from './ComplaintsTab';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  TrendingUp,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  ShieldAlert,
  PhoneCall,
  Mail,
  Users,
  Award,
  PlusCircle,
  X,
  Target,
  FileText,
  Building,
  GraduationCap,
  MessageSquare,
  Plus,
  Send,
} from 'lucide-react';

export const StudentDossier = ({ menteeId, onBack, currentUser }) => {
  const { mentees, underperformanceReports, complaints, toggleActionItem } = useMentorship();
  const mentee = mentees.find((m) => m.id === menteeId) || mentees[0];

  const [activeTab, setActiveTab] = useState('academics'); // 'academics' | 'complaints' | 'interventions'
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isHODReportModalOpen, setIsHODReportModalOpen] = useState(false);

  if (!mentee) {
    return (
      <div className="p-12 text-center glass-surface rounded-2xl">
        <p className="text-slate-400">No student profile found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-xs text-indigo-400 bg-indigo-950/40 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Check if student has an existing report in the HOD module
  const existingHODReport = underperformanceReports.find((r) => r.studentId === mentee.id);
  const isUnderperforming =
    mentee.attendance < 75 || mentee.cgpa < 6.5 || mentee.backlogs > 0 || mentee.riskLevel === 'Critical';

  // Filter complaints for this student
  const studentComplaints = complaints.filter((c) => c.studentId === mentee.id);

  // Generate Initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRiskPill = (level) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-lg shadow-rose-950/40 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Critical Risk Category
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Moderate Risk Watchlist
          </span>
        );
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Normal Standing
          </span>
        );
      default:
        return null;
    }
  };

  const getScoreBadge = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 85) {
      return {
        label: 'Excellent',
        style: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
      };
    }
    if (percentage >= 70) {
      return {
        label: 'Good',
        style: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50',
      };
    }
    if (percentage >= 50) {
      return {
        label: 'Average',
        style: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
      };
    }
    return {
      label: 'Fail / Remedial',
      style: 'bg-rose-950/90 text-rose-300 border-rose-500/60 font-bold',
    };
  };

  return (
    <div className="space-y-6">
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-indigo-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Surveillance Roster</span>
        </button>

        <div className="flex items-center gap-2">
          {existingHODReport && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/60 text-xs font-semibold shadow-sm">
              <Building className="w-3.5 h-3.5 text-purple-400" />
              Reported to HOD ({existingHODReport.hodStatus})
            </span>
          )}
          {getRiskPill(mentee.riskLevel)}
        </div>
      </div>

      {/* STUDENT HERO PROFILE CARD */}
      <div className="glass-surface p-6 sm:p-7 rounded-2xl border border-slate-800/90 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={mentee.avatar}
                alt={mentee.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                {mentee.section}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {mentee.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-950/90 text-indigo-300 border border-indigo-700/60">
                  {mentee.rollNo}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {mentee.department} • <span className="text-indigo-400">Semester {mentee.semester}</span> (Batch {mentee.batch})
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mentee.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mentee.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Parent: <strong className="text-slate-200">{mentee.parentName}</strong> ({mentee.parentPhone})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Raise Complaint & Report to HOD */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Student or Staff can Raise Complaint */}
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Complaint</span>
            </button>

            {/* Staff / Mentor: Report Underperformance to HOD */}
            {isUnderperforming && (
              <button
                onClick={() => setIsHODReportModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/70 rounded-xl shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
              >
                <Building className="w-4 h-4 text-rose-400" />
                <span>
                  {existingHODReport ? 'Update HOD Report' : 'Report Underperformance to HOD'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* HOD Alert Banner (if reported) */}
        {existingHODReport && (
          <div className="mt-5 p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-purple-200">
              <Building className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>HOD Escalation Active:</strong> Reported on {existingHODReport.date} by {existingHODReport.reportedBy} ({existingHODReport.staffRole}). Status: <span className="font-bold text-white">{existingHODReport.hodStatus}</span>.
              </span>
            </div>
            <span className="text-[11px] text-purple-400 font-mono font-bold">
              {existingHODReport.id}
            </span>
          </div>
        )}

        {/* Quick Vital Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Attendance</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-xl font-bold font-mono ${
                mentee.attendance >= 75 ? 'text-emerald-400' : mentee.attendance >= 65 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {mentee.attendance}%
              </span>
              <span className="text-[10px] text-slate-500">{mentee.attendance >= 75 ? '(Normal)' : '(Debarment Risk)'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Cumulative GPA</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-white font-mono">{mentee.cgpa.toFixed(2)}</span>
              <span className="text-xs text-slate-500">/ 10</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Arrears</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-xl font-bold font-mono ${mentee.backlogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {mentee.backlogs}
              </span>
              <span className="text-xs text-slate-500">{mentee.backlogs > 0 ? 'Courses' : 'Clear'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Complaints / Grievances</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-indigo-300 font-mono">
                {studentComplaints.length}
              </span>
              <span className="text-xs text-slate-500">Registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABBED NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-surface border border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('academics')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'academics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Academic Progression & Marks</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'complaints'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>2. Complaints & Grievances ({studentComplaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('interventions')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'interventions'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>3. Interventions & Disciplinary History ({mentee.escalationHistory?.length || 0})</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="space-y-4">
        {/* TAB 1: ACADEMIC PROGRESSION */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            {mentee.academicHistory && mentee.academicHistory.length > 0 ? (
              mentee.academicHistory.map((sem) => (
                <div
                  key={sem.semester}
                  className="glass-surface p-6 rounded-2xl border border-slate-800/90 shadow-xl space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Semester {sem.semester} Performance Overview</span>
                        <span className="text-xs font-mono font-normal text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                          {sem.academicYear}
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <span className="text-slate-400 mr-1.5">Term SGPA:</span>
                        <strong className="text-white font-mono text-sm">{sem.sgpa.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Subject-wise Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {sem.subjects.map((sub) => {
                      const scoreBadge = getScoreBadge(sub.modelExam, sub.maxMarks);

                      return (
                        <div
                          key={sub.subjectCode}
                          className="glass-card p-4 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-100 text-sm">{sub.subjectName}</h4>
                              <p className="text-xs font-mono text-slate-400 mt-0.5">{sub.subjectCode}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scoreBadge.style}`}>
                              {sub.isBacklog ? 'ARREAR' : scoreBadge.label}
                            </span>
                          </div>

                          {/* Marks Table */}
                          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">IA-1</span>
                              <span className="font-bold font-mono text-slate-200">{sub.ia1}</span>
                              <span className="text-[10px] text-slate-500">/50</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">IA-2</span>
                              <span className="font-bold font-mono text-slate-200">{sub.ia2}</span>
                              <span className="text-[10px] text-slate-500">/50</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">Model Exam</span>
                              <span className="font-bold font-mono text-indigo-300">{sub.modelExam}</span>
                              <span className="text-[10px] text-slate-500">/{sub.maxMarks}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center glass-card rounded-2xl">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-300 font-semibold">No academic marks published yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPLAINTS & GRIEVANCES */}
        {activeTab === 'complaints' && (
          <ComplaintsTab
            studentId={mentee.id}
            onOpenRaiseModal={() => setIsComplaintModalOpen(true)}
            canRaise={true}
          />
        )}

        {/* TAB 3: INTERVENTIONS */}
        {activeTab === 'interventions' && (
          <div className="space-y-4">
            {mentee.escalationHistory && mentee.escalationHistory.length > 0 ? (
              mentee.escalationHistory.map((esc) => (
                <div
                  key={esc.id}
                  className="glass-card p-6 rounded-2xl border border-rose-900/40 hover:border-rose-800/60 transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700/60">
                        Severity: {esc.severity}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {esc.date} • {esc.timestamp}
                      </span>
                    </div>

                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                      {esc.resolutionTag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Trigger: {esc.triggerReason}
                    </h4>
                    <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                      {esc.notes}
                    </p>
                  </div>

                  {esc.contactRecords && esc.contactRecords.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <span className="text-xs font-bold text-slate-300 block">Stakeholder Contact Log:</span>
                      {esc.contactRecords.map((cr) => (
                        <div key={cr.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400">
                          <div className="flex justify-between text-slate-300 font-semibold mb-1">
                            <span>{cr.channel} with {cr.contactPerson}</span>
                            <span>{cr.date}</span>
                          </div>
                          <p>{cr.responseSummary}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 text-center glass-card rounded-2xl text-slate-400 border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-200">No Escalations Recorded</p>
                <p className="text-xs text-slate-500 mt-1">Student has no disciplinary flags or Dean notices.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      <RaiseComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        currentStudent={mentee}
      />

      <ReportToHODModal
        isOpen={isHODReportModalOpen}
        onClose={() => setIsHODReportModalOpen(false)}
        student={mentee}
        reporterName={currentUser?.name || 'Dr. Ramesh Sundaram'}
        reporterRole={currentUser?.roleTitle || 'Faculty Mentor'}
      />
    </div>
  );
};

export default StudentDossier;
