export type RiskLevel = 'Critical' | 'Moderate' | 'Normal' | 'High' | 'Medium' | 'Low';

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  ia1: number; // Internal Assessment 1 (out of 50 or 100)
  ia2: number; // Internal Assessment 2
  modelExam: number; // Model exam (out of 100)
  maxMarks: number;
  grade: string;
  isBacklog?: boolean;
}

export interface SemesterAcademicHistory {
  semester: number;
  academicYear: string;
  sgpa: number;
  subjects: SubjectMark[];
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface AdvisorySession {
  id: string;
  menteeId: string;
  date: string;
  timestamp: string;
  facultyName?: string;
  counselorName?: string;
  category: 'Academic' | 'Attendance' | 'Behavioral / Emotional' | 'Behavioral / Conduct' | 'Career Guidance' | 'Personal Emergency';
  discussionNotes: string;
  actionItems: ActionItem[];
  followUpDate?: string;
}

export type CounselingSession = AdvisorySession;

export interface ContactRecord {
  id: string;
  date: string;
  channel: 'Phone Call' | 'In-Person Meeting' | 'Official Email' | 'Registered Notice';
  contactPerson: string;
  phoneOrEmail: string;
  responseSummary: string;
}

export interface EscalationIntervention {
  id: string;
  menteeId: string;
  date: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
  triggerReason: string;
  stakeholdersContacted: string[];
  contactRecords: ContactRecord[];
  resolutionTag: 'Resolved' | 'Under Observation' | 'Action Pending' | 'Escalated to Dean' | 'Parent Meeting Scheduled';
  notes: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  category: 'Academic Issues' | 'Faculty & Teaching' | 'Hostel & Mess' | 'Laboratory & Facilities' | 'Attendance & Exams' | 'Harassment / Grievance' | 'General';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  isAnonymous: boolean;
  date: string;
  timestamp: string;
  status: 'Submitted' | 'Under Faculty Review' | 'Forwarded to HOD' | 'In Progress' | 'Resolved';
  resolutionNotes?: string;
  hodRemarks?: string;
}

export interface UnderperformanceReport {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  reportedBy: string; // Faculty / Mentor name
  staffRole: string;
  date: string;
  timestamp: string;
  severity: 'Critical' | 'Severe' | 'Moderate';
  metrics: {
    attendance: number;
    cgpa: number;
    backlogs: number;
  };
  reasons: string[];
  staffRemarks: string;
  recommendedAction: string;
  hodStatus: 'Pending HOD Review' | 'Notice Issued' | 'Parent Hearing Summoned' | 'Remedial Action Assigned' | 'Resolved' | 'Hearing Scheduled' | 'Action Taken';
  hodActionNotes?: string;
  actionTakenDate?: string;
  // Convenience aliases for flexible UI rendering
  attendance?: number;
  cgpa?: number;
  arrearsCount?: number;
  status?: string;
  mentorNotes?: string;
  facultyName?: string;
  createdAt?: string;
  priority?: string;
}

export interface Mentee {
  id: string;
  name: string;
  rollNo: string;
  batch: string;
  semester: number;
  department: string;
  section: string;
  cgpa: number;
  attendance: number; // in percentage, e.g. 64.2
  riskLevel: RiskLevel;
  backlogs: number;
  arrearsCount?: number;
  internalMarksSummary?: string;
  lastCounselingDate: string;
  lastAdvisoryDate?: string;
  mentorName: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  avatar: string;
  underperformanceFlagged?: boolean;
  academicHistory: SemesterAcademicHistory[];
  counselingHistory: AdvisorySession[];
  escalationHistory: EscalationIntervention[];
  advisoryHistory?: AdvisorySession[];
}
