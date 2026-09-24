import React, { useState } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { Complaint } from '../types';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Filter,
  Plus,
  Lock,
  Building,
} from 'lucide-react';

interface ComplaintsTabProps {
  studentId?: string; // If provided, shows only this student's complaints
  onOpenRaiseModal: () => void;
  canRaise?: boolean;
}

export const ComplaintsTab: React.FC<ComplaintsTabProps> = ({
  studentId,
  onOpenRaiseModal,
  canRaise = true,
}) => {
  const { complaints } = useMentorship();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredComplaints = complaints.filter((c) => {
    const matchesStudent = !studentId || c.studentId === studentId;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesStudent && matchesStatus;
  });

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
            <Clock className="w-3 h-3 text-cyan-400" />
            Submitted
          </span>
        );
      case 'Under Faculty Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/60">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Under Mentor Review
          </span>
        );
      case 'Forwarded to HOD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/60 shadow-sm shadow-purple-950/40 animate-pulse">
            <Building className="w-3 h-3 text-purple-400" />
            Forwarded to HOD
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60">
            <MessageSquare className="w-3 h-3 text-indigo-400" />
            Action In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Resolved
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-700/60 text-[10px] font-bold uppercase tracking-wider">
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700/60 text-[10px] font-bold uppercase tracking-wider">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-[10px] font-medium">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Registered Complaints & Grievance Redressal</span>
            <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              {filteredComplaints.length} Total
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent tracking of student grievances with official faculty & HOD response logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter:
            </span>
            {['All', 'Submitted', 'Forwarded to HOD', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Raise Complaint Action Button */}
          {canRaise && (
            <button
              onClick={onOpenRaiseModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Complaint</span>
            </button>
          )}
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length > 0 ? (
        <div className="space-y-3.5">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="glass-card p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700/80 transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800/50 text-indigo-300 font-mono text-xs font-bold">
                    {complaint.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                    {complaint.category}
                  </span>
                  {getPriorityBadge(complaint.priority)}
                  {complaint.isAnonymous && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50 font-medium">
                      <Lock className="w-3 h-3" /> Anonymous
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{complaint.date}</span>
                    <span>•</span>
                    <span>{complaint.timestamp}</span>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              {/* Subject & Description */}
              <div>
                <h5 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  {complaint.subject}
                </h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                  {complaint.description}
                </p>
              </div>

              {/* Student identity footer (if not anonymous or viewed by admin) */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>
                  Submitted by:{' '}
                  <strong className="text-slate-200">
                    {complaint.studentName}
                  </strong>{' '}
                  ({complaint.rollNo})
                </span>
                <span>Dept: {complaint.department}</span>
              </div>

              {/* HOD / Faculty Official Action Remarks Box */}
              {(complaint.resolutionNotes || complaint.hodRemarks) && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>Department & HOD Official Response:</span>
                  </div>
                  {complaint.hodRemarks && (
                    <p className="text-slate-300 pl-5">
                      <strong className="text-purple-300">HOD Remark:</strong> {complaint.hodRemarks}
                    </p>
                  )}
                  {complaint.resolutionNotes && (
                    <p className="text-slate-400 pl-5">
                      <strong className="text-slate-300">Action Status:</strong> {complaint.resolutionNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-2xl glass-card text-center text-slate-400 border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-semibold text-slate-200">No Complaints Logged</p>
          <p className="text-xs text-slate-500 mt-1">
            {filterStatus !== 'All'
              ? `No complaints match the "${filterStatus}" status filter.`
              : 'There are currently no active grievances submitted.'}
          </p>
          {canRaise && (
            <button
              onClick={onOpenRaiseModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Raise First Complaint</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintsTab;
