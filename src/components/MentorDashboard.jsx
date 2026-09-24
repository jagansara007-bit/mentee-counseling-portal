import React, { useState, useMemo } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import { ReportToHODModal } from './ReportToHODModal';
import {
  Users,
  AlertTriangle,
  FileDown,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingDown,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  GraduationCap,
  DownloadCloud,
  Building,
  Plus,
} from 'lucide-react';

export const MentorDashboard = ({
  onInspectDossier,
  onNavigateToHOD,
}) => {
  const {
    mentees,
    stats,
    underperformanceReports,
    underperformingStudents,
    setSelectedMenteeId,
  } = useMentorship();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [exportNotice, setExportNotice] = useState(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);

  // Dynamic Surveillance Table filtering
  const filteredMentees = useMemo(() => {
    return mentees.filter((m) => {
      const matchesRisk = selectedRisk === 'All' || m.riskLevel === selectedRisk;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.rollNo.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      return matchesRisk && matchesSearch;
    });
  }, [mentees, selectedRisk, searchQuery]);

  // Specific KPI Calculations
  const attendanceRiskCount = useMemo(() => {
    return mentees.filter((m) => m.attendance < 75).length;
  }, [mentees]);

  const handleExportDossiers = () => {
    const headers = ['Roll No', 'Name', 'Semester', 'CGPA', 'Attendance %', 'Risk Level', 'Backlogs', 'HOD Status'];
    const rows = mentees.map((m) => {
      const rep = underperformanceReports.find((r) => r.studentId === m.id);
      return [
        m.rollNo,
        `"${m.name}"`,
        m.semester,
        m.cgpa.toFixed(2),
        `${m.attendance}%`,
        m.riskLevel,
        m.backlogs,
        rep ? rep.hodStatus : 'Normal',
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Roster_AY2025-26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Exported all student academic rosters to CSV successfully!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleSelectStudent = (id) => {
    setSelectedMenteeId(id);
    if (onInspectDossier) {
      onInspectDossier(id);
    }
  };

  const getAttendanceBarColor = (att) => {
    if (att >= 75) return 'bg-emerald-500';
    if (att >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getAttendanceTextColor = (att) => {
    if (att >= 75) return 'text-emerald-400';
    if (att >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950/40">
            <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
            Critical
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/50">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Moderate
          </span>
        );
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Normal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* COMMAND CENTER HEADER */}
      <div className="glass-surface p-6 rounded-2xl border border-slate-800/90 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold tracking-wider uppercase text-indigo-400">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Department of Cyber Security</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Mentor & Faculty Command Center
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-400">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 font-medium">
              AY 2025-26 • Even Semester (VI)
            </span>
            <span>•</span>
            <span>Assigned Roster: Class CSE-A & CSE-B</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Academic Surveillance Live
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleExportDossiers}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-indigo-400" />
            <span>Export Roster</span>
          </button>

          {onNavigateToHOD && (
            <button
              onClick={onNavigateToHOD}
              className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-purple-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/70 rounded-xl shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
            >
              <Building className="w-4 h-4 text-purple-300" />
              <span>Open HOD Module ({underperformanceReports.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Export Notification Banner */}
      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI METRIC CARDS (GRID OF 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Assigned Students */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/90 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Assigned Students</span>
            <div className="p-2 rounded-xl bg-indigo-950/70 text-indigo-400 border border-indigo-800/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{mentees.length}</span>
            <span className="text-xs font-semibold text-indigo-400">Students</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            B.E CSE Cohort 2022–26 (VI Sem)
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Card 2: Attendance Risk (<75%) */}
        <div className="glass-card p-5 rounded-2xl border-rose-900/50 bg-slate-900/50 relative overflow-hidden group">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Attendance Shortage (&lt;75%)</span>
            <div className="relative">
              <span className="animate-ping absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-rose-400 opacity-75" />
              <div className="p-2 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-md shadow-rose-900/50">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{attendanceRiskCount}</span>
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-700/60">
              Debarment Threat
            </span>
          </div>
          <p className="text-xs text-rose-300/80 mt-2">
            Statutory condonation required
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-600 shadow-sm shadow-rose-500/50" />
        </div>

        {/* Card 3: Reported to HOD Module */}
        <div className="glass-card p-5 rounded-2xl border border-purple-900/50 bg-slate-900/50 relative overflow-hidden group">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reported to HOD</span>
            <div className="p-2 rounded-xl bg-purple-950/70 text-purple-400 border border-purple-800/50">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300 tracking-tight">
              {underperformanceReports.length}
            </span>
            <span className="text-xs font-semibold text-purple-400 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/60">
              In HOD Module
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-2">
            {underperformanceReports.filter((r) => r.hodStatus !== 'Resolved').length} active investigations
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
        </div>

        {/* Card 4: Struggling Students Total */}
        <div className="glass-card p-5 rounded-2xl border-amber-900/40 bg-slate-900/50 relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Underperforming Watch</span>
            <div className="p-2 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-800/50">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {underperformingStudents.length}
            </span>
            <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60">
              Needs HOD Flag
            </span>
          </div>
          <p className="text-xs text-amber-300/80 mt-2">
            Low marks, attendance, or arrears
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
        </div>
      </div>

      {/* SURVEILLANCE TABLE */}
      <div className="glass-surface rounded-2xl border border-slate-800/90 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Student Academic Surveillance & Escalation Roster
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous academic telemetry. Faculty can report any underperforming student directly to the HOD module.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Risk:
              </span>

              {['All', 'Critical', 'Moderate', 'Normal'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedRisk === risk
                      ? risk === 'Critical'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : risk === 'Moderate'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : risk === 'Normal'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Student Info</th>
                <th className="py-3.5 px-5">Attendance</th>
                <th className="py-3.5 px-5">CGPA</th>
                <th className="py-3.5 px-5">Risk Category</th>
                <th className="py-3.5 px-5">HOD Module Status</th>
                <th className="py-3.5 px-5 text-right">Faculty Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredMentees.length > 0 ? (
                filteredMentees.map((mentee) => {
                  const hodReport = underperformanceReports.find((r) => r.studentId === mentee.id);
                  const isStruggling =
                    mentee.attendance < 75 || mentee.cgpa < 6.5 || mentee.backlogs > 0 || mentee.riskLevel === 'Critical';

                  return (
                    <tr
                      key={mentee.id}
                      className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                      onClick={() => handleSelectStudent(mentee.id)}
                    >
                      {/* Student Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={mentee.avatar}
                            alt={mentee.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                          />
                          <div>
                            <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                              <span>{mentee.name}</span>
                              {mentee.backlogs > 0 && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/50">
                                  {mentee.backlogs} {mentee.backlogs === 1 ? 'arrear' : 'arrears'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
                              <span className="text-indigo-400">{mentee.rollNo}</span>
                              <span>•</span>
                              <span className="font-sans">Sem {mentee.semester} ({mentee.section})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-4 px-5">
                        <div className="w-36">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={`font-bold font-mono ${getAttendanceTextColor(mentee.attendance)}`}>
                              {mentee.attendance}%
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {mentee.attendance >= 75 ? 'Safe' : 'Shortage'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${getAttendanceBarColor(
                                mentee.attendance
                              )}`}
                              style={{ width: `${Math.min(mentee.attendance, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* CGPA */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-200">
                          {mentee.cgpa.toFixed(2)}
                          <span className="text-xs font-normal text-slate-500 ml-1">/ 10</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {mentee.cgpa >= 8.5 ? 'Distinction' : mentee.cgpa >= 6.5 ? 'First Class' : 'Remedial Watch'}
                        </div>
                      </td>

                      {/* Risk Category */}
                      <td className="py-4 px-5">
                        {getRiskBadge(mentee.riskLevel)}
                      </td>

                      {/* HOD Module Status */}
                      <td className="py-4 px-5">
                        {hodReport ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/60 shadow-sm">
                              <Building className="w-3 h-3 text-purple-400" />
                              {hodReport.hodStatus}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Flagged on {hodReport.date}
                            </div>
                          </div>
                        ) : isStruggling ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            <AlertTriangle className="w-3 h-3" />
                            Struggling (Unreported)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Normal Standing
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isStruggling && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudentForReport(mentee);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-950/70 hover:bg-rose-900 border border-rose-800/70 rounded-lg shadow-sm transition-all cursor-pointer"
                              title="Report underperformance directly to HOD"
                            >
                              <Building className="w-3 h-3" />
                              <span>{hodReport ? 'Update Flag' : 'Report to HOD'}</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectStudent(mentee.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-600 hover:text-white border border-indigo-800/60 hover:border-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer group/btn"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No students match current filter criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting risk category or search query</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Showing <strong className="text-slate-200">{filteredMentees.length}</strong> of{' '}
            <strong className="text-slate-200">{mentees.length}</strong> assigned students
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {stats.critical} Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {stats.moderate} Moderate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {stats.normal} Normal
            </span>
          </div>
        </div>
      </div>

      {/* REPORT TO HOD MODAL */}
      {selectedStudentForReport && (
        <ReportToHODModal
          isOpen={!!selectedStudentForReport}
          onClose={() => setSelectedStudentForReport(null)}
          student={selectedStudentForReport}
        />
      )}
    </div>
  );
};

export default MentorDashboard;
