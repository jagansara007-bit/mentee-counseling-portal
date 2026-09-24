import React, { useState } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { UnderperformanceReport } from '../types';

interface HODCommandHubViewProps {
  onInspectStudent?: (studentId: string) => void;
}

export const HODCommandHubView: React.FC<HODCommandHubViewProps> = ({ onInspectStudent }) => {
  const {
    underperformanceReports,
    complaints,
    mentees,
    updateHODAction,
    updateComplaintStatus,
  } = useMentorship();

  const [activeTab, setActiveTab] = useState<'queue' | 'surveillance' | 'grievance'>('queue');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form state for grievance resolution
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleResolveGrievance = (complaintId: string) => {
    setResolvingId(complaintId);
    const draftText =
      resolutionDrafts[complaintId] ||
      "Executive concurrence granted. Directing department advisor to implement official redressal within 24 hours. Academic registrar CC'd.";

    setTimeout(() => {
      setResolvingId(null);
      updateComplaintStatus(complaintId, 'Resolved', draftText);
      showToast(`Grievance #${complaintId} officially resolved and student portal updated.`);
    }, 700);
  };

  const handleUpdateStatus = (
    complaintId: string,
    status: 'In Progress' | 'Forwarded to HOD' | 'Resolved'
  ) => {
    const draftText = resolutionDrafts[complaintId] || `Status updated to ${status} by HOD`;
    updateComplaintStatus(complaintId, status, draftText);
    showToast(`Grievance #${complaintId} status set to ${status}.`);
  };

  const handleExecuteHODAction = (
    reportId: string,
    actionName: string,
    status: UnderperformanceReport['hodStatus']
  ) => {
    updateHODAction(
      reportId,
      status,
      `HOD Action executed: ${actionName} on ${new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`
    );
    showToast(`Action dispatched: ${actionName}`);
  };

  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-surface-container-highest text-on-surface border border-primary/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-tertiary">task_alt</span>
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Subtle Ambient Top Halo */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-10 w-80 h-80 bg-error/10 rounded-full blur-3xl pointer-events-none" />

        {/* Executive Title and Clearance Banner */}
        <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-surface-container-highest text-primary text-xs uppercase tracking-wider font-semibold">
                Dean of Department Console
              </span>
              <span className="px-2.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                Live Governance Feed
              </span>
              <span className="text-xs text-outline font-mono">Session Ref: #CYS-DIR-2026-Q2</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight font-display-lg">
              Executive HOD Command Hub
            </h1>
            <p className="text-sm text-on-surface-variant max-w-3xl">
              Supervisory cockpit of{' '}
              <span className="text-on-surface font-semibold">Dr. K. Ramachandran, Ph.D.</span> —
              Head of Department, Cyber Security. Reviewing faculty escalation
              dockets, regulatory attendance thresholds, and student tribunals.
            </p>
          </div>

          {/* Quick Executive Utility Bar */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors text-sm font-medium shadow-sm border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Regulatory Audit Export</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim transition-all text-sm font-bold shadow-[0_0_16px_rgba(192,193,255,0.25)]"
              type="button"
            >
              <span className="material-symbols-outlined text-base">campaign</span>
              <span>Broadcast Department Summons</span>
            </button>
          </div>
        </div>

        {/* 4 Department Vital KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* KPI 1 */}
          <div className="relative rounded-xl bg-surface-container-low p-5 border border-outline-variant/20 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Staff Escalations
              </span>
              <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary text-xs font-semibold">
                Requires HOD Sign-off
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface tracking-tight font-display-lg">
                0{underperformanceReports.length || 7}
              </span>
              <span className="text-base text-secondary font-semibold font-headline-sm">Cases</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-highest">
              <span className="flex items-center gap-1 text-error font-medium">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> 3 urgent hearings today
              </span>
              <span className="text-outline">Queue SLA: 24h</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="relative rounded-xl bg-surface-container-low p-5 border border-outline-variant/20 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Academic Debarment List
              </span>
              <span className="px-2 py-0.5 rounded bg-error-container/40 text-error text-xs font-semibold">
                &lt;65% Threshold
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-error tracking-tight font-display-lg">14</span>
              <span className="text-base text-error font-semibold font-headline-sm">Students</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-highest">
              <span className="text-error font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span> Notice deadline: 48h
              </span>
              <span className="text-outline">AU Affiliation Risk</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="relative rounded-xl bg-surface-container-low p-5 border border-outline-variant/20 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Unresolved Grievances
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-xs font-semibold">
                Active Tribunal
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface tracking-tight font-display-lg">
                0{pendingComplaintsCount || 4}
              </span>
              <span className="text-base text-primary font-semibold font-headline-sm">Tickets</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-highest">
              <span className="text-on-surface-variant truncate">2 Academic • 1 Infra • 1 Faculty</span>
              <span className="text-tertiary font-medium">1 High</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="relative rounded-xl bg-surface-container-low p-5 border border-outline-variant/20 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                Remedial Batches Active
              </span>
              <span className="px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary text-xs font-semibold">
                Spring &apos;26 Track
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-tertiary tracking-tight font-display-lg">03</span>
              <span className="text-base text-tertiary font-semibold font-headline-sm">Batches</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container-highest">
              <span className="text-on-surface font-medium">68 Enrolled Attendees</span>
              <span className="text-outline">89% Remedial Avg</span>
            </div>
          </div>
        </div>

        {/* HOD Tab Navigation Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="inline-flex p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-inner">
            <button
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'queue'
                  ? 'bg-surface-container-high text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('queue')}
              type="button"
            >
              <span className="material-symbols-outlined text-base">assignment_late</span>
              <span>Faculty Escalation Reviews</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-secondary-container text-secondary text-xs font-bold font-mono">
                {underperformanceReports.length || 7}
              </span>
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'surveillance'
                  ? 'bg-surface-container-high text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('surveillance')}
              type="button"
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              <span>Department Underperformance Surveillance</span>
            </button>
            <button
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'grievance'
                  ? 'bg-surface-container-high text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('grievance')}
              type="button"
            >
              <span className="material-symbols-outlined text-base">gavel</span>
              <span>Student Grievance Tribunal</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-error-container/40 text-error text-xs font-bold font-mono">
                {pendingComplaintsCount || 4}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-outline font-semibold">
              Cohort Sort:
            </span>
            <button
              className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-medium flex items-center gap-1 border border-outline-variant/30"
              type="button"
            >
              <span>Highest Risk Velocity</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* Main Operational Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Primary Operational Column (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Tab 1: Priority Escalation Dossiers */}
            {activeTab === 'queue' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <h2 className="text-xl font-bold text-on-surface font-headline-md">
                      Priority Escalation Dossiers
                    </h2>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {underperformanceReports.length} cases pending executive action
                  </span>
                </div>

                {/* Live Escalation Cards */}
                {underperformanceReports.map((report) => {
                  const att = report.attendance ?? report.metrics?.attendance ?? 61.2;
                  const arr = report.arrearsCount ?? report.metrics?.backlogs ?? 0;
                  const stat = report.status ?? report.hodStatus ?? 'Pending HOD Review';
                  const notes = report.mentorNotes ?? report.staffRemarks ?? '';
                  const fac = report.facultyName ?? report.reportedBy ?? 'Dr. K. Ramachandran';
                  const created = report.createdAt ?? report.date ?? new Date().toISOString();

                  return (
                    <div
                      key={report.id}
                      className="rounded-xl bg-surface-container p-5 border border-outline-variant/30 shadow-lg relative overflow-hidden transition-all hover:bg-surface-container-high/60"
                    >
                      {/* Severity Accent Strip */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          att < 65
                            ? 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.6)]'
                            : 'bg-secondary'
                        }`}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 pl-1">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-12 h-12 rounded-xl object-cover shadow-sm border border-outline-variant/30"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyfp_IakKjGtk9Gsmq-yV3pyx9sj-l5y8Mm0c3Cv1VbG1nAOz98H-fPt4BoLJr-gEwjRVKM_WaWRcvfxp1x-fc43GNtjA_HhkUCp1Ycn7k-mN2yTfq4vuYKKtSriHO59_Ozxxyx1dzmBuN_vN0l0aUH2Tu9MduUTsWtqwLTEGT87N92ExTzFEoHgcGzvDHrvLPrhIpmqc6uI2zjXJd42_xqc5QpnnkF6x2OlB2axlGVOnYw2aBA3hH3A"
                            alt={report.studentName}
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-on-surface">
                                {report.studentName}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-mono text-xs">
                                {report.rollNo}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                  att < 65
                                    ? 'bg-error-container/40 text-error'
                                    : 'bg-secondary-container/40 text-secondary'
                                }`}
                              >
                                <span className="material-symbols-outlined text-xs">emergency</span>
                                {att < 65
                                  ? 'Tier 1 Debarment Threat'
                                  : 'Conditional Borderline'}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              Reporting Faculty:{' '}
                              <span className="text-on-surface font-semibold">{fac}</span> (Mentor,
                              Sec-B) •{' '}
                              <span className="text-outline">
                                {new Date(created).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Key Metrics Badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-error-container/20 text-error font-mono text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            Att: {att}%
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-secondary font-mono text-xs font-semibold">
                            {arr} Active Backlogs
                          </span>
                        </div>
                      </div>

                      {/* Tags Row */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3 pl-1">
                        {report.reasons?.map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant text-xs border border-outline-variant/30"
                          >
                            {reason}
                          </span>
                        ))}
                        <span className="px-2.5 py-0.5 rounded bg-surface-container-lowest text-error text-xs font-medium border border-outline-variant/30">
                          Status: {stat}
                        </span>
                      </div>

                      {/* Mentor Note Box */}
                      <div className="rounded-lg bg-surface-container-low p-3 mb-4 pl-3.5 text-on-surface-variant text-xs border border-outline-variant/20 leading-relaxed">
                        <div className="flex items-center gap-1 mb-1 text-secondary text-[11px] uppercase tracking-wider font-bold">
                          <span className="material-symbols-outlined text-sm">
                            record_voice_over
                          </span>
                          Mentor&apos;s Sworn Log Note
                        </div>
                        &ldquo;{notes}&rdquo;
                      </div>

                    {/* HOD Action Suite */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pl-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-fixed-dim transition-all shadow-[0_0_12px_rgba(192,193,255,0.25)]"
                          onClick={() =>
                            handleExecuteHODAction(
                              report.id,
                              'Summon Parent Hearing',
                              'Hearing Scheduled'
                            )
                          }
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">mail</span>
                          <span>Summon Parent Hearing</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-container/20 text-error hover:bg-error-container/40 text-xs font-bold transition-colors"
                          onClick={() =>
                            handleExecuteHODAction(
                              report.id,
                              'Issue Debarment Notice',
                              'Action Taken'
                            )
                          }
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">gavel</span>
                          <span>Issue Debarment Notice</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary-container/30 text-tertiary hover:bg-tertiary-container/50 text-xs font-bold transition-colors"
                          onClick={() =>
                            handleExecuteHODAction(
                              report.id,
                              'Mandate Remedial Cohort',
                              'Action Taken'
                            )
                          }
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">school</span>
                          <span>Mandate Remedial Cohort</span>
                        </button>
                      </div>

                      <button
                        className="text-xs text-outline hover:text-on-surface transition-colors underline underline-offset-4"
                        onClick={() => onInspectStudent && onInspectStudent(report.studentId)}
                        type="button"
                      >
                        Inspect Full Academic File →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

            {/* Tab 2: Department Underperformance Surveillance */}
            {activeTab === 'surveillance' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-on-surface font-headline-md">
                    Cohort Underperformance Risk Matrix
                  </h2>
                  <span className="text-xs text-on-surface-variant">Real-time Telemetry Feed</span>
                </div>

                <div className="rounded-xl bg-surface-container p-5 border border-outline-variant/30 space-y-4">
                  <p className="text-xs text-on-surface-variant">
                    Displaying students flagged by automated heuristic algorithms: Attendance &lt; 75% or CGPA &lt; 6.5 or multiple arrears.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-surface-container-high text-outline uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Student</th>
                          <th className="py-2.5 px-3">Attendance</th>
                          <th className="py-2.5 px-3">CGPA</th>
                          <th className="py-2.5 px-3">Arrears</th>
                          <th className="py-2.5 px-3">Risk Factor</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-highest">
                        {mentees
                          .filter(
                            (m) =>
                              m.attendance < 75 ||
                              m.cgpa < 7.0 ||
                              (m.arrearsCount ?? m.backlogs ?? 0) > 0
                          )
                          .map((m) => {
                            const arr = m.arrearsCount ?? m.backlogs ?? 0;
                            return (
                              <tr key={m.id} className="hover:bg-surface-container-high/40">
                                <td className="py-3 px-3">
                                  <span className="font-semibold text-on-surface block">
                                    {m.name}
                                  </span>
                                  <span className="text-outline font-mono">{m.rollNo}</span>
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-error">
                                  {m.attendance}%
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-on-surface">
                                  {m.cgpa}
                                </td>
                                <td className="py-3 px-3 font-bold text-secondary">{arr}</td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded bg-error-container/20 text-error font-semibold">
                                    {m.attendance < 65
                                      ? 'Critical Shortage'
                                      : 'Borderline Attendance'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={() => onInspectStudent && onInspectStudent(m.id)}
                                    className="px-2.5 py-1 rounded bg-surface-container-high text-primary hover:bg-surface-bright font-semibold"
                                  >
                                    Open File
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Student Grievance Tribunal Redressal */}
            {activeTab === 'grievance' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-2xl">balance</span>
                    <h2 className="text-xl font-bold text-on-surface font-headline-md">
                      Student &amp; Faculty Grievance Tribunal
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-error-container/30 text-error text-xs font-bold uppercase tracking-wider">
                    {pendingComplaintsCount} Pending Grievance Dockets
                  </span>
                </div>

                {complaints.length === 0 ? (
                  <div className="p-8 rounded-xl bg-surface-container text-center text-on-surface-variant border border-outline-variant/30">
                    <span className="material-symbols-outlined text-3xl text-tertiary mb-2">task_alt</span>
                    <p className="text-sm font-semibold">No complaints registered in department queue.</p>
                  </div>
                ) : (
                  complaints.map((c) => {
                    const isResolvingThis = resolvingId === c.id;
                    const draft =
                      resolutionDrafts[c.id] ??
                      c.hodRemarks ??
                      "Executive concurrence granted. Directing department mentor to execute required adjustment in database within 24 hours.";

                    return (
                      <div
                        key={c.id}
                        className="rounded-xl bg-surface-container p-5 sm:p-6 shadow-lg border border-outline-variant/30 flex flex-col gap-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg bg-surface-container-highest text-primary font-mono text-xs font-bold">
                              {c.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-secondary text-xs font-semibold border border-outline-variant/30">
                              {c.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                c.priority === 'Urgent'
                                  ? 'bg-error-container/40 text-error'
                                  : c.priority === 'High'
                                  ? 'bg-secondary-container/40 text-secondary'
                                  : 'bg-surface-container-high text-on-surface-variant'
                              }`}
                            >
                              {c.priority} Priority
                            </span>
                            {c.isAnonymous && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                                Anonymous
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-outline font-mono">
                              {c.date} • {c.timestamp}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                c.status === 'Resolved'
                                  ? 'bg-tertiary-container/30 text-tertiary border border-tertiary/30'
                                  : 'bg-error-container/20 text-error border border-error/30'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                        </div>

                        {/* Subject & Description */}
                        <div>
                          <span className="text-[11px] text-outline uppercase tracking-wider font-semibold block">
                            Petition Subject
                          </span>
                          <h3 className="text-base font-bold text-on-surface mt-0.5">
                            {c.subject}
                          </h3>
                          <p className="mt-2 text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/20">
                            {c.description}
                          </p>
                        </div>

                        {/* Petitioner Details */}
                        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                          <span>
                            Petitioner:{' '}
                            <strong className="text-on-surface font-semibold">
                              {c.studentName}
                            </strong>{' '}
                            <span className="font-mono text-outline">({c.rollNo})</span> • {c.department}
                          </span>
                          {onInspectStudent && (
                            <button
                              onClick={() => onInspectStudent(c.studentId)}
                              className="text-primary hover:underline text-xs"
                              type="button"
                            >
                              View Student File →
                            </button>
                          )}
                        </div>

                        {/* Official Resolution Formulation / Status */}
                        {c.status === 'Resolved' ? (
                          <div className="p-3.5 rounded-lg bg-tertiary-container/15 border border-tertiary/30 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-tertiary font-bold">
                              <span className="material-symbols-outlined text-sm">verified_user</span>
                              <span>Official Resolution Dispatched by HOD:</span>
                            </div>
                            <p className="text-on-surface leading-relaxed pl-5 font-mono text-[11px]">
                              {c.hodRemarks || 'Executive concurrence granted and grievance closed.'}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-lg bg-surface-container-low p-4 border border-outline-variant/20 flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label
                                className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold"
                                htmlFor={`hod-res-${c.id}`}
                              >
                                HOD Official Executive Resolution &amp; Committee Order
                              </label>
                              <textarea
                                className="w-full bg-surface-container-lowest text-on-surface rounded-lg p-3 text-xs placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 shadow-inner resize-none"
                                id={`hod-res-${c.id}`}
                                rows={2}
                                value={draft}
                                onChange={(e) =>
                                  setResolutionDrafts((prev) => ({
                                    ...prev,
                                    [c.id]: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                                <span className="material-symbols-outlined text-sm text-tertiary">
                                  verified_user
                                </span>
                                <span>Countersigned with Department Head Key</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright text-xs font-semibold transition-colors"
                                  onClick={() => handleUpdateStatus(c.id, 'In Progress')}
                                  type="button"
                                >
                                  Mark In Progress
                                </button>
                                <button
                                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md bg-primary text-on-primary hover:bg-primary-fixed-dim"
                                  disabled={isResolvingThis}
                                  onClick={() => handleResolveGrievance(c.id)}
                                  type="button"
                                >
                                  {isResolvingThis ? (
                                    <>
                                      <span className="material-symbols-outlined text-sm animate-spin">
                                        refresh
                                      </span>
                                      <span>Transmitting Resolution...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="material-symbols-outlined text-sm">
                                        check_circle
                                      </span>
                                      <span>Submit Resolution &amp; Close</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right Column: Visual Analytics & Debarment Matrix (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Attendance Distribution by Semester Visual Analytics Card */}
            <div className="rounded-xl bg-surface-container p-5 shadow-lg border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-on-surface font-headline-sm">
                  Attendance Distribution
                </h2>
                <span className="text-xs text-outline uppercase tracking-wider font-semibold">
                  Spring &apos;26 Cohort
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Surveillance telemetry across Semesters IV, VI, and VIII showing compliance rates against institutional minimums.
              </p>

              {/* Attendance Visual Breakdown Progress Bars */}
              <div className="space-y-4 mt-2">
                {/* Sem IV */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface font-semibold">Semester IV (Cyber Security A &amp; B)</span>
                    <span className="text-outline font-mono">142 Enrolled</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface-container-lowest flex overflow-hidden border border-outline-variant/20">
                    <div className="h-full bg-tertiary" style={{ width: '78%' }} />
                    <div className="h-full bg-secondary" style={{ width: '15%' }} />
                    <div className="h-full bg-error" style={{ width: '7%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="text-tertiary font-semibold">78% Safe</span>
                    <span className="text-secondary font-semibold">15% Margin</span>
                    <span className="text-error font-bold">7% Debarred (4)</span>
                  </div>
                </div>

                {/* Sem VI */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface font-semibold">
                      Semester VI (Cyber Security Core)
                    </span>
                    <span className="text-outline font-mono">128 Enrolled</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface-container-lowest flex overflow-hidden border border-outline-variant/20">
                    <div className="h-full bg-tertiary" style={{ width: '69%' }} />
                    <div className="h-full bg-secondary" style={{ width: '20%' }} />
                    <div className="h-full bg-error" style={{ width: '11%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="text-tertiary font-semibold">69% Safe</span>
                    <span className="text-secondary font-semibold">20% Margin</span>
                    <span className="text-error font-bold">11% Debarred (8)</span>
                  </div>
                </div>

                {/* Sem VIII */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface font-semibold">
                      Semester VIII (Capstones &amp; Labs)
                    </span>
                    <span className="text-outline font-mono">110 Enrolled</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface-container-lowest flex overflow-hidden border border-outline-variant/20">
                    <div className="h-full bg-tertiary" style={{ width: '86%' }} />
                    <div className="h-full bg-secondary" style={{ width: '11%' }} />
                    <div className="h-full bg-error" style={{ width: '3%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="text-tertiary font-semibold">86% Safe</span>
                    <span className="text-secondary font-semibold">11% Margin</span>
                    <span className="text-error font-bold">3% Debarred (2)</span>
                  </div>
                </div>
              </div>

              {/* Color Legend */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  <span>Safe (&gt;75%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span>Warning (65-75%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" />
                  <span>Debarred (&lt;65%)</span>
                </div>
              </div>
            </div>

            {/* Mentorship Compliance & Faculty Roster Telemetry */}
            <div className="rounded-xl bg-surface-container p-5 shadow-lg border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-on-surface font-headline-sm">
                  Mentorship Log Cadence
                </h2>
                <span className="material-symbols-outlined text-outline text-lg">verified</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface font-semibold block">
                      Prof. S. Natarajan
                    </span>
                    <span className="text-[11px] text-outline">Section B • 24 Mentees</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-mono text-xs font-bold">
                    100% On-Time
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface font-semibold block">Dr. Anita Roy</span>
                    <span className="text-[11px] text-outline">Section AI • 26 Mentees</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-mono text-xs font-bold">
                    96% On-Time
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface font-semibold block">
                      Dr. M. Venkatesh
                    </span>
                    <span className="text-[11px] text-outline">Section C • 22 Mentees</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-error-container/30 text-error font-mono text-xs font-bold">
                    3 Overdue Logs
                  </span>
                </div>
              </div>
              <button
                className="w-full py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-colors text-center border border-outline-variant/30"
                type="button"
              >
                Review Complete Faculty Compliance Grid →
              </button>
            </div>

            {/* Academic Calendar Immediate Regulatory Milestones */}
            <div className="rounded-xl bg-surface-container p-5 shadow-lg border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">event_available</span>
                <h2 className="text-base font-bold text-on-surface font-headline-sm">
                  Regulatory Deadlines
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-error-container/30 text-error shrink-0 border border-error/30">
                    <span className="text-[10px] uppercase font-bold">Apr</span>
                    <span className="text-sm font-bold leading-none">12</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface font-semibold block">
                      Anna Univ. Final Debarment Freeze
                    </span>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Attendance locks permanently at 17:00 IST. No manual overrides permitted.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-surface-container-highest text-secondary shrink-0 border border-secondary/30">
                    <span className="text-[10px] uppercase font-bold">Apr</span>
                    <span className="text-sm font-bold leading-none">18</span>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface font-semibold block">
                      Tribunal Redressal Closure
                    </span>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      All pending internal lab mark grievances must be formally signed off by HOD.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
