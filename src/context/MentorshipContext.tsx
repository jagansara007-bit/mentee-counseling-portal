import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Mentee, RiskLevel, CounselingSession, EscalationIntervention, Complaint, UnderperformanceReport } from '../types';
import { initialMentees, initialComplaints, initialUnderperformanceReports } from '../data/mockData';

interface MentorshipContextType {
  mentees: Mentee[];
  selectedMenteeId: string | null;
  selectedMentee: Mentee | null;
  filterRisk: 'All' | RiskLevel;
  searchQuery: string;
  filteredMentees: Mentee[];
  complaints: Complaint[];
  underperformanceReports: UnderperformanceReport[];
  underperformingStudents: Mentee[];
  setSelectedMenteeId: (id: string | null) => void;
  setFilterRisk: (risk: 'All' | RiskLevel) => void;
  setSearchQuery: (query: string) => void;
  raiseComplaint: (complaintData: Omit<Complaint, 'id' | 'date' | 'timestamp' | 'status'>) => Complaint;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], hodRemarks?: string) => void;
  reportUnderperformanceToHOD: (reportData: Omit<UnderperformanceReport, 'id' | 'date' | 'timestamp' | 'hodStatus'>) => UnderperformanceReport;
  updateHODAction: (reportId: string, hodStatus: UnderperformanceReport['hodStatus'], notes?: string) => void;
  addCounselingSession: (menteeId: string, sessionData: Omit<CounselingSession, 'id' | 'timestamp'>) => void;
  toggleActionItem: (menteeId: string, sessionId: string, actionId: string) => void;
  addEscalation: (menteeId: string, escalationData: Omit<EscalationIntervention, 'id' | 'timestamp'>) => void;
  updateResolutionTag: (menteeId: string, escalationId: string, tag: EscalationIntervention['resolutionTag']) => void;
  stats: {
    total: number;
    critical: number;
    moderate: number;
    normal: number;
    avgAttendance: number;
    avgCgpa: number;
    activeEscalations: number;
    underperformingCount: number;
    reportedToHODCount: number;
    pendingComplaintsCount: number;
  };
}

const MentorshipContext = createContext<MentorshipContextType | undefined>(undefined);

