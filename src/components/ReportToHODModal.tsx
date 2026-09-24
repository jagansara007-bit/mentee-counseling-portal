import React, { useState, useEffect } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { Mentee, UnderperformanceReport } from '../types';
import {
  ShieldAlert,
  X,
  Building,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';

interface ReportToHODModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Mentee;
  reporterName?: string;
  reporterRole?: string;
}

const COMMON_REASONS = [
  'Critical Attendance Shortage (<65% - Severe Debarment Threat)',
  'Attendance Defaulter (Between 65% - 74.9%)',
  'Multiple Active Arrears (2+ Uncleared Subjects)',
  'Failed Internal Assessments (IA-1 / IA-2)',
  'Chronic Morning Lecture Absenteeism',
  'Disciplinary Concern / Refusal to Attend Remedial Classes',
  'Low CGPA (< 6.0 Remedial Watchlist)',
];

const RECOMMENDED_ACTIONS = [
  'Summon Parents for Official HOD Hearing & Parent-Teacher Meeting',
  'Issue Formal HOD Warning Letter with University Debarment Notice',
  'Enforce Mandatory Remedial Coaching with Course Instructors',
  'Direct HOD Departmental Inquiry & Academic Undertaking',
  'Refer to Dean of Student Affairs & Academic Welfare Committee',
];

export const ReportToHODModal: React.FC<ReportToHODModalProps> = ({
  isOpen,
  onClose,
  student,
  reporterName = 'Dr. Ramesh Sundaram',
  reporterRole = 'Faculty Mentor & Class Advisor',
}) => {
  const { reportUnderperformanceToHOD } = useMentorship();

  const [severity, setSeverity] = useState<UnderperformanceReport['severity']>(
    student.attendance < 65 || student.backlogs >= 3 ? 'Critical' : 'Severe'
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [staffRemarks, setStaffRemarks] = useState('');
  const [recommendedAction, setRecommendedAction] = useState(RECOMMENDED_ACTIONS[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-suggest reasons on student load
  useEffect(() => {
    const suggested: string[] = [];
    if (student.attendance < 65) {
      suggested.push('Critical Attendance Shortage (<65% - Severe Debarment Threat)');
    } else if (student.attendance < 75) {
      suggested.push('Attendance Defaulter (Between 65% - 74.9%)');
    }
    if (student.backlogs > 0) {
      suggested.push('Multiple Active Arrears (2+ Uncleared Subjects)');
    }
    if (student.cgpa < 6.0) {
      suggested.push('Low CGPA (< 6.0 Remedial Watchlist)');
    }
    setSelectedReasons(suggested.length > 0 ? suggested : [COMMON_REASONS[0]]);
  }, [student]);

  if (!isOpen) return null;

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReasons.length === 0 || !staffRemarks.trim()) return;

    reportUnderperformanceToHOD({
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      department: student.department,
      reportedBy: reporterName,
      staffRole: reporterRole,
      severity,
      metrics: {
        attendance: student.attendance,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
      },
      reasons: selectedReasons,
      staffRemarks: staffRemarks.trim(),
      recommendedAction,
    });

    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setStaffRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-rose-900/60 shadow-2xl overflow-hidden bg-slate-900/95 text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-900/40 bg-rose-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-700/60 shadow-md shadow-rose-950/50">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Report Student Underperformance to HOD
              </h3>
              <p className="text-xs text-rose-300/80">
                Official Department Escalation for Immediate Executive Administrative Intervention
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  Student Successfully Escalated to HOD Module
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  The case file for <strong className="text-white">{student.name} ({student.rollNo})</strong>{' '}
                  has been added to the HOD Executive Dashboard for review, hearing summons, and notice issuance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-200">{student.name} ({student.rollNo})</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Escalation Severity:</span>
                  <span className="font-bold text-rose-400">{severity}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Recommended HOD Action:</span>
                  <span className="font-semibold text-indigo-300">{recommendedAction}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Status in HOD Module:</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-bold">
                    Pending HOD Review
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full max-w-md mx-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Underperformance Snapshot */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{student.name}</span>
                      <span className="text-xs font-mono text-indigo-400">({student.rollNo})</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Sem {student.semester} • Section {student.section} • {student.department}
                    </p>
                  </div>
                </div>

                {/* Vital Statistics Pills */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className={`px-2.5 py-1 rounded-lg border ${
                    student.attendance < 65
                      ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                      : student.attendance < 75
                      ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  }`}>
                    <span className="font-sans text-[10px] text-slate-400 block">Attendance</span>
                    <strong className="text-sm">{student.attendance}%</strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <span className="font-sans text-[10px] text-slate-400 block">CGPA</span>
                    <strong className="text-sm">{student.cgpa.toFixed(2)}</strong>
                  </div>

                  <div className={`px-2.5 py-1 rounded-lg border ${
                    student.backlogs > 0
                      ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <span className="font-sans text-[10px] text-slate-400 block">Arrears</span>
                    <strong className="text-sm">{student.backlogs}</strong>
                  </div>
                </div>
              </div>

              {/* Severity Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Escalation Severity Level *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Critical', 'Severe', 'Moderate'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        severity === lvl
                          ? lvl === 'Critical'
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40'
                            : lvl === 'Severe'
                            ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/40'
                            : 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {lvl === 'Critical' && <Flame className="w-3.5 h-3.5" />}
                      {lvl === 'Severe' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {lvl === 'Moderate' && <FileWarning className="w-3.5 h-3.5" />}
                      <span>{lvl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reasons Multi-select Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Underperformance Triggers & Violation Reasons * (Select all applicable)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  {COMMON_REASONS.map((reason) => {
                    const isChecked = selectedReasons.includes(reason);
                    return (
                      <label
                        key={reason}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? 'bg-rose-950/50 text-rose-200 border border-rose-900/50'
                            : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleReason(reason)}
                          className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                        />
                        <span>{reason}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Faculty Observations / Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Faculty Mentor Observations & Field Remarks *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the student's pattern of absence, failed interventions, parental communication history, or unresponsiveness..."
                  value={staffRemarks}
                  onChange={(e) => setStaffRemarks(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {/* Recommended HOD Action */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Recommended Action for HOD / Academic Dean *
                </label>
                <select
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {RECOMMENDED_ACTIONS.map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedReasons.length === 0 || !staffRemarks.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Transmit to HOD Module</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportToHODModal;
