import React, { useState, useMemo } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { UnderperformanceReport } from '../types';
import {
  Building,
  ShieldAlert,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  FileDown,
  TrendingDown,
  MessageSquare,
} from 'lucide-react';

interface HODModuleProps {
  onInspectStudent?: (studentId: string) => void;
}

export const HODModule: React.FC<HODModuleProps> = ({ onInspectStudent }) => {
  const {
    mentees,
    underperformanceReports,
    underperformingStudents,
    complaints,
    updateHODAction,
    updateComplaintStatus,
  } = useMentorship();

  const [activeTab, setActiveTab] = useState<'reports' | 'allUnderperforming' | 'complaints'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [hodActionNote] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Complaints forwarded or needing HOD attention
  const hodComplaints = useMemo(() => {
    return complaints.filter((c) => c.status === 'Forwarded to HOD' || c.priority === 'Urgent');
  }, [complaints]);

  // Filtered staff reports
  const filteredReports = useMemo(() => {
    return underperformanceReports.filter((rep) => {
      const matchesSeverity = filterSeverity === 'All' || rep.severity === filterSeverity;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rep.studentName.toLowerCase().includes(q) ||
        rep.rollNo.toLowerCase().includes(q) ||
        rep.reportedBy.toLowerCase().includes(q);
      return matchesSeverity && matchesSearch;
    });
  }, [underperformanceReports, filterSeverity, searchQuery]);

  // Critical debarment risk (<65% attendance)
  const debarmentCount = useMemo(() => {
    return mentees.filter((m) => m.attendance < 65).length;
  }, [mentees]);

  // Handle HOD Quick Actions
  const handleExecuteHODAction = (
    reportId: string,
    action: UnderperformanceReport['hodStatus']
  ) => {
    const note = hodActionNote.trim() || `HOD Dr. K. Ramachandran executed: ${action}`;
    updateHODAction(reportId, action, note);
  };

  const handleExportHODSummary = () => {
    const headers = ['Roll No', 'Name', 'Attendance %', 'CGPA', 'Backlogs', 'Reported By', 'Severity', 'HOD Action Status'];
    const rows = underperformanceReports.map((r) => [
      r.rollNo,
      `"${r.studentName}"`,
      `${r.metrics.attendance}%`,
      r.metrics.cgpa.toFixed(2),
      r.metrics.backlogs,
      `"${r.reportedBy}"`,
      r.severity,
      r.hodStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HOD_Department_Underperformance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('HOD Department Underperformance Summary exported to CSV successfully!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HOD COMMAND CENTER HEADER */}
      <div className="glass-surface p-6 rounded-2xl border border-purple-900/60 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold tracking-wider uppercase text-purple-400">
            <Building className="w-4 h-4 text-purple-400" />
            <span>Executive Academic Governance • Department of Cyber Security</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            HOD Surveillance & Underperformance Module
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 font-medium">
              Dr. K. Ramachandran (Head of Department)
            </span>
            <span>•</span>
            <span className="text-rose-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Direct Staff Escalation Feed Active
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleExportHODSummary}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-purple-800/60 hover:border-purple-600 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-purple-400" />
            <span>Export HOD Report</span>
          </button>
        </div>
      </div>

      {/* Export Notice */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 KEY EXECUTIVE KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Staff-Reported Escalations */}
        <div className="glass-card p-5 rounded-2xl border border-rose-900/50 bg-slate-900/50 relative overflow-hidden group">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Staff-Reported to HOD</span>
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/80">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {underperformanceReports.filter((r) => r.hodStatus !== 'Resolved').length}
            </span>
            <span className="text-xs font-semibold text-rose-400 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-700/60">
              Action Required
            </span>
          </div>
          <p className="text-xs text-rose-300/80 mt-2">
            Faculty mentor escalations pending HOD decision
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-600 shadow-sm shadow-rose-500/50" />
        </div>

        {/* KPI 2: Live Underperforming Students */}
        <div className="glass-card p-5 rounded-2xl border border-amber-900/40 bg-slate-900/50 relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Struggling Students</span>
            <div className="p-2 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-800/50">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {underperformingStudents.length}
            </span>
            <span className="text-xs text-slate-400">
              of {mentees.length} enrolled
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-2">
            Students with &lt;75% att., &lt;6.5 CGPA, or arrears
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
        </div>

        {/* KPI 3: University Debarment Risk (<65%) */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/90 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Debarment Threats (&lt;65%)</span>
            <div className="p-2 rounded-xl bg-purple-950/70 text-purple-400 border border-purple-800/50">
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">
              {debarmentCount}
            </span>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-700/60">
              Non-Condonable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Statutory parent summons mandatory
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
        </div>

        {/* KPI 4: Forwarded Student Grievances */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/90 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">HOD Grievance Queue</span>
            <div className="p-2 rounded-xl bg-cyan-950/70 text-cyan-400 border border-cyan-800/50">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-300 tracking-tight">
              {hodComplaints.length}
            </span>
            <span className="text-xs font-semibold text-cyan-400">
              Complaints
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Student complaints escalated to department head
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-surface border border-purple-900/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>1. Staff Escalations to HOD ({underperformanceReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('allUnderperforming')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'allUnderperforming'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>2. Live Underperformance Surveillance ({underperformingStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'complaints'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>3. Department Student Grievances ({complaints.length})</span>
        </button>
      </div>

      {/* TAB 1: STAFF ESCALATIONS TO HOD */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student, roll number, or reporting mentor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Severity:
              </span>
              {['All', 'Critical', 'Severe', 'Moderate'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    filterSeverity === sev
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Report Cards */}
          {filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="glass-card p-6 rounded-2xl border border-slate-800/90 hover:border-purple-800/60 transition-all space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 border border-slate-800 font-bold">
                        {report.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          report.severity === 'Critical'
                            ? 'bg-rose-950/90 text-rose-300 border-rose-700/60 animate-pulse'
                            : report.severity === 'Severe'
                            ? 'bg-amber-950/90 text-amber-300 border-amber-700/60'
                            : 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60'
                        }`}
                      >
                        {report.severity} Underperformance Flag
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Current HOD Status:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-700 shadow-sm">
                        {report.hodStatus}
                      </span>
                    </div>
                  </div>

                  {/* Student & Mentor Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Student Info & Metrics */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{report.studentName}</h4>
                          <p className="text-xs font-mono text-indigo-400">{report.rollNo}</p>
                        </div>
                        {onInspectStudent && (
                          <button
                            onClick={() => onInspectStudent(report.studentId)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                          >
                            Inspect Dossier
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center font-mono text-xs">
                        <div className={`p-1.5 rounded-lg border ${
                          report.metrics.attendance < 65
                            ? 'bg-rose-950/70 text-rose-300 border-rose-800/60'
                            : 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                        }`}>
                          <span className="text-[10px] text-slate-400 block font-sans">Att.</span>
                          <strong>{report.metrics.attendance}%</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                          <span className="text-[10px] text-slate-400 block font-sans">CGPA</span>
                          <strong>{report.metrics.cgpa.toFixed(2)}</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-300">
                          <span className="text-[10px] text-slate-400 block font-sans">Arrears</span>
                          <strong>{report.metrics.backlogs}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Reasons & Staff Observations */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          Reported by: <strong className="text-slate-200">{report.reportedBy}</strong> ({report.staffRole})
                        </span>
                      </div>

                      {/* Reasons Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {report.reasons.map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50 text-[11px] font-medium"
                          >
                            {r}
                          </span>
                        ))}
                      </div>

                      {/* Staff Remarks */}
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 mt-2">
                        <strong className="text-slate-200 block mb-1">Mentor Observation:</strong>
                        {report.staffRemarks}
                      </p>

                      <div className="text-xs text-slate-400 pt-1">
                        Recommended Action: <strong className="text-purple-300">{report.recommendedAction}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Previous HOD Action Log (if any) */}
                  {report.hodActionNotes && (
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/50 text-xs text-purple-200 flex items-start gap-2.5">
                      <Building className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-300 block">
                          Recorded HOD Action ({report.actionTakenDate || 'Recent'}):
                        </span>
                        <span>{report.hodActionNotes}</span>
                      </div>
                    </div>
                  )}

                  {/* Executive Action Trigger Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
                    <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      Take Executive HOD Action:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleExecuteHODAction(report.id, 'Notice Issued')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 transition-all cursor-pointer"
                      >
                        Issue Warning Notice
                      </button>

                      <button
                        onClick={() => handleExecuteHODAction(report.id, 'Parent Hearing Summoned')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/60 transition-all cursor-pointer"
                      >
                        Summon Parent Hearing
                      </button>

                      <button
                        onClick={() => handleExecuteHODAction(report.id, 'Remedial Action Assigned')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/60 transition-all cursor-pointer"
                      >
                        Assign Remedial Classes
                      </button>

                      <button
                        onClick={() => handleExecuteHODAction(report.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 transition-all cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl glass-card text-center text-slate-400 border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">No Pending Staff Escalations</p>
              <p className="text-xs text-slate-500 mt-1">
                All reported underperforming students have been processed or resolved.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE UNDERPERFORMANCE SURVEILLANCE */}
      {activeTab === 'allUnderperforming' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Algorithmic Underperformance Surveillance Roster
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically monitors any student falling below statutory thresholds (Attendance &lt; 75%, CGPA &lt; 6.5, or Backlogs &gt; 0).
              </p>
            </div>
          </div>

          <div className="glass-surface rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Arrears</th>
                  <th className="py-3 px-4">Risk Category</th>
                  <th className="py-3 px-4">Staff Escalation Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {underperformingStudents.map((student) => {
                  const staffReport = underperformanceReports.find((r) => r.studentId === student.id);
                  return (
                    <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-100">{student.name}</div>
                            <div className="text-[11px] font-mono text-indigo-400">
                              {student.rollNo} • Sem {student.semester} ({student.section})
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold ${
                          student.attendance < 65
                            ? 'text-rose-400'
                            : student.attendance < 75
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {student.attendance}%
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {student.attendance < 65 ? 'Critical Shortage' : 'Shortage'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {student.cgpa.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold ${
                          student.backlogs > 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {student.backlogs} {student.backlogs === 1 ? 'arrear' : 'arrears'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          student.riskLevel === 'Critical'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                            : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                        }`}>
                          {student.riskLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {staffReport ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[11px] font-semibold">
                            <Building className="w-3 h-3 text-purple-400" />
                            {staffReport.hodStatus}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            Auto-flagged (No staff report yet)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {onInspectStudent && (
                          <button
                            onClick={() => onInspectStudent(student.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-600 hover:text-white rounded-lg border border-indigo-800/60 transition-all cursor-pointer"
                          >
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENT COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Student Complaints & Grievance Review Queue
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Official grievances submitted by students across Academic, Facilities, and Departmental matters.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-purple-800/60 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {c.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                      {c.category}
                    </span>
                    <span className="font-bold text-amber-400">Priority: {c.priority}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{c.date} • {c.timestamp}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {c.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-white">{c.subject}</h5>
                  <p className="text-xs text-slate-300 mt-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                    {c.description}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Filed by: <strong className="text-slate-200">{c.studentName}</strong> ({c.rollNo})
                  </p>
                </div>

                {/* HOD Action on Complaint */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60">
                  <span className="text-xs text-purple-300 font-semibold">
                    HOD Grievance Redressal Action:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateComplaintStatus(
                          c.id,
                          'In Progress',
                          'HOD forwarded to designated department committee for immediate inspection.'
                        )
                      }
                      className="px-2.5 py-1 text-xs font-semibold bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-700/60"
                    >
                      Assign Inspection
                    </button>
                    <button
                      onClick={() =>
                        updateComplaintStatus(
                          c.id,
                          'Resolved',
                          'Action verified and resolved by HOD Dr. K. Ramachandran.'
                        )
                      }
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded border border-emerald-700/60"
                    >
                      Resolve Grievance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HODModule;
