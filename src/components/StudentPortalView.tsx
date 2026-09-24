import React, { useState } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { Complaint } from '../types';

interface StudentPortalViewProps {
  onOpenRaiseGrievance?: () => void;
  selectedStudentId?: string | null;
  onBackToRoster?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  onOpenRaiseGrievance,
  selectedStudentId,
  onBackToRoster,
}) => {
  const { mentees, complaints, raiseComplaint } = useMentorship();
  const currentStudent =
    (selectedStudentId ? mentees.find((m) => m.id === selectedStudentId) : null) ||
    mentees.find((m) => m.rollNo === '22CS104') ||
    mentees[0];

  const [activeTab, setActiveTab] = useState<'academic' | 'grievances' | 'hearings'>('academic');

  // Form state for inline grievance submission
  const [cat, setCat] = useState<Complaint['category']>('Academic Issues');
  const [priority, setPriority] = useState<Complaint['priority']>('Medium');
  const [subject, setSubject] = useState('Discrepancy in Model Exam marks tabulation for CS3620');
  const [desc, setDesc] = useState(
    'The scored script shows 74/100, but the portal reflects 64/100 under CS3620 Model Examination ledger. Requesting physical verification against the master mark ledger.'
  );
  const [isAnon, setIsAnon] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !desc.trim()) return;

    const newTicket = raiseComplaint({
      studentId: currentStudent.id,
      studentName: isAnon ? 'Confidential Student' : currentStudent.name,
      rollNo: isAnon ? 'ANONYMOUS' : currentStudent.rollNo,
      department: currentStudent.department,
      category: cat,
      subject: subject.trim(),
      description: desc.trim(),
      priority,
      isAnonymous: isAnon,
    });

    setToastMsg(`Grievance #${newTicket.id} successfully recorded in Academic Ledger.`);
    setTimeout(() => setToastMsg(null), 4000);
    setSubject('');
    setDesc('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full space-y-6">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-surface-container-highest text-on-surface border border-primary/40 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <span className="material-symbols-outlined text-tertiary">task_alt</span>
            <span className="text-sm font-medium">{toastMsg}</span>
          </div>
        )}

        {/* Back navigation button if inspecting a mentee */}
        {selectedStudentId && onBackToRoster && (
          <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
            <button
              onClick={onBackToRoster}
              className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-fixed-dim transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Faculty Roster</span>
            </button>
            <span className="text-xs text-outline font-mono">
              Inspecting Academic File: {currentStudent.name} ({currentStudent.rollNo})
            </span>
          </div>
        )}

        {/* Student Profile Hero Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container p-6 shadow-xl border border-outline-variant/30">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  className="h-24 w-24 rounded-xl object-cover shadow-lg ring-1 ring-outline-variant/40"
                  alt="Aarav S. Nair"
                  src={currentStudent.avatar}
                />
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-surface-container-highest text-tertiary text-[11px] font-semibold tracking-wider shadow-sm flex items-center gap-1 border border-tertiary/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
                  VERIFIED
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-on-surface tracking-tight font-headline-lg">
                    {currentStudent.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold">
                    {currentStudent.rollNo}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-surface-bright text-on-surface-variant text-xs">
                    Section {currentStudent.section}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-on-surface-variant text-xs">
                  <span className="flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm text-outline">school</span>
                    {currentStudent.department}
                  </span>
                  <span className="text-outline">•</span>
                  <span>Semester {currentStudent.semester} (Spring 2026)</span>
                  <span className="text-outline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">
                      supervised_user_circle
                    </span>
                    Mentor:{' '}
                    <strong className="text-secondary font-medium">
                      {currentStudent.mentorName}
                    </strong>
                  </span>
                </div>

                <p className="text-[11px] text-outline pt-1 tracking-wider uppercase">
                  Constituent Student Terminal • Tier-1 Audit Node #CS-409
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start xl:self-auto shrink-0">
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-secondary-container via-primary-container to-primary text-on-surface font-semibold text-sm shadow-lg hover:shadow-xl hover:opacity-95 transition-all cursor-pointer"
                onClick={() => {
                  const el = document.getElementById('grievance-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else if (onOpenRaiseGrievance) onOpenRaiseGrievance();
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>+ Raise Grievance</span>
              </button>
            </div>
          </div>

          {/* Metric Highlights (3 Cards) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Attendance */}
            <div className="rounded-lg bg-surface-container-low p-4 flex flex-col justify-between shadow-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-base text-error">event_busy</span>{' '}
                  Overall Attendance
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-error font-mono font-bold text-xs">
                  {currentStudent.attendance}%
                </span>
              </div>
              <div className="my-3 space-y-1.5">
                <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-error via-secondary to-tertiary h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(currentStudent.attendance, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-outline">
                  <span>Threshold: 75% limit</span>
                  <span className={currentStudent.attendance >= 75 ? 'text-tertiary font-semibold' : 'text-error font-semibold'}>
                    {currentStudent.attendance >= 75
                      ? `Margin: +${(currentStudent.attendance - 75).toFixed(1)}%`
                      : `Deficit: ${(currentStudent.attendance - 75).toFixed(1)}%`}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant text-xs pt-1 border-t border-surface-container-high/40">
                <span>
                  Attended: <strong className="text-on-surface font-mono">196 / 250 Hrs</strong>
                </span>
                <span className="text-secondary font-mono font-medium">Req. safe buffer: +8h</span>
              </div>
            </div>

            {/* CGPA Status */}
            <div className="rounded-lg bg-surface-container-low p-4 flex flex-col justify-between shadow-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-base text-tertiary">analytics</span>{' '}
                  CGPA Status
                </span>
                <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-mono font-bold text-xs border border-tertiary/20">
                  Rank #18
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-on-surface font-mono">
                  {currentStudent.cgpa.toFixed(2)}
                </span>
                <span className="text-sm text-outline">/ 10.0</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant text-xs pt-1 border-t border-surface-container-high/40">
                <span>
                  Sem V SGPA: <strong className="text-on-surface font-mono">8.65</strong>
                </span>
                <span className="text-tertiary font-mono font-medium flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-sm">trending_up</span> Top 10%
                </span>
              </div>
            </div>

            {/* Backlog Matrix */}
            <div className="rounded-lg bg-surface-container-low p-4 flex flex-col justify-between shadow-md border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-base text-primary">verified_user</span>{' '}
                  Backlog Matrix
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider ${
                  currentStudent.backlogs > 0
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-surface-container-highest text-tertiary'
                }`}>
                  {currentStudent.backlogs > 0 ? `${currentStudent.backlogs} BACKLOGS` : 'ALL CLEARED'}
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className={`text-3xl font-bold font-mono ${currentStudent.backlogs > 0 ? 'text-rose-400' : 'text-tertiary'}`}>
                  {currentStudent.backlogs}
                </span>
                <span className="text-sm text-on-surface-variant">Active Arrears</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant text-xs pt-1 border-t border-surface-container-high/40">
                <span>
                  Accumulated Credits: <strong className="text-on-surface font-mono">142 / 176</strong>
                </span>
                <span className="text-outline font-mono">34 Core Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-xl shadow-inner border border-outline-variant/20 overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'academic'
                ? 'bg-surface-container-high text-primary shadow-sm border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            onClick={() => setActiveTab('academic')}
            type="button"
          >
            <span className="material-symbols-outlined text-base">bar_chart</span>
            <span>Academic Progression</span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'grievances'
                ? 'bg-surface-container-high text-primary shadow-sm border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            onClick={() => setActiveTab('grievances')}
            type="button"
          >
            <span className="material-symbols-outlined text-base">feedback</span>
            <span>Complaints &amp; Grievances</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary-container text-secondary text-[10px] font-mono font-bold">
              {complaints.length}
            </span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hearings'
                ? 'bg-surface-container-high text-primary shadow-sm border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            onClick={() => setActiveTab('hearings')}
            type="button"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Official Actions &amp; Hearings</span>
          </button>
        </div>

        {/* Tab 1: Academic Progression */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Assessment Matrix Table */}
              <div className="xl:col-span-8 flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface tracking-tight">
                      Semester VI Subject Assessment Matrix
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Continuous internal marks, lab assessments, and attendance status
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded bg-surface-container-low text-tertiary text-[11px] font-medium border border-tertiary/20">
                      Updated Today 08:30 AM
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl bg-surface-container-low shadow-md border border-outline-variant/20">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-high text-on-surface-variant text-[11px] tracking-wider uppercase border-b border-outline-variant/30 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Course Code &amp; Title</th>
                        <th className="py-3 px-2 font-mono text-right">IA-1 (50)</th>
                        <th className="py-3 px-2 font-mono text-right">IA-2 (50)</th>
                        <th className="py-3 px-2 font-mono text-right">Model (100)</th>
                        <th className="py-3 px-4 font-mono text-center">Attendance</th>
                        <th className="py-3 px-4 text-right">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-medium">
                      {/* CS3601 */}
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">CS3601</span>
                            <span className="text-on-surface-variant text-xs">Distributed Systems</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">42</td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">45</td>
                        <td className="py-3.5 px-2 font-mono text-right font-semibold text-tertiary">88</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2 font-mono">
                            <span className="text-on-surface">82%</span>
                            <div className="w-12 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                              <div className="bg-tertiary h-full rounded-full" style={{ width: '82%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-semibold border border-tertiary/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" /> Safe
                          </span>
                        </td>
                      </tr>

                      {/* CS3602 */}
                      <tr className="hover:bg-surface-container/60 transition-colors bg-surface-container/20">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">CS3602</span>
                            <span className="text-on-surface-variant text-xs">Deep Learning &amp; Neural Nets</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">38</td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">40</td>
                        <td className="py-3.5 px-2 font-mono text-right font-semibold text-secondary">79</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2 font-mono">
                            <span className="text-secondary">76%</span>
                            <div className="w-12 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                              <div className="bg-secondary h-full rounded-full" style={{ width: '76%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-semibold border border-secondary/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Moderate Risk
                          </span>
                        </td>
                      </tr>

                      {/* CS3603 */}
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">CS3603</span>
                            <span className="text-on-surface-variant text-xs">Cloud Native Microservices</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">46</td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">48</td>
                        <td className="py-3.5 px-2 font-mono text-right font-semibold text-tertiary">92</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2 font-mono">
                            <span className="text-on-surface">84%</span>
                            <div className="w-12 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                              <div className="bg-tertiary h-full rounded-full" style={{ width: '84%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-semibold border border-tertiary/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" /> Safe
                          </span>
                        </td>
                      </tr>

                      {/* CS3611 */}
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">CS3611</span>
                            <span className="text-on-surface-variant text-xs">Advanced AI Laboratory</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-right text-outline">—</td>
                        <td className="py-3.5 px-2 font-mono text-right text-outline">—</td>
                        <td className="py-3.5 px-2 font-mono text-right font-semibold text-tertiary">96 (Int)</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2 font-mono">
                            <span className="text-on-surface">92%</span>
                            <div className="w-12 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                              <div className="bg-tertiary h-full rounded-full" style={{ width: '92%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[11px] font-semibold border border-tertiary/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" /> Safe
                          </span>
                        </td>
                      </tr>

                      {/* IT3620 (Debarred Risk) */}
                      <tr className="hover:bg-surface-container/60 transition-colors bg-error-container/10">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-error text-sm">IT3620</span>
                            <span className="text-on-surface text-xs">Cyber Security Fundamentals</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">31</td>
                        <td className="py-3.5 px-2 font-mono text-right text-on-surface">34</td>
                        <td className="py-3.5 px-2 font-mono text-right font-semibold text-error">64</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2 font-mono">
                            <span className="text-error font-bold">68%</span>
                            <div className="w-12 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                              <div className="bg-error h-full rounded-full" style={{ width: '68%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container/30 text-error text-[11px] font-bold border border-error/30">
                            <span className="material-symbols-outlined text-xs">warning</span> Debarred Risk (&lt;75%)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: SGPA Progression Curve */}
              <div className="xl:col-span-4 flex flex-col space-y-3">
                <div className="rounded-xl bg-surface-container-low p-5 shadow-md border border-outline-variant/20 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-on-surface">SGPA Progression Curve</h3>
                      <span className="text-tertiary text-xs font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-sm">north_east</span> +0.55
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Normalized Grade Points across Semesters I to V
                    </p>
                  </div>

                  {/* Vertical bar charts */}
                  <div className="my-5 flex flex-col space-y-3">
                    <div className="h-44 w-full flex items-end justify-between gap-3 pt-3">
                      {[
                        { sem: 'Sem 1', score: '8.10', height: '60%' },
                        { sem: 'Sem 2', score: '8.25', height: '68%' },
                        { sem: 'Sem 3', score: '8.40', height: '76%' },
                        { sem: 'Sem 4', score: '8.55', height: '84%', highlight: true },
                        { sem: 'Sem 5', score: '8.65', height: '92%', current: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className={`text-[11px] font-mono font-semibold ${
                            item.current ? 'text-tertiary font-bold' : item.highlight ? 'text-secondary' : 'text-outline'
                          }`}>
                            {item.score}
                          </span>
                          <div
                            className={`w-full rounded-t-lg transition-all duration-300 ${
                              item.current
                                ? 'bg-tertiary-container group-hover:bg-tertiary'
                                : item.highlight
                                ? 'bg-secondary-container group-hover:bg-secondary'
                                : 'bg-surface-container-highest group-hover:bg-primary'
                            }`}
                            style={{ height: item.height }}
                          />
                          <span className={`text-[11px] ${item.current ? 'text-tertiary font-bold' : 'text-outline'}`}>
                            {item.sem}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between text-xs border border-outline-variant/20">
                      <span className="text-on-surface-variant">Class Percentile Benchmark</span>
                      <span className="font-mono text-on-surface font-semibold">91.4th percentile</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-high/60 flex items-start gap-2.5 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-base text-secondary shrink-0 mt-0.5">
                      psychology
                    </span>
                    <div className="flex flex-col text-on-surface-variant text-xs">
                      <span className="text-on-surface font-semibold">Mentor Observation</span>
                      <p className="text-outline text-xs line-clamp-2 mt-0.5">
                        "High academic aptitude in ML &amp; distributed algorithms. Recommended attendance recovery plan for IT3620."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Complaints & Grievances */}
        {activeTab === 'grievances' && (
          <div className="p-6 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/20">
            <h3 className="text-base font-bold mb-1">Student Redressal Log</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Historical list of complaints filed, status resolutions, and pending institutional inquiries.
            </p>
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary px-2 py-0.5 rounded bg-surface-container-high">
                        {c.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary text-[11px]">
                        {c.category}
                      </span>
                      <span className="text-amber-400 font-bold text-[11px]">Priority: {c.priority}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container/40 text-secondary">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-on-surface">{c.subject}</h4>
                  <p className="text-xs text-on-surface-variant bg-surface-container-lowest/60 p-2.5 rounded-lg">
                    {c.description}
                  </p>
                  {c.hodRemarks && (
                    <div className="p-2.5 rounded-lg bg-surface-container-highest/60 text-xs text-secondary flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">comment</span>
                      <div>
                        <strong>Department Action:</strong> {c.hodRemarks}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Official Actions & Hearings */}
        {activeTab === 'hearings' && (
          <div className="p-6 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/20">
            <h3 className="text-base font-bold mb-1">Disciplinary Tribunal &amp; Parent Hearings</h3>
            <p className="text-xs text-on-surface-variant">
              Record of institutional summons, mentor-parent conferencing records, and remediation milestones.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-surface-container flex items-center gap-2.5 text-tertiary border border-tertiary/20">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span className="text-xs">
                No active disciplinary hearings scheduled. Student has clean conduct compliance.
              </span>
            </div>
          </div>
        )}

        {/* Raise Formal Grievance & Recent Grievance Ledger Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-2" id="grievance-panel">
          {/* Form Column */}
          <div className="xl:col-span-7 flex flex-col space-y-3">
            <div className="rounded-xl bg-surface-container p-6 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="space-y-1 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                    <h3 className="text-lg font-bold text-on-surface">Raise Formal Grievance</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px]">
                    Standard Protocol SLA: 48h
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Formal submissions are logged into the regulatory audit ledger and routed to the Department Ombudsman.
                </p>
              </div>

              <form className="space-y-3.5" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">
                      Incident Category
                    </label>
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      value={cat}
                      onChange={(e) => setCat(e.target.value as Complaint['category'])}
                    >
                      <option value="Academic Issues">Academic &amp; Evaluation</option>
                      <option value="Faculty & Teaching">Faculty Grievance</option>
                      <option value="Hostel & Mess">Hostel &amp; Mess Infrastructure</option>
                      <option value="Laboratory & Facilities">Laboratory Hardware &amp; Facilities</option>
                      <option value="Attendance & Exams">Examinations &amp; Hall Clearance</option>
                      <option value="Harassment / Grievance">Anti-Harassment &amp; Equality Cell</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">
                      Urgency Classification
                    </label>
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Complaint['priority'])}
                    >
                      <option value="Low">Low (Standard Redressal)</option>
                      <option value="Medium">Medium (Standard 48h SLA)</option>
                      <option value="High">High (Department Dean Review)</option>
                      <option value="Urgent">Urgent (Immediate Executive Triage)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-semibold">Subject Heading</label>
                  <input
                    className="w-full bg-surface-container-lowest text-on-surface rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    type="text"
                    required
                    placeholder="Enter short description of the issue..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-on-surface-variant font-semibold">
                    Statement of Grievance &amp; Factual Details
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest text-on-surface rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-outline-variant/30"
                    rows={4}
                    required
                    placeholder="Detail the specific marks mismatch, paper inspection notes, or classroom incident..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-lg text-secondary">shield</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-semibold">Submit Anonymously</span>
                      <span className="text-[11px] text-outline">
                        Mask roll number and identity from departmental faculty mentor
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={isAnon}
                      onChange={(e) => setIsAnon(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-surface after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-all cursor-pointer"
                    type="reset"
                    onClick={() => {
                      setSubject('');
                      setDesc('');
                    }}
                  >
                    Clear Form
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-fixed-dim transition-all cursor-pointer"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Submit Grievance</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Grievance Ledger */}
          <div className="xl:col-span-5 flex flex-col space-y-3">
            <div className="rounded-xl bg-surface-container p-6 shadow-xl border border-outline-variant/30 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">history</span>
                    <h3 className="text-base font-bold text-on-surface">Recent Grievance Ledger</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-mono">
                    {complaints.length} Records
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4">
                  Track status, ombudsman assignments, and remediation outcomes.
                </p>

                <div className="space-y-3">
                  {complaints.slice(0, 2).map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-surface-container-low p-4 shadow-md space-y-2 relative overflow-hidden border border-outline-variant/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono font-bold text-[11px]">
                            #{c.id}
                          </span>
                          <span className="text-[11px] text-outline">• {c.date}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                          c.status === 'Resolved'
                            ? 'bg-tertiary-container/30 text-tertiary'
                            : 'bg-secondary-container/40 text-secondary'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.status === 'Resolved' ? 'bg-tertiary' : 'bg-secondary animate-pulse'}`} />
                          {c.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-on-surface">{c.subject}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{c.description}</p>

                      {(c.resolutionNotes || c.hodRemarks) && (
                        <div className="p-2.5 rounded-lg bg-surface-container-highest/60 flex items-start gap-2 mt-2 text-xs">
                          <span className="material-symbols-outlined text-sm text-secondary shrink-0 mt-0.5">
                            comment
                          </span>
                          <div className="flex flex-col text-[11px]">
                            <span className="text-secondary font-semibold">
                              Resolution Note
                            </span>
                            <p className="text-on-surface-variant">
                              {c.hodRemarks || c.resolutionNotes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-container-highest">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between text-xs">
                  <span className="text-outline">Ombudsman Desk Hotline</span>
                  <span className="font-mono text-primary font-bold">Ext: 4402 • ombuds@college.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Audit Banner */}
        <div className="rounded-xl bg-surface-container-lowest p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-outline text-[11px] border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-tertiary">shield_locked</span>
            <span>MentorSphere Cryptographic Redressal Audit Trail active • Node: AP-SOUTH-1</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Session ID: 0x93FA-Sem6-22CS1048</span>
            <button className="text-primary hover:underline font-semibold" type="button">
              Download Form-B Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalView;
