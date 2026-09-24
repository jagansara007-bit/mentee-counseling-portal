import React, { useState } from 'react';
import type { Mentee, EscalationIntervention } from '../types';
import { useMentorship } from '../context/MentorshipContext';
import { X, ShieldAlert, PhoneCall } from 'lucide-react';

interface NewEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentee: Mentee | null;
}

export const NewEscalationModal: React.FC<NewEscalationModalProps> = ({ isOpen, onClose, mentee }) => {
  const { addEscalation } = useMentorship();

  const [severity, setSeverity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [triggerReason, setTriggerReason] = useState<string>('');
  const [stakeholders, setStakeholders] = useState<string[]>(['Parent']);
  const [contactPerson, setContactPerson] = useState<string>('');
  const [contactChannel, setContactChannel] = useState<'Phone Call' | 'In-Person Meeting' | 'Official Email' | 'Registered Notice'>('Phone Call');
  const [contactResponse, setContactResponse] = useState<string>('');
  const [resolutionTag, setResolutionTag] = useState<EscalationIntervention['resolutionTag']>('Action Pending');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !mentee) return null;

  const toggleStakeholder = (name: string) => {
    if (stakeholders.includes(name)) {
      setStakeholders(stakeholders.filter((s) => s !== name));
    } else {
      setStakeholders([...stakeholders, name]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerReason.trim()) return;

    const contactRecords = contactPerson.trim()
      ? [
          {
            id: `cr-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            channel: contactChannel,
            contactPerson: contactPerson.trim(),
            phoneOrEmail: mentee.parentPhone || mentee.phone,
            responseSummary: contactResponse.trim() || 'Notice logged and transmitted.',
          },
        ]
      : [];

    addEscalation(mentee.id, {
      menteeId: mentee.id,
      date: new Date().toISOString().split('T')[0],
      severity,
      triggerReason: triggerReason.trim(),
      stakeholdersContacted: stakeholders.length > 0 ? stakeholders : ['Mentor'],
      contactRecords,
      resolutionTag,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-modal w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-rose-900/40 flex items-center justify-between bg-rose-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-900/60 text-rose-300 border border-rose-700/60">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Initiate Administrative Escalation</h3>
              <p className="text-xs text-rose-300/80">
                Log critical breach & institutional intervention for{' '}
                <span className="text-white font-semibold">{mentee.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="High">High (Immediate Debarment / Critical)</option>
                <option value="Medium">Medium (Attendance & Arrear Warning)</option>
                <option value="Low">Low (Initial Advisory Flag)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Status</label>
              <select
                value={resolutionTag}
                onChange={(e) =>
                  setResolutionTag(e.target.value as EscalationIntervention['resolutionTag'])
                }
                className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Action Pending">Action Pending</option>
                <option value="Parent Meeting Scheduled">Parent Meeting Scheduled</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Escalated to Dean">Escalated to Dean</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Trigger Reason / Breach Description</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Attendance dropped to 61.5% with 3 active backlogs, debarment notice issued..."
              value={triggerReason}
              onChange={(e) => setTriggerReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Stakeholders */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Stakeholders to Notify
            </label>
            <div className="flex flex-wrap gap-2">
              {['Parent', 'Head of Department', 'Academic Dean', 'Hostel Warden', 'Campus Counselor'].map(
                (stakeholder) => {
                  const isSelected = stakeholders.includes(stakeholder);
                  return (
                    <button
                      key={stakeholder}
                      type="button"
                      onClick={() => toggleStakeholder(stakeholder)}
                      className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/80 text-rose-300 border-rose-600 font-semibold'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {stakeholder}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Primary Contact Record */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2.5">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              Direct Communication Record (Optional)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder={`Contact Person (e.g. ${mentee.parentName})`}
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <select
                value={contactChannel}
                onChange={(e) => setContactChannel(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="Phone Call">Phone Call</option>
                <option value="Official Email">Official Email</option>
                <option value="In-Person Meeting">In-Person Meeting</option>
                <option value="Registered Notice">Registered Notice</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Response summary (e.g. Parent informed, scheduled visit on Monday)"
              value={contactResponse}
              onChange={(e) => setContactResponse(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Intervention Strategy & Notes</label>
            <textarea
              rows={2}
              placeholder="Next steps, remedial clinics, committee review date..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md shadow-rose-600/30 cursor-pointer"
            >
              Submit Escalation Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
