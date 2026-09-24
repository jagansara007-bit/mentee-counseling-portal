import React, { useState } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { Mentee } from '../types';

interface FacultyRosterViewProps {
  onInspectStudent?: (studentId: string) => void;
  onOpenReportModal?: (student?: Mentee) => void;
}

export const FacultyRosterView: React.FC<FacultyRosterViewProps> = ({
  onInspectStudent,
}) => {
  const {
    mentees,
    underperformanceReports,
    underperformingStudents,
    reportUnderperformanceToHOD,
  } = useMentorship();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'at-risk' | 'safe'>('all');

  // Modal state for direct escalation
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Mentee | null>(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  // Form fields for escalation modal
  const [violations, setViolations] = useState<string[]>([
    'Severe Attendance Shortage (<65%)',
    'Multiple Active Backlogs',
    'Chronic Morning Absenteeism',
  ]);
  const [mentorObservation, setMentorObservation] = useState(
    'Student has been repeatedly absent during 1st hour lectures and failed to submit assignment on time. Academic review revealed difficulty catching up. Recommending immediate parent conference.'
  );
  const [recommendedAction, setRecommendedAction] = useState(
    'Summon Mandatory Parent-Mentor-HOD Hearing'
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter students
  const filteredStudents = mentees.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (riskFilter === 'critical')
      return student.attendance < 65 || student.riskLevel === 'Critical' || student.riskLevel === 'High';
    if (riskFilter === 'at-risk')
      return (
        (student.attendance >= 65 && student.attendance < 75) ||
        student.riskLevel === 'Moderate' ||
        student.riskLevel === 'Medium'
      );
    if (riskFilter === 'safe')
      return student.attendance >= 75 && (student.riskLevel === 'Normal' || student.riskLevel === 'Low');

    return true;
  });

  const criticalCount = mentees.filter(
    (m) => m.attendance < 65 || m.riskLevel === 'Critical' || m.riskLevel === 'High'
  ).length;
  const atRiskCount = mentees.filter(
    (m) =>
      (m.attendance >= 65 && m.attendance < 75) ||
      m.riskLevel === 'Moderate' ||
      m.riskLevel === 'Medium'
  ).length;
  const safeCount = mentees.filter(
    (m) => m.attendance >= 75 && (m.riskLevel === 'Normal' || m.riskLevel === 'Low')
  ).length;

  const handleOpenEscalation = (student: Mentee) => {
    setSelectedStudentForModal(student);
    setIsEscalateModalOpen(true);
  };

  const handleToggleViolation = (v: string) => {
    if (violations.includes(v)) {
      setViolations(violations.filter((item) => item !== v));
    } else {
      setViolations([...violations, v]);
    }
  };

  const handleSubmitEscalation = () => {
    if (!selectedStudentForModal) return;

    reportUnderperformanceToHOD({
      studentId: selectedStudentForModal.id,
      studentName: selectedStudentForModal.name,
      rollNo: selectedStudentForModal.rollNo,
      department: selectedStudentForModal.department || 'Cyber Security',
      reportedBy: 'Dr. K. Ramachandran',
      staffRole: 'Faculty Mentor',
      severity: selectedStudentForModal.attendance < 65 ? 'Critical' : 'Severe',
      metrics: {
        attendance: selectedStudentForModal.attendance,
        cgpa: selectedStudentForModal.cgpa,
        backlogs: selectedStudentForModal.arrearsCount ?? selectedStudentForModal.backlogs ?? 0,
      },
      reasons: violations.length > 0 ? violations : ['Low Attendance', 'Academic Underperformance'],
      staffRemarks: mentorObservation,
      recommendedAction,
      attendance: selectedStudentForModal.attendance,
      cgpa: selectedStudentForModal.cgpa,
      arrearsCount: selectedStudentForModal.arrearsCount ?? selectedStudentForModal.backlogs ?? 0,
      status: 'Pending HOD Review',
      mentorNotes: mentorObservation,
      facultyName: 'Dr. K. Ramachandran',
      createdAt: new Date().toISOString(),
    });

    setIsEscalateModalOpen(false);
    setToastMsg(
      `Dossier for ${selectedStudentForModal.name} (${selectedStudentForModal.rollNo}) forwarded to HOD Chamber.`
    );
    setTimeout(() => setToastMsg(null), 4500);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-surface-container-highest text-on-surface border border-primary/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-tertiary">task_alt</span>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Operational Overview Header & Metric Matrix */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-on-surface tracking-tight font-headline-lg">
                Faculty Surveillance &amp; Mentorship Cockpit
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-xs font-semibold border border-primary/20">
                Cohort: CSE-B (2022-2026)
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Live institutional academic telemetry, real-time risk classification, and statutory grievance routing.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright text-sm font-medium transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-outline">history</span>
              <span>Mentorship Archive</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-error-container/40 text-error hover:bg-error-container/60 text-sm font-semibold transition-all shadow-[0_0_12px_rgba(255,180,171,0.15)]"
              onClick={() => handleOpenEscalation(mentees[0])}
              type="button"
            >
              <span className="material-symbols-outlined text-base">gavel</span>
              <span>Summon Disciplinary Hearing</span>
            </button>
          </div>
        </div>

        {/* 4 High-Density Executive Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Assigned Mentees */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Total Assigned Mentees
              </span>
              <span className="material-symbols-outlined text-primary text-xl">group</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-on-surface tracking-tight font-display-lg">
                  {mentees.length}
                </span>
                <span className="text-sm text-on-surface-variant">Students</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-tertiary text-xs font-semibold">
                Sec B • Active
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-surface-container-highest flex items-center justify-between text-on-surface-variant text-xs font-medium">
              <span>Batch Cadence: 2022–2026</span>
              <span className="text-tertiary font-semibold">100% Synced</span>
            </div>
          </div>

          {/* Card 2: Severe Attendance Shortage */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-error/10 blur-xl" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-error animate-ping" />
                <span className="text-xs font-bold text-error uppercase tracking-wider">
                  Severe Shortage (&lt;75%)
                </span>
              </div>
              <span className="material-symbols-outlined text-error text-xl">report_problem</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-error tracking-tight font-display-lg">
                  {criticalCount}
                </span>
                <span className="text-sm text-error/80">Students</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container/20 text-error text-xs font-bold">
                Debarment Risk
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-surface-container-highest flex items-center justify-between text-error text-xs font-medium">
              <span>Immediate Tribunal Notice</span>
              <button
                onClick={() => setRiskFilter('critical')}
                className="font-semibold underline cursor-pointer hover:text-on-surface"
              >
                Review Flags
              </button>
            </div>
          </div>

          {/* Card 3: Academic Underperformance Watchlist */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-container/20 blur-xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Underperformance Watchlist
              </span>
              <span className="material-symbols-outlined text-secondary text-xl">troubleshoot</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-secondary tracking-tight font-display-lg">
                  {underperformingStudents.length}
                </span>
                <span className="text-sm text-on-surface-variant">Students</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary-container/30 text-secondary text-xs font-bold">
                Deficit Detected
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-surface-container-highest flex items-center justify-between text-on-surface-variant text-xs font-medium">
              <span>Active Arrears / Low IA</span>
              <span className="text-secondary font-semibold">Diagnostic Mode</span>
            </div>
          </div>

          {/* Card 4: Escalated to HOD */}
          <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/10 blur-xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Escalated to HOD
              </span>
              <span className="material-symbols-outlined text-primary text-xl">supervised_user_circle</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-primary tracking-tight font-display-lg">
                  {underperformanceReports.length}
                </span>
                <span className="text-sm text-on-surface-variant">Active Cases</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary text-xs font-semibold">
                Parent Hearing
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-surface-container-highest flex items-center justify-between text-on-surface-variant text-xs font-medium">
              <span>1 Hearing: This Thursday 10:30 AM</span>
              <span className="text-primary font-semibold">Chamber 402</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentee Surveillance & Performance Roster */}
      <div className="flex flex-col bg-surface-container-low rounded-xl shadow-md border border-outline-variant/20 overflow-hidden">
        {/* Toolbar & Filter Area */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low border-b border-outline-variant/20">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest text-on-surface rounded-lg pl-10 pr-4 py-2 text-sm placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 shadow-inner"
                placeholder="Search Roll No (e.g. 22CS1072) or Student Name..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Risk Filter Pills */}
            <div className="hidden xl:flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  riskFilter === 'all'
                    ? 'bg-surface-container-high text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60'
                }`}
                type="button"
              >
                All ({mentees.length})
              </button>
              <button
                onClick={() => setRiskFilter('critical')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  riskFilter === 'critical'
                    ? 'bg-error-container/40 text-error shadow-sm'
                    : 'text-error hover:bg-surface-container-high/60'
                }`}
                type="button"
              >
                Critical &lt;65% ({criticalCount})
              </button>
              <button
                onClick={() => setRiskFilter('at-risk')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  riskFilter === 'at-risk'
                    ? 'bg-secondary-container/40 text-secondary shadow-sm'
                    : 'text-secondary hover:bg-surface-container-high/60'
                }`}
                type="button"
              >
                At Risk 65-75% ({atRiskCount})
              </button>
              <button
                onClick={() => setRiskFilter('safe')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  riskFilter === 'safe'
                    ? 'bg-tertiary-container/30 text-tertiary shadow-sm'
                    : 'text-tertiary hover:bg-surface-container-high/60'
                }`}
                type="button"
              >
                Safe &gt;75% ({safeCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-outline text-xs bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
              <span>Autonomous Sync: Online</span>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright text-xs font-semibold transition-colors border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Dossier (CSV)</span>
            </button>
          </div>
        </div>

        {/* Data Matrix Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface-container text-xs uppercase text-outline tracking-wider font-semibold select-none border-b border-outline-variant/30">
              <tr>
                <th className="py-3 px-5">Student Profile</th>
                <th className="py-3 px-4">Attendance Meter</th>
                <th className="py-3 px-4">CGPA &amp; IA Vector</th>
                <th className="py-3 px-4">Risk Classification</th>
                <th className="py-3 px-4">HOD Escalation Status</th>
                <th className="py-3 px-5 text-right">Intervention Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/40">
              {filteredStudents.map((student) => {
                const isReported = underperformanceReports.some(
                  (r) => r.studentId === student.id || r.rollNo === student.rollNo
                );
                const isCritical =
                  student.attendance < 65 ||
                  student.riskLevel === 'Critical' ||
                  student.riskLevel === 'High';
                const isWarning =
                  (student.attendance >= 65 && student.attendance < 75) ||
                  student.riskLevel === 'Moderate' ||
                  student.riskLevel === 'Medium';
                const arrears = student.arrearsCount ?? student.backlogs ?? 0;

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCritical
                        ? 'bg-error/5 hover:bg-surface-container-high/40'
                        : 'hover:bg-surface-container-high/30'
                    }`}
                  >
                    {/* Profile */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          className={`w-9 h-9 rounded-full object-cover shadow-sm ring-1 ${
                            isCritical
                              ? 'ring-error/50'
                              : isWarning
                              ? 'ring-secondary/40'
                              : 'ring-tertiary/40'
                          }`}
                          src={
                            student.avatar ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuC9FtQZopewWxhD_7TlQOS80IJAye0UUE4GDIyGEys13t4gY8PPosAwtqu2DdfeWB9K-Gd0t2hyMNNcZMyaMdKTMrqw0WMB5cMbw0H-7QPvPgplkko5LJ0WkEvGphgVSFeu5NSBx_jpxgmsoEJMuyoeTG-zj0P-DWOlxYQhl9kfHEAiBffEusrEqQunPZcOFoDHKVnAFbRdqsSVLOTlkIagiLoE8YZ9uTD1wxPxDbj8u0YogPE64w6cbA'
                          }
                          alt={student.name}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface text-sm">
                            {student.name}
                          </span>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-on-surface-variant font-mono">{student.rollNo}</span>
                            <span className="text-outline">•</span>
                            <span
                              className={
                                arrears > 0 ? 'text-error font-medium' : 'text-tertiary font-medium'
                              }
                            >
                              {arrears > 0 ? `${arrears} Active Arrears` : '0 Arrears'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Meter */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 w-36 sm:w-44">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span
                            className={
                              student.attendance < 65
                                ? 'text-error'
                                : student.attendance < 75
                                ? 'text-secondary'
                                : 'text-tertiary'
                            }
                          >
                            {student.attendance}%
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] ${
                              student.attendance < 65
                                ? 'bg-error-container/40 text-error'
                                : student.attendance < 75
                                ? 'bg-secondary-container/30 text-secondary'
                                : 'bg-tertiary-container/30 text-tertiary'
                            }`}
                          >
                            {student.attendance < 65
                              ? 'Debarment Danger'
                              : student.attendance < 75
                              ? 'Borderline'
                              : 'Safe'}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendance < 65
                                ? 'bg-error'
                                : student.attendance < 75
                                ? 'bg-secondary'
                                : 'bg-tertiary'
                            }`}
                            style={{ width: `${Math.min(100, student.attendance)}%` }}
                          />
                        </div>
                        <span className="text-outline text-[11px]">
                          {student.attendance < 75
                            ? `Deficit: -${(75 - student.attendance).toFixed(1)}%`
                            : `+${(student.attendance - 75).toFixed(1)}% Safe Margin`}
                        </span>
                      </div>
                    </td>

                    {/* CGPA & Vector */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-on-surface font-semibold">CGPA {student.cgpa}</span>
                          {student.cgpa < 6.5 && (
                            <span className="text-error text-xs font-semibold">(Low)</span>
                          )}
                          {student.cgpa >= 8.5 && (
                            <span className="text-tertiary text-xs font-semibold">Exemplary</span>
                          )}
                        </div>
                        <span className="text-on-surface-variant text-xs truncate max-w-[160px]">
                          {student.internalMarksSummary ||
                            `IA Avg: ${Math.round(student.cgpa * 9.5)}/100`}
                        </span>
                      </div>
                    </td>

                    {/* Risk Classification */}
                    <td className="py-3.5 px-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/15 text-error text-xs font-bold shadow-[0_0_8px_rgba(255,180,171,0.2)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-error animate-ping" />
                          Critical Escalation
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-semibold">
                          At Risk (Watchlist)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-xs font-semibold">
                          Safe &amp; On Track
                        </span>
                      )}
                    </td>

                    {/* HOD Status */}
                    <td className="py-3.5 px-4">
                      {isReported ? (
                        <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold">
                          <span className="material-symbols-outlined text-sm text-secondary">
                            pending_actions
                          </span>
                          <span>HOD Docket Active</span>
                        </div>
                      ) : isCritical ? (
                        <div className="flex items-center gap-1.5 text-error text-xs font-medium">
                          <span className="material-symbols-outlined text-sm text-error">
                            error_outline
                          </span>
                          <span>Needs HOD Notice</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-outline text-xs">
                          <span className="material-symbols-outlined text-sm">done</span>
                          <span>Nominal</span>
                        </div>
                      )}
                    </td>

                    {/* Console Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isReported
                              ? 'bg-surface-container-high text-secondary cursor-default'
                              : 'bg-error-container/30 text-error hover:bg-error hover:text-on-error shadow-sm'
                          }`}
                          onClick={() => handleOpenEscalation(student)}
                          type="button"
                        >
                          {isReported ? 'Reported to HOD' : '+ Report to HOD'}
                        </button>
                        <button
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright text-xs font-medium transition-colors"
                          onClick={() => onInspectStudent && onInspectStudent(student.id)}
                          type="button"
                        >
                          Dossier
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                          title="View Complete Academic File"
                          onClick={() => onInspectStudent && onInspectStudent(student.id)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">folder_open</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Metric Footnotes */}
        <div className="p-4 bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 text-outline text-xs border-t border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span>Showing {filteredStudents.length} of {mentees.length} Cohort Records</span>
            <span>•</span>
            <span className="text-error font-semibold">
              {criticalCount} students currently eligible for statutory debarment
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              disabled
              type="button"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 rounded bg-primary text-on-primary font-bold">1</span>
            <button
              className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
            >
              2
            </button>
            <button
              className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Analytical Signal & Telemetry Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Academic Telemetry Trend */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-on-surface font-headline-sm">
                Cohort Attendance Trajectory
              </span>
              <span className="text-xs text-on-surface-variant">Weeks 1 - 10 Trend Analysis</span>
            </div>
            <span className="material-symbols-outlined text-primary text-xl">insights</span>
          </div>

          {/* Inline Vector Sparkline Chart */}
          <div className="w-full h-32 flex items-end">
            <svg
              className="w-full h-full text-primary"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 300 80"
            >
              <path
                d="M0,65 Q30,58 60,62 T120,40 T180,50 T240,25 T300,32"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <path
                d="M0,65 Q30,58 60,62 T120,40 T180,50 T240,25 T300,32 L300,80 L0,80 Z"
                fill="url(#attendanceGradRoster)"
                opacity="0.15"
              />
              <line
                stroke="#ffb4ab"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                x1="0"
                x2="300"
                y1="52"
                y2="52"
              />
              <defs>
                <linearGradient id="attendanceGradRoster" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant text-xs mt-3 pt-2 border-t border-surface-container-highest font-medium">
            <div className="flex items-center gap-1.5 text-error font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
              <span>75% Debarment Threshold Line</span>
            </div>
            <span className="text-tertiary font-mono font-bold">Cohort Avg: 78.4%</span>
          </div>
        </div>

        {/* Mentoring Protocol Directives */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-on-surface font-headline-sm">
                Mentorship Protocol SLA
              </span>
              <span className="text-xs text-on-surface-variant">Statutory Compliance Directives</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-xl">policy</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant/20">
              <span className="material-symbols-outlined text-xl text-error shrink-0 mt-0.5">
                priority_high
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">
                  Mandatory Review for &lt;65%
                </span>
                <span className="text-on-surface-variant text-xs">
                  Mentor must document verified assessment before requesting an HOD Tribunal.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container border border-outline-variant/20">
              <span className="material-symbols-outlined text-xl text-secondary shrink-0 mt-0.5">
                timer
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">
                  Weekly Attendance Ledger Lock
                </span>
                <span className="text-on-surface-variant text-xs">
                  Discrepancy claims must be resolved before Friday 17:00 IST.
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container-highest flex items-center justify-between text-xs text-on-surface-variant">
            <span>Dean Regulatory Circular: v2.4</span>
            <span className="text-primary font-semibold cursor-pointer hover:underline">
              Read Guidelines
            </span>
          </div>
        </div>

        {/* Rapid Actions & Tribunal Dispatch Hub */}
        <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-on-surface font-headline-sm">
                Immediate Dispatch Queue
              </span>
              <span className="text-xs text-on-surface-variant">HOD Chamber Active Pipeline</span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-xl">campaign</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {underperformanceReports.slice(0, 2).map((rep) => {
              const att = rep.attendance ?? rep.metrics?.attendance ?? 61.2;
              const arr = rep.arrearsCount ?? rep.metrics?.backlogs ?? 2;
              const stat = rep.status ?? rep.hodStatus ?? 'Escalating';

              return (
                <div
                  key={rep.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border-l-2 border-error"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-on-surface">
                      {rep.studentName} ({rep.rollNo})
                    </span>
                    <span className="text-error text-[11px]">
                      {att}% Attendance • Arrears: {arr}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-error-container/20 text-error text-[10px] font-bold">
                    {stat}
                  </span>
                </div>
              );
            })}
            {underperformanceReports.length === 0 && (
              <div className="p-3 rounded bg-surface-container text-xs text-outline text-center">
                No active escalations in queue.
              </div>
            )}
          </div>
          <button
            className="w-full mt-4 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(192,193,255,0.2)]"
            onClick={() => handleOpenEscalation(mentees[0])}
            type="button"
          >
            <span className="material-symbols-outlined text-base">send_time_extension</span>
            <span>Initiate Departmental Hearing</span>
          </button>
        </div>
      </div>

      {/* Prominently Featured HOD Staff Escalation Modal */}
      {isEscalateModalOpen && selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-surface-container-low rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-surface-container flex items-center justify-between border-b border-surface-container-highest">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-xl">gavel</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-on-surface tracking-tight font-headline-md">
                    Escalate Mentee to Head of Department (HOD Cyber Security)
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Statutory Disciplinary and Academic Debarment Referral
                  </span>
                </div>
              </div>
              <button
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
                onClick={() => setIsEscalateModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Target Mentee Strip */}
            <div className="px-5 py-3.5 bg-surface-container-high/40 flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">
                    Target Mentee
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {selectedStudentForModal.name}{' '}
                    <span className="font-mono text-primary font-normal">
                      ({selectedStudentForModal.rollNo})
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-outline uppercase">Current Attendance</span>
                  <span className="font-bold text-error">
                    {selectedStudentForModal.attendance}% (
                    {selectedStudentForModal.attendance < 65 ? 'Critical' : 'Borderline'})
                  </span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-outline uppercase">Arrears</span>
                  <span className="font-bold text-error">
                    {selectedStudentForModal.arrearsCount ?? selectedStudentForModal.backlogs ?? 0} Backlogs
                  </span>
                </div>
                <div className="h-6 w-px bg-surface-container-highest" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-outline uppercase">CGPA</span>
                  <span className="font-bold text-on-surface">
                    {selectedStudentForModal.cgpa}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">
              {/* Multi-Select Violation Checklist */}
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                  Documented Violations &amp; Infractions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                  {[
                    {
                      title: 'Severe Attendance Shortage',
                      desc: '<65% statutory debarment limit',
                    },
                    {
                      title: 'Multiple Active Backlogs',
                      desc: 'Arrears across key theory subjects',
                    },
                    {
                      title: 'Continuous Failure in IA Tests',
                      desc: 'Sub-35% scores in IA-1 and IA-2',
                    },
                    {
                      title: 'Chronic Morning Absenteeism',
                      desc: 'Over 14 first-hour unexcused absences',
                    },
                  ].map((item) => (
                    <label
                      key={item.title}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                    >
                      <input
                        checked={violations.includes(item.title)}
                        onChange={() => handleToggleViolation(item.title)}
                        className="mt-0.5 h-4 w-4 rounded bg-surface-container-lowest text-primary focus:ring-0"
                        type="checkbox"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{item.title}</span>
                        <span className="text-[11px] text-on-surface-variant">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mentor Direct Observation Textarea */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                    Faculty Mentor Direct Observation
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Official Record • Confidential
                  </span>
                </div>
                <textarea
                  className="w-full bg-surface-container-lowest text-on-surface rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 shadow-inner resize-none"
                  rows={3}
                  value={mentorObservation}
                  onChange={(e) => setMentorObservation(e.target.value)}
                />
              </div>

              {/* Recommended HOD Action Dropdown */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                  Recommended HOD Statutory Action
                </span>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 shadow-inner appearance-none"
                    value={recommendedAction}
                    onChange={(e) => setRecommendedAction(e.target.value)}
                  >
                    <option value="Summon Mandatory Parent-Mentor-HOD Hearing">
                      Summon Mandatory Parent-Mentor-HOD Hearing
                    </option>
                    <option value="Issue Formal Debarment Warning Notice (Notice 2)">
                      Issue Formal Debarment Warning Notice (Notice 2)
                    </option>
                    <option value="Refer to Institutional Student Counseling Cell (Wellbeing)">
                      Refer to Institutional Student Wellbeing Cell
                    </option>
                    <option value="Impose Remedial Laboratory & Tutorial Detention">
                      Impose Remedial Laboratory &amp; Tutorial Detention
                    </option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-base">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Audit & Compliance Notice */}
              <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 flex items-center gap-2.5 text-error">
                <span className="material-symbols-outlined text-lg shrink-0">info</span>
                <span className="text-xs">
                  Submitting this dossier issues an automated SMS dispatch to student's registered guardian and marks the student's profile for disciplinary tracking.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container flex items-center justify-between border-t border-surface-container-highest">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-sm text-tertiary">lock</span>
                <span>Digital Signature: Dr. K. Ramachandran</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright text-xs font-semibold transition-colors"
                  onClick={() => setIsEscalateModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-error text-on-error hover:bg-error/90 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(255,180,171,0.3)]"
                  onClick={handleSubmitEscalation}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Confirm &amp; Forward to HOD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
