import React from 'react';
import type { Mentee } from '../types';
import { useMentorship } from '../context/MentorshipContext';
import { MessageSquareText, Calendar, CheckSquare, Square, Clock, PlusCircle } from 'lucide-react';

export const CounselingLogsTab: React.FC<{
  mentee: Mentee;
  onOpenNewSession: () => void;
}> = ({ mentee, onOpenNewSession }) => {
  const { toggleActionItem } = useMentorship();
  const sessions = mentee.counselingHistory;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50';
      case 'Attendance': return 'bg-amber-950/70 text-amber-300 border-amber-700/50';
      case 'Behavioral / Emotional': return 'bg-rose-950/70 text-rose-300 border-rose-700/50';
      case 'Career Guidance': return 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Action Header */}
      <div className="flex items-center justify-between p-3.5 rounded-xl glass-surface border border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Formal Counseling Logs</h4>
          <p className="text-xs text-slate-400">
            Chronological record of mentor-mentee counseling meetings, behavioral assessments, and action plans.
          </p>
        </div>

        <button
          onClick={onOpenNewSession}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-xl">
          <MessageSquareText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No counseling sessions recorded yet.</p>
          <p className="text-xs text-slate-500 mt-1">Click "New Session" above to log the first advisory meeting.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="glass-card p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all"
            >
              {/* Session Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                      session.category
                    )}`}
                  >
                    {session.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.timestamp}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  Counselor: <span className="font-semibold text-slate-300">{session.counselorName}</span>
                </div>
              </div>

              {/* Discussion Notes */}
              <div className="my-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Discussion Notes & Observations
                </p>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  {session.discussionNotes}
                </p>
              </div>

              {/* Action Items List */}
              {session.actionItems && session.actionItems.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Action Items & Commitments ({session.actionItems.filter((a) => a.completed).length}/
                    {session.actionItems.length} completed)
                  </p>
                  <div className="space-y-1.5">
                    {session.actionItems.map((action) => (
                      <div
                        key={action.id}
                        onClick={() => toggleActionItem(mentee.id, session.id, action.id)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          action.completed
                            ? 'bg-slate-900/30 text-slate-400'
                            : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {action.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 text-xs">
                          <span className={action.completed ? 'line-through text-slate-500' : 'font-medium'}>
                            {action.text}
                          </span>
                          {action.dueDate && (
                            <span className="ml-2 text-[11px] text-indigo-400/80 font-mono">
                              Due: {action.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Note */}
              {session.followUpDate && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-xs text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Scheduled Next Follow-Up Review: <strong className="text-white">{session.followUpDate}</strong>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
