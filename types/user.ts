import { GradeLevel } from './student';

export type UserRole = 'admin' | 'user';

export interface UserPermissions {
  canRegisterStudents: boolean;
  canEditStudents: boolean;
  canDeleteStudents: boolean;
  canScanDocuments: boolean;
  canPrintForms: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
}

export interface SystemUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  assignedGrade?: GradeLevel | 'all';
  assignedClassroom?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  permissions?: Partial<UserPermissions>;
}

export const ROLE_LABELS: Record<UserRole, { khmer: string; english: string; badgeColor: string; description: string }> = {
  admin: {
    khmer: 'អ្នកគ្រប់គ្រង (Admin)',
    english: 'System Administrator',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'មានសិទ្ធិពេញលេញលើប្រព័ន្ធ រួមទាំងការគ្រប់គ្រងគណនី លុបទិន្នន័យ និងកែប្រែទិន្នន័យរដ្ឋបាលសាលា',
  },
  user: {
    khmer: 'បុគ្គលិក/គ្រូ (User)',
    english: 'Class Teacher / Staff',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'អាចចុះឈ្មោះសិស្ស ស្គែនឯកសារ មើលបញ្ជី និងបោះពុម្ពប័ណ្ណសិស្ស (មិនអាចលុបទិន្នន័យ ឬកែការកំណត់សាលា)',
  },
};

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'USR-001',
    username: 'admin.director',
    name: 'Siekmao',
    role: 'admin',
    title: 'នាយកវិទ្យាល័យ (Super Admin)',
    email: 'director.skun@moeys.gov.kh',
    phone: '012 889 977',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    assignedGrade: 'all',
    status: 'active',
    createdAt: '2026-01-10',
    lastLogin: '2026-06-02 08:30 AM',
  },
  {
    id: 'USR-002',
    username: 'admin.academic',
    name: 'លោកគ្រូ សុខ ចាន់ថន',
    role: 'admin',
    title: 'នាយករងទទួលបន្ទុកសិក្សា (Admin)',
    email: 'academic.skun@moeys.gov.kh',
    phone: '012 345 678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    assignedGrade: 'all',
    status: 'active',
    createdAt: '2026-01-15',
    lastLogin: '2026-06-02 09:15 AM',
  },
  {
    id: 'USR-003',
    username: 'teacher.g8',
    name: 'អ្នកគ្រូ កែវ សុគន្ធា',
    role: 'user',
    title: 'គ្រូបន្ទុកថ្នាក់ទី ៨ (User/Teacher)',
    email: 'sokunthea.keo@moeys.gov.kh',
    phone: '098 765 432',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    assignedGrade: 8,
    assignedClassroom: '8A',
    status: 'active',
    createdAt: '2026-02-01',
    lastLogin: '2026-06-02 08:45 AM',
  },
  {
    id: 'USR-004',
    username: 'staff.enrollment',
    name: 'លោក ម៉ៅ ពិសិដ្ឋ',
    role: 'user',
    title: 'មន្ត្រីរដ្ឋបាលចុះឈ្មោះ (User/Staff)',
    email: 'enrollment.skun@moeys.gov.kh',
    phone: '017 890 123',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    assignedGrade: 'all',
    status: 'active',
    createdAt: '2026-02-10',
    lastLogin: '2026-06-01 04:20 PM',
  },
];