export const MentorshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mentees, setMentees] = useState<Mentee[]>(initialMentees);
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(initialMentees[0].id);
  const [filterRisk, setFilterRisk] = useState<'All' | RiskLevel>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [underperformanceReports, setUnderperformanceReports] = useState<UnderperformanceReport[]>(initialUnderperformanceReports);

  const selectedMentee = useMemo(() => {
    return mentees.find((m) => m.id === selectedMenteeId) || null;
  }, [mentees, selectedMenteeId]);

  const filteredMentees = useMemo(() => {
    return mentees.filter((m) => {
      const matchesRisk = filterRisk === 'All' || m.riskLevel === filterRisk;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.rollNo.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      return matchesRisk && matchesSearch;
    });
  }, [mentees, filterRisk, searchQuery]);

  // Underperforming students: Attendance < 75% OR CGPA < 6.5 OR backlogs > 0 OR Critical Risk
  const underperformingStudents = useMemo(() => {
    return mentees.filter(
      (m) => m.attendance < 75 || m.cgpa < 6.5 || m.backlogs > 0 || m.riskLevel === 'Critical'
    );
  }, [mentees]);

  const stats = useMemo(() => {
    const total = mentees.length;
    const critical = mentees.filter((m) => m.riskLevel === 'Critical').length;
    const moderate = mentees.filter((m) => m.riskLevel === 'Moderate').length;
    const normal = mentees.filter((m) => m.riskLevel === 'Normal').length;
    const avgAttendance = total > 0 ? Number((mentees.reduce((acc, m) => acc + m.attendance, 0) / total).toFixed(1)) : 0;
    const avgCgpa = total > 0 ? Number((mentees.reduce((acc, m) => acc + m.cgpa, 0) / total).toFixed(2)) : 0;
    const activeEscalations = mentees.reduce((acc, m) => {
      const active = m.escalationHistory.filter((e) => e.resolutionTag !== 'Resolved').length;
      return acc + active;
    }, 0);
    const underperformingCount = underperformingStudents.length;
    const reportedToHODCount = underperformanceReports.filter((r) => r.hodStatus !== 'Resolved').length;
    const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

    return {
      total,
      critical,
      moderate,
      normal,
      avgAttendance,
      avgCgpa,
      activeEscalations,
      underperformingCount,
      reportedToHODCount,
      pendingComplaintsCount,
    };
  }, [mentees, underperformingStudents, underperformanceReports, complaints]);

  // Raise Complaint by student
  const raiseComplaint = (complaintData: Omit<Complaint, 'id' | 'date' | 'timestamp' | 'status'>): Complaint => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const newComplaint: Complaint = {
      ...complaintData,
      id: `GRV-${now.getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
      date: dateStr,
      timestamp: timeStr,
      status: 'Submitted',
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  // Update complaint status (e.g. by HOD or Faculty)
  const updateComplaintStatus = (complaintId: string, status: Complaint['status'], hodRemarks?: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status,
          ...(hodRemarks ? { hodRemarks } : {}),
        };
      })
    );
  };

  // Staff reports underperforming student to HOD module
  const reportUnderperformanceToHOD = (
    reportData: Omit<UnderperformanceReport, 'id' | 'date' | 'timestamp' | 'hodStatus'>
  ): UnderperformanceReport => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const newReport: UnderperformanceReport = {
      ...reportData,
      id: `HOD-REP-${String(Math.floor(100 + Math.random() * 900))}`,
      date: dateStr,
      timestamp: timeStr,
      hodStatus: 'Pending HOD Review',
    };

    setUnderperformanceReports((prev) => [newReport, ...prev]);

    // Also mark mentee as flagged for underperformance
    setMentees((prev) =>
      prev.map((m) => {
        if (m.id !== reportData.studentId) return m;
        return {
          ...m,
          underperformanceFlagged: true,
        };
      })
    );

    return newReport;
  };

  // HOD takes action on underperformance report
  const updateHODAction = (
    reportId: string,
    hodStatus: UnderperformanceReport['hodStatus'],
    notes?: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    setUnderperformanceReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          hodStatus,
          ...(notes ? { hodActionNotes: notes } : {}),
          actionTakenDate: dateStr,
        };
      })
    );
  };

  const addCounselingSession = (
    menteeId: string,
    sessionData: Omit<CounselingSession, 'id' | 'timestamp'>
  ) => {
    const now = new Date();
    const newSession: CounselingSession = {
      ...sessionData,
      id: `c-${Date.now()}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setMentees((prev) =>
      prev.map((m) => {
        if (m.id !== menteeId) return m;
        return {
          ...m,
          lastCounselingDate: sessionData.date,
          counselingHistory: [newSession, ...(m.counselingHistory || [])],
        };
      })
    );
  };

  const toggleActionItem = (menteeId: string, sessionId: string, actionId: string) => {
    setMentees((prev) =>
      prev.map((m) => {
        if (m.id !== menteeId) return m;
        return {
          ...m,
          counselingHistory: (m.counselingHistory || []).map((s) => {
            if (s.id !== sessionId) return s;
            return {
              ...s,
              actionItems: s.actionItems.map((a) =>
                a.id === actionId ? { ...a, completed: !a.completed } : a
              ),
            };
          }),
        };
      })
    );
  };

  const addEscalation = (
    menteeId: string,
    escalationData: Omit<EscalationIntervention, 'id' | 'timestamp'>
  ) => {
    const now = new Date();
    const newEscalation: EscalationIntervention = {
      ...escalationData,
      id: `esc-${Date.now()}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setMentees((prev) =>
      prev.map((m) => {
        if (m.id !== menteeId) return m;
        return {
          ...m,
          escalationHistory: [newEscalation, ...m.escalationHistory],
        };
      })
    );
  };

  const updateResolutionTag = (
    menteeId: string,
    escalationId: string,
    tag: EscalationIntervention['resolutionTag']
  ) => {
    setMentees((prev) =>
      prev.map((m) => {
        if (m.id !== menteeId) return m;
        return {
          ...m,
          escalationHistory: m.escalationHistory.map((e) =>
            e.id === escalationId ? { ...e, resolutionTag: tag } : e
          ),
        };
      })
    );
  };

  return (
    <MentorshipContext.Provider
      value={{
        mentees,
        selectedMenteeId,
        selectedMentee,
        filterRisk,
        searchQuery,
        filteredMentees,
        complaints,
        underperformanceReports,
        underperformingStudents,
        setSelectedMenteeId,
        setFilterRisk,
        setSearchQuery,
        raiseComplaint,
        updateComplaintStatus,
        reportUnderperformanceToHOD,
        updateHODAction,
        addCounselingSession,
        toggleActionItem,
        addEscalation,
        updateResolutionTag,
        stats,
      }}
    >
      {children}
    </MentorshipContext.Provider>
  );
};

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error('useMentorship must be used within a MentorshipProvider');
  }
  return context;
};
