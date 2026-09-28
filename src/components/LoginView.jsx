import React, { useState } from 'react';
import { AuthGateway } from './auth/AuthGateway';
import { StudentLogin } from './auth/StudentLogin';
import { MentorLogin } from './auth/MentorLogin';
import { HODLogin } from './auth/HODLogin';

const DEFAULT_PRESETS = {
  Student: {
    role: 'Student',
    email: '22ai104.jagan@college.edu',
    name: 'Aarav Sharma',
    roleTitle: 'Undergraduate Student (22CS104)',
    department: 'Cyber Security',
    rollNo: '22CS104',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  Mentor: {
    role: 'Mentor',
    email: 'mentor.dr.sharma@college.edu',
    name: 'Dr. Ramesh Sundaram',
    roleTitle: 'Senior Faculty Mentor',
    department: 'Cyber Security',
    staffId: 'FAC-CYS-409',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  'Admin/HOD': {
    role: 'Admin/HOD',
    email: 'hod.cys@college.edu',
    name: 'Dr. K. Ramachandran',
    roleTitle: 'Head of Department & Academic Dean',
    department: 'Cyber Security',
    executiveId: 'HOD-CYS-EXEC-01',
    clearanceLevel: 'Level 4 (Institutional Executive)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
};

export const LoginView = ({ onLoginSuccess, initialView = 'gateway' }) => {
  // Current view: 'gateway' | 'Student' | 'Mentor' | 'Admin/HOD'
  const [currentView, setCurrentView] = useState(initialView);

  const handleSelectRole = (role) => {
    setCurrentView(role);
  };

  const handleBackToGateway = () => {
    setCurrentView('gateway');
  };

  const handleQuickLogin = (role) => {
    const preset = DEFAULT_PRESETS[role];
    if (preset && onLoginSuccess) {
      onLoginSuccess(preset);
    }
  };

  // Render dedicated role page based on active selection
  if (currentView === 'Student') {
    return <StudentLogin onBack={handleBackToGateway} onLoginSuccess={onLoginSuccess} />;
  }

  if (currentView === 'Mentor') {
    return <MentorLogin onBack={handleBackToGateway} onLoginSuccess={onLoginSuccess} />;
  }

  if (currentView === 'Admin/HOD') {
    return <HODLogin onBack={handleBackToGateway} onLoginSuccess={onLoginSuccess} />;
  }

  // Default: Role Selection Gateway Landing Hub
  return (
    <AuthGateway
      onSelectRole={handleSelectRole}
      onQuickLogin={handleQuickLogin}
    />
  );
};
