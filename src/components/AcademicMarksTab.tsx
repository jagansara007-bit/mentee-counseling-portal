import React, { useState } from 'react';
import type { Mentee } from '../types';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

export const AcademicMarksTab: React.FC<{ mentee: Mentee }> = ({ mentee }) => {
  const semesters = mentee.academicHistory;
  const [selectedSemIndex, setSelectedSemIndex] = useState<number>(0);

  if (!semesters || semesters.length === 0) {
    return (
      <div className="p-8 text-center glass-surface rounded-xl">
        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-300 font-medium">No academic internal marks recorded yet.</p>
      </div>
    );
  }

  const currentSem = semesters[selectedSemIndex] || semesters[0];

  const getGradeBadge = (grade: string, isBacklog?: boolean) => {
    if (isBacklog || grade === 'U' || grade === 'RA') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-500/50">
          Arrear ({grade})
        </span>
      );
    }
    if (grade === 'O' || grade === 'A+' || grade === 'A') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
          Pass ({grade})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">
        Average ({grade})
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Semester Picker & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass-surface border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Select Semester:</span>
          <div className="flex items-center gap-1.5">
            {semesters.map((sem, idx) => (
              <button
                key={sem.semester}
                onClick={() => setSelectedSemIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedSemIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Semester {sem.semester}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Semester GPA:</span>
            <span className="font-bold text-white text-sm">{currentSem.sgpa.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400">Academic Term:</span>
            <span className="font-semibold text-slate-200">{currentSem.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Internal Marks Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 glass-surface">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4 text-center">IA-1 (50)</th>
              <th className="py-3 px-4 text-center">IA-2 (50)</th>
              <th className="py-3 px-4 text-center">Model Exam (100)</th>
              <th className="py-3 px-4 text-center">Calculated Internal</th>
              <th className="py-3 px-4 text-right">Status / Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentSem.subjects.map((sub) => {
              const internalWeighted = Math.round(((sub.ia1 + sub.ia2) / 100) * 10 + (sub.modelExam / 100) * 10);
              const isFailing = sub.isBacklog || sub.modelExam < 50;

              return (
                <tr
                  key={sub.subjectCode}
                  className={`hover:bg-slate-900/40 transition-colors ${
                    isFailing ? 'bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{sub.subjectName}</div>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">{sub.subjectCode}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        sub.ia1 < 25 ? 'text-rose-400' : sub.ia1 < 35 ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {sub.ia1}
                    </span>
                    <span className="text-[11px] text-slate-500">/50</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        sub.ia2 < 25 ? 'text-rose-400' : sub.ia2 < 35 ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {sub.ia2}
                    </span>
                    <span className="text-[11px] text-slate-500">/50</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        sub.modelExam < 50
                          ? 'text-rose-400 font-bold'
                          : sub.modelExam < 70
                          ? 'text-amber-400'
                          : 'text-emerald-400 font-bold'
                      }`}
                    >
                      {sub.modelExam}
                    </span>
                    <span className="text-[11px] text-slate-500">/100</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-indigo-300">{internalWeighted}</span>
                    <span className="text-[11px] text-slate-500">/20</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {getGradeBadge(sub.grade, sub.isBacklog)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Assessment Guidelines Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300">
        <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-200">Internal Weightage Model:</span>{' '}
          Internal marks comprise continuous assessment IA1 (25%), IA2 (25%), and Comprehensive Model Exam (50%). Students scoring below 50% in Model Exams are automatically queued for remedial faculty coaching before end-semester university exams.
        </div>
      </div>
    </div>
  );
};
