// Vercel Serverless Function: /api/complaints
const defaultComplaints = [
  {
    id: 'GRV-2026-041',
    studentId: 'mentee-1',
    studentName: 'Aarav S. Nair',
    rollNo: '22CS1014',
    department: 'CSE & AI',
    category: 'Academic Issues',
    subject: 'Discrepancy in Model Exam Lab Internal Evaluation',
    description: 'Marks logged in cloud assessment tool do not match physical verified observation rubric signed by lab in-charge.',
    priority: 'High',
    isAnonymous: false,
    date: '2026-09-18',
    timestamp: '11:42 AM',
    status: 'In Progress',
    hodRemarks: 'Executive review scheduled with lab in-charge.'
  },
  {
    id: 'GRV-2026-042',
    studentId: 'mentee-4',
    studentName: 'Priya Dharshini K',
    rollNo: '22CS1088',
    department: 'CSE & AI',
    category: 'Hostel & Mess',
    subject: 'Library WiFi connectivity and hostel study room lighting',
    description: 'Frequent network drops during evening study hours in Block C reading hall.',
    priority: 'Medium',
    isAnonymous: true,
    date: '2026-09-17',
    timestamp: '04:15 PM',
    status: 'Submitted'
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: defaultComplaints.length,
      complaints: defaultComplaints
    });
  }

  if (req.method === 'POST') {
    const { studentName, rollNo, subject, description, category, priority } = req.body || {};
    
    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        error: 'Subject and description are mandatory fields.'
      });
    }

    const newTicket = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName: studentName || 'Confidential Student',
      rollNo: rollNo || 'ANONYMOUS',
      department: 'CSE & AI',
      category: category || 'General',
      subject,
      description,
      priority: priority || 'Medium',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted'
    };

    return res.status(201).json({
      success: true,
      message: 'Complaint successfully registered with Student Grievance Tribunal & HOD Console',
      complaint: newTicket
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
