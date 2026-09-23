'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Printer, 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Award,
  IdCard,
  ChevronDown,
  X,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  Scan,
  HeartPulse,
  Ear,
  Scale,
  Home,
  LayoutGrid,
  Table as TableIcon,
  Activity,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Student, SchoolInfo, GradeLevel, Gender, StudentStatus, FamilyStatusLevel } from '@/types/student';
import { SystemUser } from '@/types/user';
import { toKhmerNum, formatKhmerDate, compareKhmer, calculateBMI } from '@/lib/khmer-utils';

interface StudentListProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  currentUser?: SystemUser;
  selectedGradeFilter?: GradeLevel | 'all';
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onPrintRoster: (grade?: GradeLevel, classroom?: string) => void;
  onPrintStudentCard: (student: Student) => void;
  onExportCSV: (studentsToExport: Student[]) => void;
  onNavigateToScanner?: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  schoolInfo,
  currentUser,
  selectedGradeFilter = 'all',
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintRoster,
  onPrintStudentCard,
  onExportCSV,
  onNavigateToScanner,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'all'>(selectedGradeFilter);
  const [classroomFilter, setClassroomFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [scholarshipFilter, setScholarshipFilter] = useState<boolean | 'all'>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'special'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'dob'>('name');
  
  const isAdmin = !currentUser || currentUser.role === 'admin';

  const handleAttemptDelete = (st: Student) => {
    if (!isAdmin) {
      alert('សិទ្ធិត្រូវបានកម្រិត៖ មានតែគណនី ADMIN (នាយកសាលា/អ្នកគ្រប់គ្រង) ប៉ុណ្ណោះដែលអាចលុបទិន្នន័យសិស្សបាន។ គណនី USER (គ្រូ/បុគ្គលិក) មិនមានសិទ្ធិលុបឡើយ។ សូមចុចប្តូរទៅគណនី Admin នៅជ្រុងខាងស្តាំខាងលើដើម្បីអនុវត្ត។');
      return;
    }
    if (confirm(`តើអ្នកពិតជាចង់លុបសិស្ស "${st.khmerName}" នេះមែនទេ?`)) {
      onDeleteStudent(st.id);
    }
  };

  // Selected student for detail modal
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [modalTab, setModalTab] = useState<'academic' | 'health' | 'family'>('academic');

  // Available classrooms for current grade
  const availableClassrooms = useMemo(() => {
    const list = gradeFilter === 'all' 
      ? students 
      : students.filter((s) => s.grade === gradeFilter);
    const rooms = Array.from(new Set(list.map((s) => s.classroom))).filter(Boolean);
    return rooms.sort();
  }, [students, gradeFilter]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Grade filter
        if (gradeFilter !== 'all' && s.grade !== gradeFilter) return false;
        // Classroom filter
        if (classroomFilter !== 'all' && s.classroom !== classroomFilter) return false;
        // Gender filter
        if (genderFilter !== 'all' && s.gender !== genderFilter) return false;
        // Status filter
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        // Scholarship filter
        if (scholarshipFilter === true && !s.scholarship && s.poorLevel === 'គ្មាន') return false;
        // Health filter
        if (healthFilter === 'special') {
          const hasVisionIssue = s.visionLevel && s.visionLevel !== 'ធម្មតា';
          const hasHearingIssue = s.hearingLevel && s.hearingLevel !== 'ធម្មតា';
          const hasLimbIssue = s.limbDisability && s.limbDisability !== 'គ្មាន';
          const hasChronic = s.chronicDisease && s.chronicDisease !== 'គ្មាន';
          if (!s.hasDisability && !hasVisionIssue && !hasHearingIssue && !hasLimbIssue && !hasChronic) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchKhmer = s.khmerName.toLowerCase().includes(q);
          const matchLatin = s.latinName.toLowerCase().includes(q);
          const matchCode = s.studentCode.toLowerCase().includes(q);
          const matchPhone = s.fatherPhone?.includes(q) || s.motherPhone?.includes(q) || s.guardianPhone?.includes(q);
          const matchAddress = s.currentAddress?.toLowerCase().includes(q) || s.pobVillage?.toLowerCase().includes(q);
          if (!matchKhmer && !matchLatin && !matchCode && !matchPhone && !matchAddress) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return compareKhmer(a.khmerName, b.khmerName);
        }
        if (sortBy === 'code') {
          return a.studentCode.localeCompare(b.studentCode);
        }
        if (sortBy === 'dob') {
          return a.dob.localeCompare(b.dob);
        }
        return 0;
      });
  }, [
    students,
    gradeFilter,
    classroomFilter,
    genderFilter,
    statusFilter,
    scholarshipFilter,
    healthFilter,
    searchQuery,
    sortBy,
  ]);

  const femaleCount = filteredStudents.filter((s) => s.gender === 'ស្រី').length;
  const gradeCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let g = 7; g <= 12; g++) {
      counts[g] = students.filter(s => s.grade === g).length;
    }
    return counts;
  }, [students]);

  return (
    <div className="space-y-5">
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                បញ្ជីរាយនាមសិស្សចូលរៀន
              </h2>
              {gradeFilter !== 'all' ? (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  ថ្នាក់ទី {toKhmerNum(gradeFilter)}
                </span>
              ) : (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
                  គ្រប់កម្រិតថ្នាក់ (៧-១២)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              សរុបមាន <strong className="text-slate-900 font-mono tabular-nums">{toKhmerNum(filteredStudents.length)}</strong> នាក់ (ស្រី <strong className="text-rose-600 font-mono tabular-nums">{toKhmerNum(femaleCount)}</strong> នាក់) ក្នុងវិទ្យាល័យ ហ៊ុន សែន ស្គន់
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 mr-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="មើលជាតារាងលម្អិត"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>តារាង</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="មើលជាប័ណ្ណកាតសិស្ស"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ប័ណ្ណកាត</span>
              </button>
            </div>

            {onNavigateToScanner && (
              <button
                onClick={onNavigateToScanner}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-2xs active:scale-98"
              >
                <Scan className="w-4 h-4" />
                <span>ស្គែនឯកសារអូតូ</span>
              </button>
            )}

            <button
              onClick={onAddStudent}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>ចុះឈ្មោះសិស្ស</span>
            </button>

            <button
              onClick={() => onPrintRoster(gradeFilter === 'all' ? undefined : gradeFilter, classroomFilter === 'all' ? undefined : classroomFilter)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-medium transition border border-slate-200 active:scale-98"
            >
              <Printer className="w-4 h-4 text-blue-700" />
              <span>បោះពុម្ពបញ្ជីថ្នាក់</span>
            </button>

            <button
              onClick={() => onExportCSV(filteredStudents)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium transition border border-emerald-200 active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>នាំចេញ Excel</span>
            </button>
          </div>
        </div>

        {/* Quick Grade Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-5 pt-4 border-t border-slate-100 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setGradeFilter('all');
              setClassroomFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              gradeFilter === 'all'
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <span>គ្រប់ថ្នាក់</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
              gradeFilter === 'all' ? 'bg-blue-800 text-amber-300' : 'bg-white text-slate-600'
            }`}>
              {toKhmerNum(students.length)}
            </span>
          </button>

          {([7, 8, 9, 10, 11, 12] as GradeLevel[]).map((g) => {
            const isActive = gradeFilter === g;
            const isTarget = g === 8;
            return (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGradeFilter(g);
                  setClassroomFilter('all');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : isTarget
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <span>ថ្នាក់ទី {toKhmerNum(g)}</span>
                {isTarget && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                )}
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                  isActive 
                    ? 'bg-blue-800 text-amber-300' 
                    : 'bg-white text-slate-600'
                }`}>
                  {toKhmerNum(gradeCounts[g] || 0)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកតាម ឈ្មោះខ្មែរ ឡាតាំង អត្តលេខ ឬ លេខទូរស័ព្ទ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white transition"
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

          {/* Classroom Selector */}
          <div>
            <select
              value={classroomFilter}
              onChange={(e) => setClassroomFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="all">បន្ទប់/ថ្នាក់ទាំងអស់</option>
              {availableClassrooms.map((c) => (
                <option key={c} value={c}>
                  បន្ទប់ {c}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as Gender | 'all')}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="all">ភេទទាំងពីរ</option>
              <option value="ប្រុស">ភេទ ប្រុស</option>
              <option value="ស្រី">ភេទ ស្រី</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'all')}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="all">ស្ថានភាពទាំងអស់</option>
              <option value="សិស្សថ្មី">សិស្សថ្មី</option>
              <option value="ឡើងថ្នាក់">ឡើងថ្នាក់</option>
              <option value="ត្រួតថ្នាក់">ត្រួតថ្នាក់</option>
              <option value="ផ្ទេរចូល">ផ្ទេរចូល</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter & Sort Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">តម្រៀប៖</span>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                sortBy === 'name' ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200'
              }`}
            >
              អក្ខរក្រមខ្មែរ (ក-អ)
            </button>
            <button
              onClick={() => setSortBy('code')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                sortBy === 'code' ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200'
              }`}
            >
              អត្តលេខ
            </button>
            <button
              onClick={() => setSortBy('dob')}
              className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                sortBy === 'dob' ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200'
              }`}
            >
              ថ្ងៃខែឆ្នាំកំណើត
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={scholarshipFilter === true}
                onChange={(e) => setScholarshipFilter(e.target.checked ? true : 'all')}
                className="rounded text-blue-900 focus:ring-blue-800"
              />
              <span className="font-medium text-slate-700">បង្ហាញតែសិស្សអាហារូបករណ៍/ក្រីក្រ</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={healthFilter === 'special'}
                onChange={(e) => setHealthFilter(e.target.checked ? 'special' : 'all')}
                className="rounded text-blue-900 focus:ring-blue-800"
              />
              <span className="font-medium text-slate-700">សិស្សមានសុខភាពពិសេស / ពិការភាព</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Student View (Table or Cards) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">ល.រ</th>
                  <th className="py-3 px-3">អត្តលេខ</th>
                  <th className="py-3 px-4">គោត្តនាម និង នាម</th>
                  <th className="py-3 px-3 text-center">ភេទ</th>
                  <th className="py-3 px-3">ថ្ងៃខែឆ្នាំកំណើត</th>
                  <th className="py-3 px-3 text-center">ថ្នាក់</th>
                  <th className="py-3 px-3">ស្ថានភាពសុខភាព / BMI</th>
                  <th className="py-3 px-3">អាណាព្យាបាល</th>
                  <th className="py-3 px-3 text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 text-sm">
                      ពុំមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះឡើយ។
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const bmi = st.weight && st.height ? calculateBMI(st.weight, st.height) : null;
                    const hasSpecialHealth = st.hasDisability || (st.visionLevel && st.visionLevel !== 'ធម្មតា') || (st.hearingLevel && st.hearingLevel !== 'ធម្មតា') || (st.limbDisability && st.limbDisability !== 'គ្មាន');
                    return (
                      <tr 
                        key={st.id} 
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={() => {
                          setViewingStudent(st);
                          setModalTab('academic');
                        }}
                      >
                        <td className="py-3.5 px-3 text-center font-mono text-xs text-slate-400 tabular-nums">
                          {toKhmerNum(idx + 1)}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-slate-800 font-bold tabular-nums">
                          {st.studentCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                              {st.photoUrl ? (
                                <img src={st.photoUrl} alt={st.khmerName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs">
                                  {st.khmerName.slice(0, 1)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                                {st.khmerName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-sans tracking-wide">
                                {st.latinName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            st.gender === 'ស្រី' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {st.gender}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-700">
                          <div>{st.dobKhmer || formatKhmerDate(st.dob)}</div>
                          <div className="text-[10px] text-slate-400 font-mono tabular-nums">{st.dob}</div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-bold text-slate-800 text-xs">
                            ថ្នាក់ទី {toKhmerNum(st.grade)}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium">({st.classroom})</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            {bmi && (
                              <div className="flex items-center gap-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono tabular-nums ${bmi.color}`}>
                                  BMI {toKhmerNum(bmi.bmi)}
                                </span>
                                <span className="text-[10px] text-slate-500">{bmi.label}</span>
                              </div>
                            )}
                            {hasSpecialHealth && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                <HeartPulse className="w-3 h-3 text-rose-500" />
                                <span>តម្រូវការពិសេស</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs">
                          <div className="font-medium text-slate-800">{st.guardianName}</div>
                          {st.guardianPhone && (
                            <div className="text-[11px] text-slate-400 font-mono tabular-nums">{st.guardianPhone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {st.status}
                          </span>
                          {st.scholarship && (
                            <div className="mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                              អាហារូបករណ៍
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setViewingStudent(st);
                                setModalTab('academic');
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                              title="មើលព័ត៌មានលម្អិត"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onPrintStudentCard(st)}
                              className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                              title="បោះពុម្ពកាតសិស្ស"
                            >
                              <IdCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditStudent(st)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="កែប្រែ"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAttemptDelete(st)}
                              className={`p-1.5 rounded-lg transition ${
                                isAdmin
                                  ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                              }`}
                              title={isAdmin ? 'លុបសិស្ស' : 'ទាមទារសិទ្ធិជា Admin ដើម្បីលុប'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 text-sm border border-slate-200/90">
              ពុំមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះឡើយ។
            </div>
          ) : (
            filteredStudents.map((st) => {
              const bmi = st.weight && st.height ? calculateBMI(st.weight, st.height) : null;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setViewingStudent(st);
                    setModalTab('academic');
                  }}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Header: Photo & Code */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                        {st.photoUrl ? (
                          <img src={st.photoUrl} alt={st.khmerName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-base">
                            {st.khmerName.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
                            {st.studentCode}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.gender === 'ស្រី' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {st.gender}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                          {st.khmerName}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans tracking-wide truncate">
                          {st.latinName}
                        </p>
                      </div>
                    </div>

                    {/* Class & Details */}
                    <div className="space-y-2 text-xs py-3 border-y border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ថ្នាក់រៀន៖</span>
                        <span className="font-bold text-slate-800 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                          ថ្នាក់ទី {toKhmerNum(st.grade)} ({st.classroom})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                        <span className="text-slate-700 font-mono tabular-nums text-[11px]">{st.dob}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">អាណាព្យាបាល៖</span>
                        <span className="text-slate-800 font-medium truncate max-w-[130px]">{st.guardianName}</span>
                      </div>
                      {bmi && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">ស្ថានភាព BMI៖</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono tabular-nums ${bmi.color}`}>
                            {toKhmerNum(bmi.bmi)} ({bmi.label})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 text-xs" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onPrintStudentCard(st)}
                      className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-semibold bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl transition"
                    >
                      <IdCard className="w-3.5 h-3.5" />
                      <span>កាត</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditStudent(st)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="កែប្រែ"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAttemptDelete(st)}
                        className={`p-1.5 rounded-lg transition ${
                          isAdmin
                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={isAdmin ? 'លុបសិស្ស' : 'ទាមទារសិទ្ធិជា Admin ដើម្បីលុប'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modern Executive Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 shadow-sm">
                  {viewingStudent.photoUrl ? (
                    <img src={viewingStudent.photoUrl} alt={viewingStudent.khmerName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xl">
                      {viewingStudent.khmerName.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">
                      {viewingStudent.khmerName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      viewingStudent.gender === 'ស្រី' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {viewingStudent.gender}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 font-mono tabular-nums px-2 py-0.5 rounded-md font-bold">
                      {viewingStudent.studentCode}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 font-sans tracking-wide mt-0.5">
                    {viewingStudent.latinName}
                  </div>
                  <div className="text-xs text-blue-900 font-bold mt-1">
                    ថ្នាក់ទី {toKhmerNum(viewingStudent.grade)} ({viewingStudent.classroom}) · {viewingStudent.status}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab('academic')}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  modalTab === 'academic' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ជីវប្រវត្តិ & ការសិក្សា
              </button>
              <button
                type="button"
                onClick={() => setModalTab('health')}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  modalTab === 'health' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                សុខភាព & BMI
              </button>
              <button
                type="button"
                onClick={() => setModalTab('family')}
                className={`flex-1 py-2 text-center rounded-lg transition-all ${
                  modalTab === 'family' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                គ្រួសារ & អាណាព្យាបាល
              </button>
            </div>

            {/* Tab 1: Academic & Personal Info */}
            {modalTab === 'academic' && (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block mb-0.5">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                    <strong>{viewingStudent.dobKhmer || formatKhmerDate(viewingStudent.dob)}</strong>
                    <div className="text-[11px] text-slate-400 font-mono tabular-nums">({viewingStudent.dob})</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">ទីកន្លែងកំណើត៖</span>
                    <span>ភូមិ{viewingStudent.pobVillage} ឃុំ{viewingStudent.pobCommune} ស្រុក{viewingStudent.pobDistrict} ខេត្ត{viewingStudent.pobProvince}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">អាសយដ្ឋានបច្ចុប្បន្ន៖</span>
                    <span>{viewingStudent.currentAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">ស្ថានភាពចុះឈ្មោះ៖</span>
                    <span className="font-semibold text-slate-900">{viewingStudent.status}</span>
                  </div>
                  {viewingStudent.track && viewingStudent.grade >= 11 && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block mb-0.5">ផ្នែកសិក្សា (វិទ្យាសាស្ត្រ / សង្គម)៖</span>
                      <strong className="text-blue-900 font-bold">{viewingStudent.track}</strong>
                    </div>
                  )}
                  {viewingStudent.notes && (
                    <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[11px] mb-0.5">កំណត់ចំណាំពិសេស៖</span>
                      <span>{viewingStudent.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Health & BMI Meter */}
            {modalTab === 'health' && (
              <div className="space-y-4">
                {/* Visual BMI Meter */}
                {viewingStudent.weight && viewingStudent.height && (
                  (() => {
                    const bmi = calculateBMI(viewingStudent.weight, viewingStudent.height);
                    if (!bmi) return null;
                    return (
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-blue-700" />
                            <span>សន្ទស្សន៍ម៉ាសរាងកាយ (BMI Score)</span>
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border font-mono tabular-nums ${bmi.color}`}>
                            {toKhmerNum(bmi.bmi)} ({bmi.label})
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block text-[10px]">ទម្ងន់</span>
                            <strong className="font-mono tabular-nums text-slate-800">{toKhmerNum(viewingStudent.weight)} គ.ក</strong>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block text-[10px]">កម្ពស់</span>
                            <strong className="font-mono tabular-nums text-slate-800">{toKhmerNum(viewingStudent.height)} ស.ម</strong>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block text-[10px]">ស្ថានភាពទម្ងន់</span>
                            <strong className="text-slate-800 text-[11px]">{bmi.label}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Sensory & Disability Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">កម្រិតគំហើញ៖</span>
                    <strong className={`text-slate-900 ${viewingStudent.visionLevel !== 'ធម្មតា' ? 'text-indigo-700 font-bold' : ''}`}>
                      {viewingStudent.visionLevel || 'ធម្មតា'}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">កម្រិតស្ដាប់៖</span>
                    <strong className={`text-slate-900 ${viewingStudent.hearingLevel !== 'ធម្មតា' ? 'text-teal-700 font-bold' : ''}`}>
                      {viewingStudent.hearingLevel || 'ធម្មតា'}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">ពិការភាពអវយវៈ៖</span>
                    <strong className={`text-slate-900 ${viewingStudent.limbDisability && viewingStudent.limbDisability !== 'គ្មាន' ? 'text-amber-800 font-bold' : ''}`}>
                      {viewingStudent.limbDisability || 'គ្មាន'}
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-slate-400 block text-[11px] mb-0.5">ជំងឺប្រចាំកាយ៖</span>
                    <strong className={`text-slate-900 ${viewingStudent.chronicDisease && viewingStudent.chronicDisease !== 'គ្មាន' ? 'text-rose-700 font-bold' : ''}`}>
                      {viewingStudent.chronicDisease || 'គ្មាន'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Family & Guardians */}
            {modalTab === 'family' && (
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block mb-0.5">ឪពុកឈ្មោះ៖</span>
                    <strong>{viewingStudent.fatherName || 'ពុំមាន'}</strong>
                    <div className="text-[11px] text-slate-500">មុខរបរ៖ {viewingStudent.fatherJob || 'គ្មាន'}</div>
                    {viewingStudent.fatherPhone && <div className="text-[11px] text-slate-400 font-mono tabular-nums">ទូរស័ព្ទ៖ {viewingStudent.fatherPhone}</div>}
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">ម្តាយឈ្មោះ៖</span>
                    <strong>{viewingStudent.motherName || 'ពុំមាន'}</strong>
                    <div className="text-[11px] text-slate-500">មុខរបរ៖ {viewingStudent.motherJob || 'គ្មាន'}</div>
                    {viewingStudent.motherPhone && <div className="text-[11px] text-slate-400 font-mono tabular-nums">ទូរស័ព្ទ៖ {viewingStudent.motherPhone}</div>}
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/70">
                    <span className="text-slate-400 block mb-0.5">អាណាព្យាបាលសិស្ស៖</span>
                    <strong className="text-slate-900 text-sm">{viewingStudent.guardianName}</strong>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">លេខទូរស័ព្ទ៖ {viewingStudent.guardianPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">ស្ថានភាពគ្រួសារ (៣ កម្រិត)៖</span>
                    <strong className="text-blue-900 font-bold">{viewingStudent.familyStatusLevel || 'ជីវភាពមធ្យម'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">ប័ណ្ណសមធម៌ក្រីក្រ៖</span>
                    <strong className="text-amber-800">{viewingStudent.poorLevel}</strong>
                  </div>
                  {viewingStudent.scholarship && (
                    <div className="sm:col-span-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>សិស្សទទួលបានអាហារូបករណ៍រដ្ឋពេញលេញ</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onPrintStudentCard(viewingStudent);
                  setViewingStudent(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl text-xs font-bold transition shadow-2xs active:scale-98"
              >
                <IdCard className="w-4 h-4" />
                <span>បោះពុម្ពប័ណ្ណសិស្ស</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onEditStudent(viewingStudent);
                    setViewingStudent(null);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
                >
                  <Edit className="w-4 h-4" />
                  <span>កែប្រែព័ត៌មាន</span>
                </button>

                <button
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                >
                  បិទផ្ទាំង
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
