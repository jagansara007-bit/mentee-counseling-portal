import React, { useState } from 'react';
import type { Mentee, CounselingSession } from '../types';
import { useMentorship } from '../context/MentorshipContext';
import { X, Sparkles, Plus, Trash2 } from 'lucide-react';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentee: Mentee | null;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ isOpen, onClose, mentee }) => {
  const { addCounselingSession } = useMentorship();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [counselorName, setCounselorName] = useState<string>('Dr. Ramesh Sundaram');
  const [category, setCategory] = useState<CounselingSession['category']>('Academic');
  const [discussionNotes, setDiscussionNotes] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [actionItems, setActionItems] = useState<{ id: string; text: string; completed: boolean; dueDate?: string }[]>([
    { id: '1', text: '', completed: false, dueDate: '' },
  ]);

  if (!isOpen || !mentee) return null;

  const handleAddActionItem = () => {
    setActionItems([...actionItems, { id: `${Date.now()}`, text: '', completed: false, dueDate: '' }]);
  };

  const handleRemoveActionItem = (id: string) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
  };

  const handleActionTextChange = (id: string, text: string) => {
    setActionItems(actionItems.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionNotes.trim()) return;

    const filteredActions = actionItems
      .filter((a) => a.text.trim().length > 0)
      .map((a) => ({
        ...a,
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      }));

    addCounselingSession(mentee.id, {
      menteeId: mentee.id,
      date,
      counselorName,
      category,
      discussionNotes: discussionNotes.trim(),
      actionItems: filteredActions,
      followUpDate: followUpDate || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-modal w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Counseling Session</h3>
              <p className="text-xs text-slate-400">
                Recording advisory meeting for <span className="text-indigo-300 font-semibold">{mentee.name}</span> ({mentee.rollNo})
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Session Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CounselingSession['category'])}
                className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Academic">Academic Performance & Arrears</option>
                <option value="Attendance">Attendance Shortage</option>
                <option value="Behavioral / Emotional">Behavioral / Emotional Support</option>
                <option value="Career Guidance">Career & Placement Guidance</option>
                <option value="Personal Emergency">Personal / Medical Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Counselor / Mentor In-Charge</label>
            <input
              type="text"
              required
              value={counselorName}
              onChange={(e) => setCounselorName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Discussion Notes & Assessment</label>
            <textarea
              required
              rows={4}
              placeholder="Detail root causes identified, student perspective, emotional state, and mentoring feedback..."
              value={discussionNotes}
              onChange={(e) => setDiscussionNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Items */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Action Items & Deliverables</label>
              <button
                type="button"
                onClick={handleAddActionItem}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Action Item
              </button>
            </div>
            <div className="space-y-2">
              {actionItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Action item #${index + 1}`}
                    value={item.text}
                    onChange={(e) => handleActionTextChange(item.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  {actionItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Next Review / Follow-Up Date (Optional)
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Save Counseling Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
