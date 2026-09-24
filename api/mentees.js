// Vercel Serverless Function: /api/mentees
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sampleMentees = [
    {
      id: 'mentee-1',
      name: 'Aarav S. Nair',
      rollNo: '22CS1014',
      department: 'CSE & AI',
      semester: 6,
      cgpa: 6.8,
      attendance: 62.5,
      backlogs: 2,
      riskLevel: 'High',
      mentorName: 'Dr. Anita Roy',
      status: 'Debarment Risk'
    },
    {
      id: 'mentee-2',
      name: 'Sneha R. Murugan',
      rollNo: '22CS1045',
      department: 'CSE & AI',
      semester: 6,
      cgpa: 8.9,
      attendance: 88.0,
      backlogs: 0,
      riskLevel: 'Low',
      mentorName: 'Dr. K. Ramachandran',
      status: 'Good Standing'
    },
    {
      id: 'mentee-3',
      name: 'Karthik V. Pillai',
      rollNo: '22CS1062',
      department: 'CSE & AI',
      semester: 6,
      cgpa: 5.9,
      attendance: 71.0,
      backlogs: 3,
      riskLevel: 'Critical',
      mentorName: 'Prof. S. Natarajan',
      status: 'Remedial Cohort Required'
    }
  ];

  return res.status(200).json({
    success: true,
    totalCount: sampleMentees.length,
    debarmentAlertCount: sampleMentees.filter(m => m.attendance < 65).length,
    mentees: sampleMentees
  });
}
