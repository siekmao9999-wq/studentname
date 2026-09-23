'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Unlock, 
  X, 
  Phone, 
  Mail, 
  GraduationCap, 
  Check, 
  KeyRound,
  ShieldAlert,
  ArrowRightLeft,
  Sparkles,
  School,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  BadgeCheck,
  UserCog
} from 'lucide-react';
import { SystemUser, UserRole, ROLE_LABELS } from '@/types/user';
import { GradeLevel } from '@/types/student';
import { toKhmerNum } from '@/lib/khmer-utils';

interface UserManagementProps {
  currentUser: SystemUser;
  users: SystemUser[];
  onAddUser: (user: SystemUser) => void;
  onUpdateUser: (user: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (userId: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80',
];

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onSwitchUser,
}) => {
  // Navigation tabs inside UserManagement: 'list' | 'register' | 'permissions'
  const [subTab, setSubTab] = useState<'list' | 'register' | 'permissions'>('list');

  // Filter & Search states for the list view
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  
  // Edit modal state (for editing existing users from the list)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  // Edit Modal form states
  const [modalName, setModalName] = useState('');
  const [modalUsername, setModalUsername] = useState('');
  const [modalRole, setModalRole] = useState<UserRole>('user');
  const [modalTitle, setModalTitle] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalAssignedGrade, setModalAssignedGrade] = useState<GradeLevel | 'all'>('all');
  const [modalAssignedClassroom, setModalAssignedClassroom] = useState('');
  const [modalStatus, setModalStatus] = useState<'active' | 'suspended'>('active');
  const [modalAvatarUrl, setModalAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [modalFormError, setModalFormError] = useState('');

  // -------------------------------------------------------------
  // DEDICATED USER REGISTRATION FORM STATES
  // -------------------------------------------------------------
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('user.new');
  const [regPassword, setRegPassword] = useState('HSS#2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regTitle, setRegTitle] = useState('គ្រូបន្ទុកថ្នាក់');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAssignedGrade, setRegAssignedGrade] = useState<GradeLevel | 'all'>(8);
  const [regAssignedClassroom, setRegAssignedClassroom] = useState('8A');
  const [regStatus, setRegStatus] = useState<'active' | 'suspended'>('active');
  const [regAvatarUrl, setRegAvatarUrl] = useState(PRESET_AVATARS[2]);
  const [regError, setRegError] = useState('');
  const [regCopied, setRegCopied] = useState(false);
  const [registeredSuccessUser, setRegisteredSuccessUser] = useState<SystemUser | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const standardUserCount = users.filter((u) => u.role === 'user').length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchUsername = u.username.toLowerCase().includes(q);
      const matchTitle = u.title.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      return matchName || matchUsername || matchTitle || matchPhone;
    }
    return true;
  });

  // Generator Helpers for Registration
  const handleAutoGenerateUsername = () => {
    if (regName.trim()) {
      // Create a romanized or cleaned phonetic prefix
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const clean = regName.trim().replace(/\s+/g, '.').toLowerCase();
      setRegUsername(`user.${randomSuffix}`);
    } else {
      setRegUsername(`user_${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleGeneratePassword = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const chars = ['@', '#', '$', '!'];
    const symbol = chars[Math.floor(Math.random() * chars.length)];
    setRegPassword(`HSS${symbol}${randomNum}`);
  };

  const handleApplyPreset = (type: 'teacher' | 'staff' | 'admin') => {
    if (type === 'teacher') {
      setRegRole('user');
      setRegTitle('គ្រូបន្ទុកថ្នាក់ទី ៨');
      setRegAssignedGrade(8);
      setRegAssignedClassroom('8A');
      setRegAvatarUrl(PRESET_AVATARS[2]);
    } else if (type === 'staff') {
      setRegRole('user');
      setRegTitle('មន្ត្រីរដ្ឋបាលចុះឈ្មោះសិស្ស');
      setRegAssignedGrade('all');
      setRegAssignedClassroom('');
      setRegAvatarUrl(PRESET_AVATARS[3]);
    } else if (type === 'admin') {
      setRegRole('admin');
      setRegTitle('នាយករងទទួលបន្ទុកសិក្សា (Admin)');
      setRegAssignedGrade('all');
      setRegAssignedClassroom('');
      setRegAvatarUrl(PRESET_AVATARS[1]);
    }
  };

  const handleCopyCredentials = () => {
    const text = `គណនីវិទ្យាល័យ ហ៊ុន សែន ស្គន់:\nឈ្មោះ: ${regName || 'អ្នកប្រើប្រាស់'}\nឈ្មោះគណនី: ${regUsername}\nលេខសម្ងាត់/PIN: ${regPassword}\nតួនាទី: ${regRole.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setRegCopied(true);
    setTimeout(() => setRegCopied(false), 2000);
  };

  // Dedicated Registration Submit Handler
  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegisteredSuccessUser(null);

    if (!isAdmin) {
      setRegError('សិទ្ធិត្រូវបានកម្រិត៖ មានតែគណនី ADMIN ប៉ុណ្ណោះដែលអាចចុះឈ្មោះអ្នកប្រើប្រាស់បាន។');
      return;
    }

    if (!regName.trim()) {
      setRegError('សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ (FullName)');
      return;
    }

    if (!regUsername.trim()) {
      setRegError('សូមបញ្ចូលឈ្មោះគណនី (Username)');
      return;
    }

    // Check duplicate username
    const isDuplicate = users.some(
      (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );
    if (isDuplicate) {
      setRegError('ឈ្មោះគណនី (Username) នេះមានរួចហើយក្នុងប្រព័ន្ធ! សូមជ្រើសរើសឈ្មោះគណនីផ្សេង។');
      return;
    }

    const newUser: SystemUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: regName.trim(),
      username: regUsername.trim(),
      role: regRole,
      title: regTitle.trim() || (regRole === 'admin' ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)' : 'បុគ្គលិក/គ្រូ (User)'),
      email: regEmail.trim() || `${regUsername.trim().toLowerCase()}@skun.moeys.gov.kh`,
      phone: regPhone.trim() || '០១២ ០០០ ០០០',
      assignedGrade: regAssignedGrade,
      assignedClassroom: regAssignedClassroom.trim(),
      status: regStatus,
      avatarUrl: regAvatarUrl,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'ទើបបង្កើតថ្មី',
    };

    onAddUser(newUser);
    setRegisteredSuccessUser(newUser);

    // Reset fields for potential next entry
    setRegName('');
    setRegUsername(`user_${Math.floor(1000 + Math.random() * 9000)}`);
    setRegPhone('');
    setRegEmail('');
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: SystemUser) => {
    setEditingUser(user);
    setModalName(user.name);
    setModalUsername(user.username);
    setModalRole(user.role);
    setModalTitle(user.title);
    setModalEmail(user.email);
    setModalPhone(user.phone);
    setModalAssignedGrade(user.assignedGrade || 'all');
    setModalAssignedClassroom(user.assignedClassroom || '');
    setModalStatus(user.status);
    setModalAvatarUrl(user.avatarUrl || PRESET_AVATARS[0]);
    setModalFormError('');
    setIsModalOpen(true);
  };

  // Modal Save Handler (Edit)
  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setModalFormError('');

    if (!modalName.trim()) {
      setModalFormError('សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់');
      return;
    }

    if (!modalUsername.trim()) {
      setModalFormError('សូមបញ្ចូលឈ្មោះគណនី (Username)');
      return;
    }

    // Check duplicate username
    const isDuplicate = users.some(
      (u) => u.username.toLowerCase() === modalUsername.trim().toLowerCase() && u.id !== editingUser?.id
    );
    if (isDuplicate) {
      setModalFormError('ឈ្មោះគណនី (Username) នេះមានរួចហើយ សូមជ្រើសរើសឈ្មោះផ្សេង');
      return;
    }

    if (editingUser) {
      const updated: SystemUser = {
        ...editingUser,
        name: modalName.trim(),
        username: modalUsername.trim(),
        role: modalRole,
        title: modalTitle.trim() || (modalRole === 'admin' ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' : 'បុគ្គលិក/គ្រូ'),
        email: modalEmail.trim(),
        phone: modalPhone.trim(),
        assignedGrade: modalAssignedGrade,
        assignedClassroom: modalAssignedClassroom.trim(),
        status: modalStatus,
        avatarUrl: modalAvatarUrl,
      };
      onUpdateUser(updated);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (user: SystemUser) => {
    if (user.id === currentUser.id) {
      alert('អ្នកមិនអាចលុបគណនីដែលកំពុងដំណើរការផ្ទាល់ខ្លួនបានឡើយ!');
      return;
    }
    if (user.role === 'admin' && adminCount <= 1) {
      alert('មិនអាចលុបគណនី Admin ចុងក្រោយបានឡើយ! ត្រូវតែមាន Admin យ៉ាងហោចណាស់ម្នាក់។');
      return;
    }
    if (confirm(`តើអ្នកពិតជាចង់លុបគណនី "${user.name}" (${user.username}) មែនទេ?`)) {
      onDeleteUser(user.id);
    }
  };

  const handleToggleStatus = (user: SystemUser) => {
    if (user.id === currentUser.id) {
      alert('អ្នកមិនអាចផ្អាកគណនីផ្ទាល់ខ្លួនបានឡើយ!');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    onUpdateUser({
      ...user,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Active User Banner & Switcher Alert */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-amber-400/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || PRESET_AVATARS[0]}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-blue-200 uppercase tracking-widest font-sans font-semibold">
                  គណនីកំពុងដំណើរការបច្ចុប្បន្ន (Active Session)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                  currentUser.role === 'admin' 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                    : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  {currentUser.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-tight flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="text-xs font-normal text-slate-300 font-mono">(@{currentUser.username})</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span className="text-amber-300 font-semibold">{currentUser.title}</span>
                <span>·</span>
                <span>ទូរស័ព្ទ៖ {currentUser.phone || 'ពុំមាន'}</span>
                <span>·</span>
                <span>{currentUser.email || 'hunsenskun.hs@moeys.gov.kh'}</span>
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Pills for Testing */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex flex-col gap-2">
            <div className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>សាកល្បងប្តូរតួនាទី (Switch Role to Test):</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isCurrent
                        ? 'bg-amber-400 text-blue-950 font-bold shadow-xs'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={`ប្តូរទៅប្រើគណនី: ${u.name} (${u.role})`}
                  >
                    <span>{u.role === 'admin' ? '👑' : '👤'}</span>
                    <span className="max-w-[120px] truncate">{u.name.split(' ')[0]} ({u.role.toUpperCase()})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>ចំណាំ៖</strong> អ្នកកំពុងប្រើប្រាស់គណនី <strong>User (បុគ្គលិក/គ្រូ)</strong>។ អ្នកអាចមើលបញ្ជីគណនីបាន ប៉ុន្តែការចុះឈ្មោះគណនីថ្មី កែប្រែ ឬលុបគណនី តម្រូវឱ្យមានសិទ្ធិជា <strong>Admin</strong>។ ចុចប្តូរទៅគណនី Admin ខាងលើដើម្បីសាកល្បង។
            </span>
          </div>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">អ្នកប្រើប្រាស់សរុប</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {toKhmerNum(totalUsers)}
          </div>
          <span className="text-[11px] text-slate-400">គណនីក្នុងប្រព័ន្ធទាំងអស់</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">គណនី Admin</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums mt-1">
            {toKhmerNum(adminCount)}
          </div>
          <span className="text-[11px] text-slate-400">នាយក / អ្នកគ្រប់គ្រងប្រព័ន្ធ</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">គណនី User (គ្រូ/បុគ្គលិក)</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-900 font-mono tabular-nums mt-1">
            {toKhmerNum(standardUserCount)}
          </div>
          <span className="text-[11px] text-slate-400">គ្រូបន្ទុកថ្នាក់ & រដ្ឋបាល</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ស្ថានភាពសកម្ម</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {toKhmerNum(activeCount)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">ដំណើរការធម្មតា ១០០%</span>
        </div>
      </div>

      {/* Sub Navigation Bar for Admin section */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSubTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'list'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>បញ្ជីឈ្មោះគណនី</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              subTab === 'list' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {toKhmerNum(users.length)}
            </span>
          </button>

          <button
            onClick={() => {
              setRegisteredSuccessUser(null);
              setSubTab('register');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'register'
                ? 'bg-amber-400 text-blue-950 shadow-xs ring-2 ring-amber-400/30'
                : 'text-slate-800 hover:bg-amber-50 hover:text-amber-900 font-semibold'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-700" />
            <span>មុខងារចុះឈ្មោះអ្នកប្រើប្រាស់</span>
            <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] font-bold rounded-md uppercase">
              ថ្មី
            </span>
          </button>

          <button
            onClick={() => setSubTab('permissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'permissions'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>តារាងសិទ្ធិអំណាច (Matrix)</span>
          </button>
        </div>

        {subTab === 'list' && (
          <button
            onClick={() => {
              setRegisteredSuccessUser(null);
              setSubTab('register');
            }}
            disabled={!isAdmin}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-2xs ${
              isAdmin
                ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold active:scale-98'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-950" />
            <span>ចុះឈ្មោះអ្នកប្រើប្រាស់ថ្មី</span>
          </button>
        )}
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* TAB 1: USER REGISTRATION VIEW (មុខងារចុះឈ្មោះអ្នកប្រើប្រាស់) */}
      {/* -------------------------------------------------------------------------- */}
      {subTab === 'register' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Success Banner if user registered */}
          {registeredSuccessUser && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    ការចុះឈ្មោះបានសម្រេចជាស្ថាពរ!
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-emerald-950 mt-0.5">
                    បានបង្កើតគណនី «{registeredSuccessUser.name}» (@{registeredSuccessUser.username}) ជោគជ័យ
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    តួនាទី៖ {registeredSuccessUser.role === 'admin' ? '👑 Admin' : '👤 User'} · {registeredSuccessUser.title} · គណនីសកម្មរួចជាស្រេច
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onSwitchUser(registeredSuccessUser.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>ប្តូរទៅប្រើគណនីនេះ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('list')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  មើលក្នុងបញ្ជី
                </button>
                <button
                  type="button"
                  onClick={() => setRegisteredSuccessUser(null)}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Registration Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Registration Form (Left Column) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      ទម្រង់ចុះឈ្មោះអ្នកប្រើប្រាស់ប្រព័ន្ធ (System User Registration)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    បង្កើត និងកំណត់សិទ្ធិគណនីថ្មីសម្រាប់ នាយកសាលា នាយករង គ្រូបន្ទុកថ្នាក់ ឬបុគ្គលិករដ្ឋបាលវិទ្យាល័យ ហ៊ុន សែន ស្គន់
                  </p>
                </div>

                {/* Quick Presets Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400">គំរូលឿន៖</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('teacher')}
                    className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg transition"
                  >
                    👨‍🏫 គ្រូបន្ទុកថ្នាក់
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('staff')}
                    className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-800 hover:bg-indigo-100 rounded-lg transition"
                  >
                    📋 បុគ្គលិករដ្ឋបាល
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('admin')}
                    className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-lg transition"
                  >
                    👑 នាយករង (Admin)
                  </button>
                </div>
              </div>

              {regError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterUserSubmit} className="space-y-6">
                {/* 1. Account Role Selection Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ១. ជ្រើសរើសប្រភេទសិទ្ធិតួនាទី (User Role) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Admin Option Card */}
                    <div
                      onClick={() => setRegRole('admin')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3.5 ${
                        regRole === 'admin'
                          ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-4 ring-amber-400/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 text-xl font-bold shadow-2xs">
                        👑
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900">ADMIN (អ្នកគ្រប់គ្រង)</span>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">
                            ពេញសិទ្ធិ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          គ្រប់គ្រងប្រព័ន្ធទាំងមូល ចុះឈ្មោះអ្នកប្រើប្រាស់ លុបទិន្នន័យសិស្ស កែប្រែព័ត៌មានរដ្ឋបាលសាលា និង Backup/Restore។
                        </p>
                      </div>
                    </div>

                    {/* User Option Card */}
                    <div
                      onClick={() => setRegRole('user')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3.5 ${
                        regRole === 'user'
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-4 ring-blue-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 text-xl font-bold shadow-2xs">
                        👤
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900">USER (គ្រូ / បុគ្គលិក)</span>
                          <span className="px-2 py-0.5 bg-blue-200 text-blue-950 text-[10px] font-bold rounded-full">
                            ស្តង់ដារ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          ចុះឈ្មោះសិស្សថ្មី ស្គែនឯកសារ OCR មើលបញ្ជីថ្នាក់ បោះពុម្ពប័ណ្ណសិស្ស និងនាំចេញ Excel (មិនអាចលុបទិន្នន័យឡើយ)។
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Basic Identity Details */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ២. ព័ត៌មានអត្តសញ្ញាណ និងគណនី (Identity & Account)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        គោត្តនាម និងនាមពេញ (ភាសាខ្មែរ) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="ឧ. លោកគ្រូ ស៊ឹម សុផល"
                        required
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          ឈ្មោះគណនីចូលប្រព័ន្ធ (Username) <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoGenerateUsername}
                          className="text-[11px] font-semibold text-blue-900 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>បង្កើតស្វ័យប្រវត្ត</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                          placeholder="sokphal.sim"
                          required
                          className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none font-mono transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password / Initial PIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          លេខសម្ងាត់ / PIN បឋម <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>បង្កើតលេខកូដចៃដន្យ</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full py-2.5 pl-3.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Official Position Title */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        មុខតំណែង / តួនាទីផ្លូវការ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regTitle}
                        onChange={(e) => setRegTitle(e.target.value)}
                        placeholder="ឧ. គ្រូបន្ទុកថ្នាក់ទី ៨, មន្ត្រីរដ្ឋបាល"
                        required
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Class & Grade Assignment */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ៣. កម្រិតថ្នាក់ទទួលបន្ទុក និងបន្ទប់ (Grade & Classroom Assignment)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        កម្រិតថ្នាក់ទទួលបន្ទុក
                      </label>
                      <select
                        value={regAssignedGrade}
                        onChange={(e) => setRegAssignedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as GradeLevel)}
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      >
                        <option value="all">គ្រប់កម្រិតថ្នាក់ទាំងអស់ (ថ្នាក់ទី ៧ ដល់ ១២)</option>
                        <option value="7">ថ្នាក់ទី ៧</option>
                        <option value="8">ថ្នាក់ទី ៨</option>
                        <option value="9">ថ្នាក់ទី ៩</option>
                        <option value="10">ថ្នាក់ទី ១០</option>
                        <option value="11">ថ្នាក់ទី ១១</option>
                        <option value="12">ថ្នាក់ទី ១២</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        បន្ទប់ថ្នាក់ជាក់លាក់ (Classroom ID)
                      </label>
                      <input
                        type="text"
                        value={regAssignedClassroom}
                        onChange={(e) => setRegAssignedClassroom(e.target.value)}
                        placeholder="ឧ. 8A, 9B, 12A (ឬទុកទំនេរប្រសិនបើទទួលបន្ទុកទូទៅ)"
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Contact & Avatar */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ៤. ទំនាក់ទំនង និងរូបតំណាង (Contact & Profile Avatar)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        លេខទូរស័ព្ទទំនាក់ទំនង
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="012 345 678"
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        អ៊ីមែលផ្លូវការ (MoEYS Email)
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="user@moeys.gov.kh"
                        className="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      ជ្រើសរើសរូបតំណាង (Preset Avatar)
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setRegAvatarUrl(url)}
                          className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition relative ${
                            regAvatarUrl === url
                              ? 'border-blue-900 ring-2 ring-blue-900/30 scale-105 shadow-sm'
                              : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                          {regAvatarUrl === url && (
                            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-blue-900 text-white rounded-full flex items-center justify-center text-[9px]">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ស្ថានភាពគណនីដំបូង
                    </label>
                    <select
                      value={regStatus}
                      onChange={(e) => setRegStatus(e.target.value as 'active' | 'suspended')}
                      className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="active">សកម្ម (Active - អាចចូលប្រើប្រាស់បានភ្លាមៗ)</option>
                      <option value="suspended">ផ្អាកដំណើរការ (Suspended - រង់ចាំការបើកសិទ្ធិ)</option>
                    </select>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setRegName('');
                      setRegUsername(`user_${Math.floor(1000 + Math.random() * 9000)}`);
                      setRegPassword('HSS#2026!');
                      setRegPhone('');
                      setRegEmail('');
                      setRegTitle('គ្រូបន្ទុកថ្នាក់');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>សម្អាតទម្រង់ (Reset)</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSubTab('list')}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition text-center"
                    >
                      ត្រឡប់ទៅបញ្ជី
                    </button>
                    <button
                      type="submit"
                      disabled={!isAdmin}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition ${
                        isAdmin
                          ? 'bg-blue-900 hover:bg-blue-800 text-white active:scale-98'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 text-amber-300" />
                      <span>{isAdmin ? 'ចុះឈ្មោះអ្នកប្រើប្រាស់' : 'ទាមទារសិទ្ធិ Admin'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Live Account Preview Card (Right Column) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg space-y-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] font-bold tracking-wider text-amber-200 uppercase">
                      វិទ្យាល័យ ហ៊ុន សែន ស្គន់
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">LIVE PREVIEW</span>
                </div>

                {/* Profile Card Header */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={regAvatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                      regStatus === 'active' ? 'bg-emerald-400' : 'bg-rose-500'
                    }`}></span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                        regRole === 'admin'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-blue-400/20 text-blue-300 border-blue-400/40'
                      }`}>
                        {regRole === 'admin' ? '👑 ADMIN' : '👤 USER'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {regStatus === 'active' ? 'សកម្ម' : 'ផ្អាក'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">
                      {regName || 'ឈ្មោះអ្នកប្រើប្រាស់'}
                    </h4>
                    <div className="text-xs text-slate-300 font-mono">
                      @{regUsername || 'username'}
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-white/5 rounded-2xl p-4 space-y-2.5 border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">មុខតំណែង៖</span>
                    <span className="font-semibold text-white">{regTitle || 'បុគ្គលិក/គ្រូ'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">ថ្នាក់ទទួលបន្ទុក៖</span>
                    <span className="font-semibold text-white">
                      {regAssignedGrade === 'all' ? 'គ្រប់កម្រិតថ្នាក់' : `ថ្នាក់ទី ${regAssignedGrade}`}
                      {regAssignedClassroom ? ` (${regAssignedClassroom})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">ទូរស័ព្ទ៖</span>
                    <span className="font-mono text-white">{regPhone || 'ពុំទាន់បញ្ចូល'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">អ៊ីមែល៖</span>
                    <span className="font-mono text-slate-300 truncate max-w-[160px] text-right">
                      {regEmail || `${regUsername || 'user'}@moeys.gov.kh`}
                    </span>
                  </div>
                </div>

                {/* Credentials Snippet */}
                <div className="bg-amber-400/10 border border-amber-400/20 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-200">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                      <span>ព័ត៌មាន Login បឋម</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="text-amber-300 hover:text-white flex items-center gap-1 transition"
                    >
                      {regCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{regCopied ? 'ចម្លងរួច' : 'ចម្លងទុក'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-amber-100 flex items-center justify-between bg-black/30 p-2 rounded-xl">
                    <span>PIN: {regPassword}</span>
                    <span className="text-[10px] text-slate-400">Default Key</span>
                  </div>
                </div>

                {/* Summary of Permissions */}
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  <div className="font-semibold text-slate-300">សិទ្ធិអនុញ្ញាតសម្រាប់គណនីនេះ៖</div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>ចុះឈ្មោះសិស្សថ្មី & ស្គែនឯកសារ OCR</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>បោះពុម្ពប័ណ្ណសិស្ស បញ្ជីថ្នាក់ & Export Excel</span>
                  </div>
                  {regRole === 'admin' ? (
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>គ្រប់គ្រងគណនី លុបទិន្នន័យ & កែព័ត៌មានសាលា</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>ហាមឃាត់ការលុបទិន្នន័យ និងកែប្រែរដ្ឋបាលសាលា</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Sparkles className="w-4 h-4 text-blue-800" />
                  <span>ការណែនាំសុវត្ថិភាពគណនី</span>
                </div>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  គណនីថ្មីនីមួយៗនឹងត្រូវបានរក្សាទុកក្នុងប្រព័ន្ធដោយស្វ័យប្រវត្ត។ លោកអ្នកអាចផ្តល់ Username និង Default PIN ជូនគ្រូបន្ទុកថ្នាក់ដើម្បីចូលប្រើប្រាស់។
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* TAB 2: USER DIRECTORY LIST TABLE */}
      {/* -------------------------------------------------------------------------- */}
      {subTab === 'list' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-900" />
                <span>បញ្ជីឈ្មោះគណនីអ្នកប្រើប្រាស់ (Admin & User Accounts)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                គ្រប់គ្រងសិទ្ធិអំណាច កំណត់តួនាទី និងការកំណត់គណនីគ្រូ និងអ្នកគ្រប់គ្រងវិទ្យាល័យ ហ៊ុន សែន ស្គន់
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setRegisteredSuccessUser(null);
                  setSubTab('register');
                }}
                disabled={!isAdmin}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-2xs ${
                  isAdmin
                    ? 'bg-blue-900 hover:bg-blue-800 text-white active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title={isAdmin ? 'ចុះឈ្មោះអ្នកប្រើប្រាស់ថ្មី' : 'ទាមទារសិទ្ធិជា Admin'}
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>ចុះឈ្មោះអ្នកប្រើប្រាស់ថ្មី</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ស្វែងរកតាម ឈ្មោះ, Username, ឬ តួនាទី..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="all">គ្រប់តួនាទីទាំងអស់ (All Roles)</option>
                <option value="admin">អ្នកគ្រប់គ្រង (Admin ពេញសិទ្ធិ)</option>
                <option value="user">បុគ្គលិក/គ្រូ (User សិទ្ធិកំណត់)</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="all">គ្រប់ស្ថានភាព (All Status)</option>
                <option value="active">សកម្ម (Active)</option>
                <option value="suspended">បានផ្អាក (Suspended)</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">អ្នកប្រើប្រាស់</th>
                  <th className="py-3 px-3 text-center">តួនាទី (Role)</th>
                  <th className="py-3 px-3">មុខតំណែង / ទទួលបន្ទុក</th>
                  <th className="py-3 px-3">ទំនាក់ទំនង</th>
                  <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                      ពុំមានទិន្នន័យអ្នកប្រើប្រាស់ត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    const roleInfo = ROLE_LABELS[user.role];

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition">
                        {/* Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={user.avatarUrl || PRESET_AVATARS[0]}
                                alt={user.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              />
                              {isSelf && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white" title="គណនីអ្នកបច្ចុប្បន្ន"></span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                                    អ្នក (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                <span>@{user.username}</span>
                                <span>·</span>
                                <span>{user.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${roleInfo.badgeColor}`}>
                            {user.role === 'admin' ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5 text-blue-800" />
                            )}
                            <span>{user.role.toUpperCase()}</span>
                          </span>
                        </td>

                        {/* Title & Assigned Grade */}
                        <td className="py-3 px-3">
                          <div className="text-xs font-semibold text-slate-800">{user.title}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <GraduationCap className="w-3 h-3 text-slate-400" />
                            <span>
                              {user.assignedGrade === 'all' || !user.assignedGrade ? (
                                'គ្រប់កម្រិតថ្នាក់'
                              ) : (
                                `ថ្នាក់ទី ${user.assignedGrade}${user.assignedClassroom ? ` (${user.assignedClassroom})` : ''}`
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="font-mono">{user.phone || 'ពុំមាន'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">{user.email || 'ពុំមាន'}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>សកម្ម</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              <span>បានផ្អាក</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast Switch User */}
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => onSwitchUser(user.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                title="ប្តូរទៅប្រើគណនីនេះភ្លាមៗ"
                              >
                                ប្តូរប្រើ
                              </button>
                            )}

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(user)}
                              disabled={!isAdmin}
                              className={`p-1.5 rounded-lg transition ${
                                isAdmin
                                  ? 'text-slate-500 hover:text-blue-900 hover:bg-blue-50'
                                  : 'text-slate-300 cursor-not-allowed'
                              }`}
                              title={isAdmin ? 'កែប្រែព័ត៌មាន' : 'ទាមទារសិទ្ធិ Admin'}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Suspend / Resume toggle */}
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                disabled={!isAdmin}
                                className={`p-1.5 rounded-lg transition ${
                                  isAdmin
                                    ? user.status === 'active'
                                      ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                      : 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title={
                                  isAdmin
                                    ? user.status === 'active'
                                      ? 'ផ្អាកគណនី'
                                      : 'បើកដំណើរការឡើងវិញ'
                                    : 'ទាមទារសិទ្ធិ Admin'
                                }
                              >
                                {user.status === 'active' ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Delete Button */}
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleDelete(user)}
                                disabled={!isAdmin}
                                className={`p-1.5 rounded-lg transition ${
                                  isAdmin
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                    : 'text-slate-200 cursor-not-allowed'
                                }`}
                                title={isAdmin ? 'លុបគណនី' : 'ទាមទារសិទ្ធិ Admin'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* TAB 3: ROLE PERMISSIONS MATRIX */}
      {/* -------------------------------------------------------------------------- */}
      {subTab === 'permissions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                តារាងប្រៀបធៀបសិទ្ធិអំណាចរវាង Admin និង User (Role Permissions Matrix)
              </h3>
              <p className="text-[11px] text-slate-500">ស្តង់ដារគ្រប់គ្រងរដ្ឋបាលសាលារៀន ស្របតាមក្រសួងអប់រំ យុវជន និងកីឡា</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">មុខងារ និងសិទ្ធិប្រតិបត្តិការក្នុងប្រព័ន្ធ</th>
                  <th className="py-2.5 px-4 text-center bg-amber-50/70 text-amber-950 w-36">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                      <span>ADMIN (អ្នកគ្រប់គ្រង)</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-4 text-center bg-blue-50/70 text-blue-950 w-36">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-800" />
                      <span>USER (គ្រូ/បុគ្គលិក)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    ចុះឈ្មោះសិស្សថ្មី (New Student Enrollment)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    ស្គែនឯកសារអូតូចូល Folder ថ្នាក់ (AI Document Scanner & OCR)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    មើលបញ្ជីរាយនាមសិស្ស និងព័ត៌មានលម្អិត (View Directory & Health BMI)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    បោះពុម្ពបញ្ជីថ្នាក់ ប័ណ្ណសិស្ស និងពាក្យសុំ (Print Documents)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    នាំចេញទិន្នន័យជា Excel CSV (Export Data)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    កែប្រែទិន្នន័យសិស្ស (Edit Student Profile)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/20 text-emerald-600 font-bold">✓ មានសិទ្ធិពេញលេញ</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/20 text-emerald-600 font-bold">✓ គ្រប់កម្រិតថ្នាក់</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    លុបទិន្នន័យសិស្សចេញពីប្រព័ន្ធ (Delete Student Data)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/40 text-emerald-600 font-bold">✓ អនុញ្ញាត (Allowed)</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/40 text-rose-600 font-bold">✗ ហាមឃាត់ (Restricted)</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    កែប្រែទិន្នន័យរដ្ឋបាលសាលា និង Backup (School Settings & Restore)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/40 text-emerald-600 font-bold">✓ អនុញ្ញាត (Allowed)</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/40 text-rose-600 font-bold">✗ ហាមឃាត់ (Restricted)</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    ចុះឈ្មោះ កែប្រែ ឬលុបគណនីអ្នកប្រើប្រាស់ (Register & Manage System Users)
                  </td>
                  <td className="py-2.5 px-4 text-center bg-amber-50/40 text-emerald-600 font-bold">✓ អនុញ្ញាត (Allowed)</td>
                  <td className="py-2.5 px-4 text-center bg-blue-50/40 text-rose-600 font-bold">✗ ហាមឃាត់ (Restricted)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* EDIT USER MODAL (for quick edits on existing users) */}
      {/* -------------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                  modalRole === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                }`}>
                  {modalRole === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    កែប្រែព័ត៌មានអ្នកប្រើប្រាស់
                  </h3>
                  <p className="text-xs text-slate-400">កំណត់សិទ្ធិ និងព័ត៌មានសម្រាប់លោកគ្រូ/អ្នកគ្រូ ឬអ្នកគ្រប់គ្រង</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalFormError}</span>
              </div>
            )}

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  ជ្រើសរើសតួនាទី (User Role) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalRole('admin')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                      modalRole === 'admin'
                        ? 'border-amber-400 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                      👑
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">ADMIN (អ្នកគ្រប់គ្រង)</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        សិទ្ធិពេញលេញ៖ គ្រប់គ្រងគណនី លុបទិន្នន័យ កែការកំណត់
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalRole('user')}
                    className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                      modalRole === 'user'
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 font-bold">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">USER (គ្រូ/បុគ្គលិក)</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        សិទ្ធិស្តង់ដារ៖ ចុះឈ្មោះសិស្ស ស្គែនឯកសារ បោះពុម្ព
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ឈ្មោះពេញ (ភាសាខ្មែរ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="ឧ. លោកគ្រូ សុខ វិបុល"
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ឈ្មោះគណនី (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalUsername}
                    onChange={(e) => setModalUsername(e.target.value.toLowerCase().replace(/\s+/g, '.'))}
                    placeholder="ឧ. vibol.sok"
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* Title & Assigned Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    មុខតំណែង / តួនាទី <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={modalTitle}
                    onChange={(e) => setModalTitle(e.target.value)}
                    placeholder="ឧ. គ្រូបន្ទុកថ្នាក់ទី ៨, នាយករង"
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    កម្រិតថ្នាក់ទទួលបន្ទុក
                  </label>
                  <select
                    value={modalAssignedGrade}
                    onChange={(e) => setModalAssignedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as GradeLevel)}
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  >
                    <option value="all">គ្រប់កម្រិតថ្នាក់ (៧ ដល់ ១២)</option>
                    <option value="7">ថ្នាក់ទី ៧</option>
                    <option value="8">ថ្នាក់ទី ៨</option>
                    <option value="9">ថ្នាក់ទី ៩</option>
                    <option value="10">ថ្នាក់ទី ១០</option>
                    <option value="11">ថ្នាក់ទី ១១</option>
                    <option value="12">ថ្នាក់ទី ១២</option>
                  </select>
                </div>
              </div>

              {/* Classroom & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    បន្ទប់ថ្នាក់ទទួលបន្ទុក (បើមាន)
                  </label>
                  <input
                    type="text"
                    value={modalAssignedClassroom}
                    onChange={(e) => setModalAssignedClassroom(e.target.value)}
                    placeholder="ឧ. 8A, 9B"
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    លេខទូរស័ព្ទ
                  </label>
                  <input
                    type="tel"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="012 345 678"
                    className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  អ៊ីមែលផ្លូវការ (MoEYS)
                </label>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="vibol@moeys.gov.kh"
                  className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  រូបតំណាងគណនី (Avatar)
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setModalAvatarUrl(url)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                        modalAvatarUrl === url ? 'border-blue-900 scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ស្ថានភាពគណនី
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as 'active' | 'suspended')}
                  className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                >
                  <option value="active">សកម្ម (Active - អាចចូលប្រើបាន)</option>
                  <option value="suspended">ផ្អាកដំណើរការ (Suspended)</option>
                </select>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition shadow-xs active:scale-98"
                >
                  រក្សាទុកការកែប្រែ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
