import React, { useState } from 'react';
import { useMentorship } from '../context/MentorshipContext';
import type { Mentee, Complaint } from '../types';
import {
  AlertCircle,
  X,
  Send,
  Shield,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface RaiseComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent?: Mentee | null;
}

const CATEGORIES: Complaint['category'][] = [
  'Academic Issues',
  'Faculty & Teaching',
  'Hostel & Mess',
  'Laboratory & Facilities',
  'Attendance & Exams',
  'Harassment / Grievance',
  'General',
];

export const RaiseComplaintModal: React.FC<RaiseComplaintModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
}) => {
  const { mentees, raiseComplaint } = useMentorship();

  const selectedStudentId = currentStudent ? currentStudent.id : mentees[0]?.id || '';
  const [category, setCategory] = useState<Complaint['category']>('Academic Issues');
  const [priority, setPriority] = useState<Complaint['priority']>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<Complaint | null>(null);

  if (!isOpen) return null;

  const activeStudent =
    currentStudent || mentees.find((m) => m.id === selectedStudentId) || mentees[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = raiseComplaint({
      studentId: activeStudent.id,
      studentName: isAnonymous ? 'Confidential Student' : activeStudent.name,
      rollNo: isAnonymous ? 'ANONYMOUS' : activeStudent.rollNo,
      department: activeStudent.department,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      isAnonymous,
    });

    setSubmittedTicket(newTicket);
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setSubject('');
    setDescription('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-card rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-900/95 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Raise Grievance / Complaint
              </h3>
              <p className="text-xs text-slate-400">
                Direct submission to Student Grievance Cell, Faculty Advisor & HOD
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {submittedTicket ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Complaint Registered Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your grievance has been logged and routed to the Department Head and Mentorship Board.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Ticket Reference ID:</span>
                  <span className="font-mono font-bold text-indigo-300">{submittedTicket.id}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-200">{submittedTicket.category}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-semibold text-amber-400">{submittedTicket.priority}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                    Submitted & Queued
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full max-w-md mx-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Identification Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeStudent.avatar}
                    alt={activeStudent.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{activeStudent.name}</p>
                    <p className="text-[11px] font-mono text-indigo-400">
                      {activeStudent.rollNo} • Sem {activeStudent.semester} ({activeStudent.section})
                    </p>
                  </div>
                </div>

                {isAnonymous && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700/60">
                    <Lock className="w-3 h-3" /> Anonymous Mode
                  </span>
                )}
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Grievance Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Urgency / Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Complaint['priority'])}
                    className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low - Normal Consideration</option>
                    <option value="Medium">Medium - Standard Priority</option>
                    <option value="High">High - Urgent Academic Friction</option>
                    <option value="Urgent">Urgent - Immediate HOD Action</option>
                  </select>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Complaint Subject / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in Model Exam Marks, Lab System Issue, Hostel Wi-Fi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise details, dates, affected course/faculty, or facility location to ensure swift resolution..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Keep Identity Confidential</p>
                    <p className="text-[11px] text-slate-500">
                      Hides your name & roll number from public logs (viewable only by Grievance Redressal Committee).
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {/* Action Buttons */}
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
                  disabled={!subject.trim() || !description.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Complaint</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaintModal;
