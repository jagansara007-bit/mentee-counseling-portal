import React from 'react';
import { Search, Filter, Users, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useMentorship } from '../context/MentorshipContext';
import { MenteeCard } from './MenteeCard';

export const MenteeList: React.FC = () => {
  const {
    filteredMentees,
    selectedMenteeId,
    setSelectedMenteeId,
    filterRisk,
    setFilterRisk,
    searchQuery,
    setSearchQuery,
  } = useMentorship();

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters Header */}
      <div className="glass-surface p-4 rounded-xl mb-4 border border-slate-800/80">
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            Filter:
          </span>

          <button
            onClick={() => setFilterRisk('All')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filterRisk === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilterRisk('Critical')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              filterRisk === 'Critical'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 border border-rose-900/40'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Critical
          </button>

          <button
            onClick={() => setFilterRisk('Moderate')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              filterRisk === 'Moderate'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 border border-amber-900/40'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Moderate
          </button>

          <button
            onClick={() => setFilterRisk('Normal')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              filterRisk === 'Normal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-900/40'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Normal
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {filteredMentees.length > 0 ? (
          filteredMentees.map((mentee) => (
            <MenteeCard
              key={mentee.id}
              mentee={mentee}
              isSelected={selectedMenteeId === mentee.id}
              onSelect={() => setSelectedMenteeId(mentee.id)}
            />
          ))
        ) : (
          <div className="glass-card p-8 rounded-xl text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No mentees match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or keywords</p>
            <button
              onClick={() => {
                setFilterRisk('All');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-800/60 rounded-lg hover:bg-indigo-900/40"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
