'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { StudentList } from '@/components/StudentList';
import { RegistrationForm } from '@/components/RegistrationForm';
import { PrintForms } from '@/components/PrintForms';
import { StatisticsView } from '@/components/StatisticsView';
import { SchoolSettings } from '@/components/SchoolSettings';
import { AiAssistant } from '@/components/AiAssistant';
import { DocumentScanner } from '@/components/DocumentScanner';
import { UserManagement } from '@/components/UserManagement';
import { Student, SchoolInfo, GradeLevel, ScannedDocument } from '@/types/student';
import { SystemUser, INITIAL_SYSTEM_USERS } from '@/types/user';
import { DEFAULT_SCHOOL_INFO, INITIAL_STUDENTS } from '@/lib/seed-data';
import { INITIAL_SCANNED_DOCUMENTS } from '@/lib/seed-documents';

const STORAGE_KEY_STUDENTS = 'hun_sen_skun_students_v1';
const STORAGE_KEY_SCHOOL = 'hun_sen_skun_school_v1';
const STORAGE_KEY_DOCS = 'hun_sen_skun_documents_v1';
const STORAGE_KEY_USERS = 'hun_sen_skun_users_v1';
const STORAGE_KEY_CURRENT_USER_ID = 'hun_sen_skun_current_user_id_v1';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [gradeFilterForList, setGradeFilterForList] = useState<GradeLevel | 'all'>('all');

  // Students State
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
        if (savedStudents) {
          const parsed = JSON.parse(savedStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load students from storage', e);
      }
    }
    return INITIAL_STUDENTS;
  });

  // Scanned Documents State
  const [documents, setDocuments] = useState<ScannedDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDocs = localStorage.getItem(STORAGE_KEY_DOCS);
        if (savedDocs) {
          const parsed = JSON.parse(savedDocs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load documents from storage', e);
      }
    }
    return INITIAL_SCANNED_DOCUMENTS;
  });

  // School Official Info State
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSchool = localStorage.getItem(STORAGE_KEY_SCHOOL);
        if (savedSchool) {
          const parsed = JSON.parse(savedSchool);
          if (parsed && parsed.name) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load schoolInfo from storage', e);
      }
    }
    return DEFAULT_SCHOOL_INFO;
  });

  // System Users State (Admin & User roles)
  const [users, setUsers] = useState<SystemUser[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((u: SystemUser) =>
              u.id === 'USR-001' && u.name === 'លោក ហេង វណ្ណា'
                ? { ...u, name: 'Siekmao' }
                : u
            );
          }
        }
      } catch (e) {
        console.error('Failed to load users from storage', e);
      }
    }
    return INITIAL_SYSTEM_USERS;
  });

  // Active Session Current User ID
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = localStorage.getItem(STORAGE_KEY_CURRENT_USER_ID);
        if (savedId) return savedId;
      } catch (e) {
        console.error('Failed to load current user ID from storage', e);
      }
    }
    return 'USR-001';
  });

  // Current active user object
  const currentUser: SystemUser = users.find((u) => u.id === currentUserId) || users[0] || INITIAL_SYSTEM_USERS[0];

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(schoolInfo));
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY_CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error('Failed to save to storage', e);
    }
  }, [students, schoolInfo, documents, users, currentUserId]);

  // Add or Update student
  const handleSaveStudent = (saved: Student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    setEditingStudent(null);
    setActiveTab('students');
  };

  // Delete student (Protected by RBAC)
  const handleDeleteStudent = (id: string) => {
    if (currentUser.role !== 'admin') {
      alert('សិទ្ធិត្រូវបានកម្រិត៖ មានតែគណនី ADMIN ប៉ុណ្ណោះដែលអាចលុបទិន្នន័យសិស្សបាន។');
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Add Scanned Document
  const handleAddDocument = (newDoc: ScannedDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Delete Scanned Document
  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Auto enroll student extracted from OCR document
  const handleEnrollFromDoc = (studentData: Partial<Student>) => {
    const newStudent: Student = {
      id: `HSS-2026-${Date.now().toString().slice(-4)}`,
      studentCode: Date.now().toString().slice(-4),
      khmerName: studentData.khmerName || '',
      latinName: studentData.latinName || '',
      gender: studentData.gender || 'ប្រុស',
      dob: studentData.dob || '2012-01-01',
      dobKhmer: studentData.dobKhmer || '',
      pobVillage: studentData.pobVillage || 'ស្គន់',
      pobCommune: studentData.pobCommune || 'សូទិព្វ',
      pobDistrict: studentData.pobDistrict || 'ជើងព្រៃ',
      pobProvince: studentData.pobProvince || 'កំពង់ចាម',
      currentAddress: studentData.currentAddress || 'ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
      grade: studentData.grade || 8,
      classroom: studentData.classroom || '8A',
      track: studentData.track || 'ទូទៅ',
      status: studentData.status || 'សិស្សថ្មី',
      scholarship: false,
      poorLevel: 'គ្មាន',
      hasDisability: false,
      weight: studentData.weight || 45,
      height: studentData.height || 155,
      visionLevel: 'ធម្មតា',
      hearingLevel: 'ធម្មតា',
      limbDisability: 'គ្មាន',
      chronicDisease: 'គ្មាន',
      familyStatusLevel: 'ជីវភាពមធ្យម',
      fatherName: studentData.fatherName || '',
      fatherJob: studentData.fatherJob || 'កសិករ',
      fatherPhone: studentData.fatherPhone || '',
      motherName: studentData.motherName || '',
      motherJob: studentData.motherJob || 'មេផ្ទះ',
      motherPhone: studentData.motherPhone || '',
      guardianName: studentData.guardianName || studentData.fatherName || studentData.motherName || '',
      guardianPhone: studentData.guardianPhone || studentData.fatherPhone || studentData.motherPhone || '',
      registeredDate: new Date().toISOString().split('T')[0],
      academicYear: schoolInfo.academicYear,
      photoUrl: studentData.photoUrl || '',
      notes: 'បានចុះឈ្មោះស្វ័យប្រវត្តពីការស្គែនឯកសារ OCR',
    };

    setStudents((prev) => [newStudent, ...prev]);
    setActiveTab('students');
  };

  // User Management Handlers
  const handleAddUser = (newUser: SystemUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: SystemUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) {
      setCurrentUserId(users.find((u) => u.id !== userId)?.id || 'USR-001');
    }
  };

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Export CSV
  const handleExportCSV = (list: Student[]) => {
    if (list.length === 0) {
      alert('ពុំមានទិន្នន័យសម្រាប់នាំចេញឡើយ');
      return;
    }

    const headers = [
      'អត្តលេខ',
      'គោត្តនាម-នាម',
      'ឈ្មោះឡាតាំង',
      'ភេទ',
      'ថ្ងៃខែឆ្នាំកំណើត',
      'ថ្នាក់ទី',
      'បន្ទប់',
      'ស្ថានភាព',
      'អាហារូបករណ៍',
      'កម្រិតក្រីក្រ',
      'កម្ពស់ (cm)',
      'ទម្ងន់ (kg)',
      'អាណាព្យាបាល',
      'លេខទូរស័ព្ទ',
      'ទីកន្លែងកំណើត',
      'អាសយដ្ឋានបច្ចុប្បន្ន',
    ];

    const rows = list.map((s) => [
      `"${s.studentCode || ''}"`,
      `"${s.khmerName || ''}"`,
      `"${s.latinName || ''}"`,
      `"${s.gender || ''}"`,
      `"${s.dob || ''}"`,
      `"${s.grade || ''}"`,
      `"${s.classroom || ''}"`,
      `"${s.status || ''}"`,
      `"${s.scholarship ? 'មាន' : 'គ្មាន'}"`,
      `"${s.poorLevel || 'គ្មាន'}"`,
      `"${s.height || ''}"`,
      `"${s.weight || ''}"`,
      `"${s.guardianName || ''}"`,
      `"${s.guardianPhone || ''}"`,
      `"${s.pobProvince || ''}"`,
      `"${s.currentAddress || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `បញ្ជីសិស្ស_វិទ្យាល័យហ៊ុនសែនស្គន់_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick navigation helper
  const handleNavigate = (tab: string, grade?: GradeLevel) => {
    if (grade) {
      setGradeFilterForList(grade);
    }
    setActiveTab(tab);
  };

  // Reset to default
  const handleResetToDefault = () => {
    setStudents(INITIAL_STUDENTS);
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setDocuments(INITIAL_SCANNED_DOCUMENTS);
    setUsers(INITIAL_SYSTEM_USERS);
    setCurrentUserId('USR-001');
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      localStorage.removeItem(STORAGE_KEY_SCHOOL);
      localStorage.removeItem(STORAGE_KEY_DOCS);
      localStorage.removeItem(STORAGE_KEY_USERS);
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER_ID);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-kantumruy">
      {/* Top Navbar with Admin & User Role Indicator and Quick Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schoolInfo={schoolInfo}
        totalStudents={students.length}
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            students={students}
            schoolInfo={schoolInfo}
            onNavigate={handleNavigate}
            onExportCSV={() => handleExportCSV(students)}
          />
        )}

        {activeTab === 'scanner' && (
          <DocumentScanner
            documents={documents}
            students={students}
            schoolInfo={schoolInfo}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onEnrollFromDoc={handleEnrollFromDoc}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            students={students}
            schoolInfo={schoolInfo}
            currentUser={currentUser}
            selectedGradeFilter={gradeFilterForList}
            onAddStudent={() => {
              setEditingStudent(null);
              setActiveTab('register');
            }}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setActiveTab('register');
            }}
            onDeleteStudent={handleDeleteStudent}
            onPrintRoster={(grade) => {
              if (grade) setGradeFilterForList(grade);
              setActiveTab('print');
            }}
            onPrintStudentCard={(st) => {
              setSelectedStudentForCard(st);
              setActiveTab('print');
            }}
            onExportCSV={(list) => handleExportCSV(list)}
            onNavigateToScanner={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'register' && (
          <RegistrationForm
            schoolInfo={schoolInfo}
            editingStudent={editingStudent}
            onSaveStudent={handleSaveStudent}
            onCancel={() => {
              setEditingStudent(null);
              setActiveTab('students');
            }}
            onPrintApplicationForm={(st) => {
              setSelectedStudentForCard(st);
              setActiveTab('print');
            }}
            onPrintStudentCard={(st) => {
              setSelectedStudentForCard(st);
              setActiveTab('print');
            }}
          />
        )}

        {activeTab === 'print' && (
          <PrintForms
            students={students}
            schoolInfo={schoolInfo}
            defaultGrade={gradeFilterForList !== 'all' ? gradeFilterForList : 8}
            selectedStudentForCard={selectedStudentForCard}
          />
        )}

        {activeTab === 'statistics' && (
          <StatisticsView
            students={students}
            schoolInfo={schoolInfo}
            onExportCSV={() => handleExportCSV(students)}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement
            currentUser={currentUser}
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onSwitchUser={handleSwitchUser}
          />
        )}

        {activeTab === 'settings' && (
          <SchoolSettings
            schoolInfo={schoolInfo}
            students={students}
            documents={documents}
            currentUser={currentUser}
            onSaveSchoolInfo={(info) => setSchoolInfo(info)}
            onRestoreData={(newStudents, newInfo, newDocs) => {
              setStudents(newStudents);
              setSchoolInfo(newInfo);
              if (newDocs && newDocs.length > 0) {
                setDocuments(newDocs);
              }
            }}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistant
            students={students}
            schoolInfo={schoolInfo}
          />
        )}
      </main>

      {/* Footer (Hidden during printing) */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="font-semibold text-slate-700">
            {schoolInfo.name} · {schoolInfo.office} · {schoolInfo.department}
          </div>
          <div>
            ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះ និងស្ថិតិសិស្សថ្នាក់ទី ៧ ដល់ទី ១២ · ឆ្នាំសិក្សា {schoolInfo.academicYear}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            {schoolInfo.lunarDate} · {schoolInfo.locationName}, {schoolInfo.solarDate}
          </div>
        </div>
      </footer>
    </div>
  );
}
