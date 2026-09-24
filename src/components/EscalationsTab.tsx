import React from 'react';
import type { Mentee, EscalationIntervention } from '../types';
import { useMentorship } from '../context/MentorshipContext';
import { ShieldAlert, PhoneCall, Mail, Users, FileText, CheckCircle2, ChevronDown } from 'lucide-react';

export const EscalationsTab: React.FC<{
  mentee: Mentee;
  onOpenNewEscalation: () => void;
}> = ({ mentee, onOpenNewEscalation }) => {
  const { updateResolutionTag } = useMentorship();
  const escalations = mentee.escalationHistory;

  const resolutionOptions: EscalationIntervention['resolutionTag'][] = [
    'Action Pending',
    'Under Observation',
    'Parent Meeting Scheduled',
    'Escalated to Dean',
    'Resolved',
  ];

  const getSeverityBadge = (sev: 'High' | 'Medium' | 'Low') => {
    switch (sev) {
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-600/60">High Severity</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60">Medium Severity</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">Low Severity</span>;
    }
  };

  const getResolutionTagStyle = (tag: EscalationIntervention['resolutionTag']) => {
    switch (tag) {
      case 'Resolved': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'Under Observation': return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'Action Pending': return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Escalated to Dean': return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'Parent Meeting Scheduled': return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Phone Call': return <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Official Email': return <Mail className="w-3.5 h-3.5 text-cyan-400" />;
      case 'In-Person Meeting': return <Users className="w-3.5 h-3.5 text-amber-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 rounded-xl glass-surface border border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Official Escalations & Interventions</h4>
          <p className="text-xs text-slate-400">
            Log of parental notices, administrative debarment warnings, and coordinated institutional interventions.
          </p>
        </div>

        <button
          onClick={onOpenNewEscalation}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/70 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>New Escalation</span>
        </button>
      </div>

      {escalations.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-xl border-emerald-900/30">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-slate-200 font-semibold">No active escalations recorded for this student.</p>
          <p className="text-xs text-slate-400 mt-1">
            Student is maintaining required thresholds. If attendance or conduct triggers occur, use "New Escalation" to record.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {escalations.map((esc) => (
            <div
              key={esc.id}
              className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
            >
              {/* Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  {getSeverityBadge(esc.severity)}
                  <span className="text-xs text-slate-400 font-mono">
                    {esc.date} • {esc.timestamp}
                  </span>
                </div>

                {/* Interactive Resolution Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <div className="relative inline-block">
                    <select
                      value={esc.resolutionTag}
                      onChange={(e) =>
                        updateResolutionTag(
                          mentee.id,
                          esc.id,
                          e.target.value as EscalationIntervention['resolutionTag']
                        )
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${getResolutionTagStyle(
                        esc.resolutionTag
                      )}`}
                    >
                      {resolutionOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Trigger Reason */}
              <div className="my-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400/90 mb-1">
                  Trigger Event & Breach Details
                </p>
                <p className="text-sm font-medium text-slate-200 bg-rose-950/20 border border-rose-900/30 p-3 rounded-lg">
                  {esc.triggerReason}
                </p>
              </div>

              {/* Stakeholders Contacted */}
              <div className="mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Stakeholders Notified:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {esc.stakeholdersContacted.map((stakeholder, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-950/80 text-slate-300 border border-slate-800"
                    >
                      {stakeholder}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Records Timeline */}
              {esc.contactRecords && esc.contactRecords.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Direct Contact Records ({esc.contactRecords.length})
                  </p>
                  <div className="space-y-2">
                    {esc.contactRecords.map((cr) => (
                      <div
                        key={cr.id}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            {getChannelIcon(cr.channel)}
                            <span className="font-semibold text-slate-200">{cr.contactPerson}</span>
                            <span className="text-slate-500 font-mono">({cr.phoneOrEmail})</span>
                          </div>
                          <p className="text-slate-300 mt-1 pl-5 text-[11px] leading-relaxed">
                            {cr.responseSummary}
                          </p>
                        </div>
                        <span className="text-slate-400 font-mono shrink-0 pl-5 sm:pl-0">{cr.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {esc.notes && (
                <div className="mt-3 pt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Action Plan / Notes:</span> {esc.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
