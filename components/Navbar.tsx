'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  UserPlus, 
  Printer, 
  BarChart3, 
  Settings, 
  Sparkles,
  School,
  Scan,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  ArrowRightLeft,
  KeyRound,
  LogOut
} from 'lucide-react';
import { SchoolInfo } from '@/types/student';
import { SystemUser } from '@/types/user';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  schoolInfo: SchoolInfo;
  totalStudents: number;
  currentUser: SystemUser;
  users: SystemUser[];
  onSwitchUser: (userId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  schoolInfo,
  totalStudents,
  currentUser,
  users,
  onSwitchUser,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'ទិដ្ឋភាពទូទៅ', icon: BarChart3 },
    { id: 'scanner', label: 'ស្គែនឯកសារអូតូ', icon: Scan, isNew: true },
    { id: 'students', label: 'បញ្ជីឈ្មោះសិស្ស', icon: Users, badge: totalStudents },
    { id: 'register', label: 'ចុះឈ្មោះសិស្សថ្មី', icon: UserPlus },
    { id: 'print', label: 'បោះពុម្ពទម្រង់រដ្ឋបាល', icon: Printer },
    { id: 'statistics', label: 'ស្ថិតិលម្អិត', icon: GraduationCap },
    { id: 'users', label: 'គណនី Admin & User', icon: ShieldCheck, badge: users.length },
    { id: 'settings', label: 'ទិន្នន័យសាលា', icon: Settings },
    { id: 'ai', label: 'ជំនួយការ AI', icon: Sparkles },
  ];

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs transition-all">
      {/* Top MoEYS National Official Header Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white text-xs py-1.5 px-4 border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
            <span className="font-semibold tracking-wide text-slate-200">
              {schoolInfo.ministry} <span className="text-amber-400/70">·</span> {schoolInfo.department}
            </span>
          </div>
          <div className="font-moul text-[11px] text-amber-300 tracking-wider flex items-center gap-1.5 justify-center">
            <span>ព្រះរាជាណាចក្រកម្ពុជា</span>
            <span className="text-amber-400/50">·</span>
            <span>ជាតិ សាសនា ព្រះមហាក្សត្រ</span>
          </div>
          <div className="text-[11px] text-blue-200/90 flex items-center gap-2">
            <span>ឆ្នាំសិក្សា {schoolInfo.academicYear}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-200">{schoolInfo.locationName}</span>
          </div>
        </div>
      </div>

      {/* Main Brand & School Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-amber-300 flex items-center justify-center shadow-md border border-amber-300/30 shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-moul text-lg sm:text-xl text-slate-900 tracking-wide">
                  {schoolInfo.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200/80 shadow-2xs">
                  ថ្នាក់ទី ៧ - ១២
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យ និងការចុះឈ្មោះសិស្សចូលរៀន · Hun Sen Skun High School SIS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Solar Date Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
              <strong className="text-slate-800 font-semibold">{schoolInfo.solarDate}</strong>
            </div>

            {/* Current Active User Profile Capsule with Quick Switcher Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all text-left shadow-2xs active:scale-98 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-300 hover:border-amber-400'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isAdmin ? 'bg-amber-500' : 'bg-blue-600'
                  }`}></span>
                </div>

                <div className="hidden sm:block leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      isAdmin ? 'bg-amber-400 text-blue-950' : 'bg-blue-600 text-white'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {currentUser.title || (isAdmin ? 'អ្នកគ្រប់គ្រង' : 'គ្រូ/បុគ្គលិក')}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl p-4 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-xs text-slate-500 font-mono">@{currentUser.username}</div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full border bg-slate-50 text-slate-700">
                        {isAdmin ? <ShieldCheck className="w-3 h-3 text-amber-600" /> : <UserCheck className="w-3 h-3 text-blue-600" />}
                        <span>{isAdmin ? 'អ្នកគ្រប់គ្រង (Admin)' : 'បុគ្គលិក/គ្រូ (User)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch Account Quick List */}
                  <div className="py-2.5 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                        <span>ប្តូរគណនីភ្លាមៗ (Quick Switch):</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{users.length} គណនី</span>
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {users.map((u) => {
                        const isSelected = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              onSwitchUser(u.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                              isSelected
                                ? 'bg-blue-50/80 border border-blue-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-sm">{u.role === 'admin' ? '👑' : '👤'}</span>
                              <div className="truncate">
                                <div className="text-xs font-bold text-slate-900 truncate">{u.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{u.title}</div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Direct button to Manage Users */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('users');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>ចូលទំព័រគ្រប់គ្រង Admin & User</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Refined Segmented Control */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto mt-3 pt-2.5 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-blue-950 shadow-2xs">
                    ថ្មី
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-mono tabular-nums font-bold ${
                      isActive
                        ? 'bg-blue-800 text-amber-300'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
