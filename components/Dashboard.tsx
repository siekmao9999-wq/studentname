'use client';

import React from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Award, 
  UserPlus, 
  Printer, 
  Download, 
  Calendar, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  School,
  Scan,
  FolderOpen
} from 'lucide-react';
import { SchoolInfo, Student, GradeLevel } from '@/types/student';
import { toKhmerNum } from '@/lib/khmer-utils';

interface DashboardProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onNavigate: (tab: string, gradeFilter?: GradeLevel) => void;
  onExportCSV: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  schoolInfo,
  onNavigate,
  onExportCSV,
}) => {
  const total = students.length;
  const females = students.filter((s) => s.gender === 'ស្រី').length;
  const males = total - females;
  const femalePercent = total > 0 ? Math.round((females / total) * 100) : 0;
  
  const grade8Students = students.filter((s) => s.grade === 8);
  const scholarshipCount = students.filter((s) => s.scholarship || s.poorLevel !== 'គ្មាន').length;
  const newStudents = students.filter((s) => s.status === 'សិស្សថ្មី').length;

  const grades: GradeLevel[] = [7, 8, 9, 10, 11, 12];
  const gradeCounts = grades.map((g) => {
    const list = students.filter((s) => s.grade === g);
    const fCount = list.filter((s) => s.gender === 'ស្រី').length;
    return {
      grade: g,
      total: list.length,
      females: fCount,
      males: list.length - fCount,
    };
  });

  const recentStudents = [...students].slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* School Welcome & Official Data Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-blue-900/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 text-amber-300 text-xs font-semibold border border-amber-300/30 shadow-2xs backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>ឆ្នាំសិក្សា {schoolInfo.academicYear} · ប្រព័ន្ធ SIS ផ្លូវការ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-moul tracking-wide text-white leading-tight">
              {schoolInfo.name}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              ប្រព័ន្ធរដ្ឋបាលចុះឈ្មោះ និងគ្រប់គ្រងស្ថិតិសិស្សានុសិស្សពីថ្នាក់ទី ៧ ដល់ទី ១២ ស្របតាមគោលការណ៍ណែនាំស្តង់ដារបស់ក្រសួងអប់រំ យុវជន និងកីឡា។
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{schoolInfo.locationName} · {schoolInfo.department}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                <span className="text-amber-400 font-semibold">ចន្ទគតិ៖</span>
                <span>{schoolInfo.lunarDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigate('scanner')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-bold rounded-2xl transition shadow-md hover:shadow-lg text-xs sm:text-sm active:scale-98"
            >
              <Scan className="w-4 h-4" />
              <span>ស្គែនឯកសារអូតូ</span>
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-900/90 hover:bg-blue-800 text-white font-semibold rounded-2xl transition border border-white/15 text-xs sm:text-sm shadow-sm active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
            <button
              onClick={() => onNavigate('print')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition border border-white/15 text-xs sm:text-sm active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ពទម្រង់</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow effects */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">សិស្សសរុប</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">{toKhmerNum(total)}</span>
            <span className="text-xs text-slate-500 font-medium">នាក់</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-mono tabular-nums">
            <span>ប្រុស៖ <strong className="text-blue-800 font-bold">{toKhmerNum(males)}</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>ស្រី៖ <strong className="text-rose-600 font-bold">{toKhmerNum(females)}</strong></span>
          </div>
        </div>

        {/* Female Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">សិស្សស្រី</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 tracking-tight font-mono tabular-nums">{toKhmerNum(females)}</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70 font-mono tabular-nums">
              {toKhmerNum(femalePercent)}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
            សមាមាត្រសិស្សស្រីក្នុងសាលា
          </div>
        </div>

        {/* Grade 8 Focus Card */}
        <div 
          onClick={() => onNavigate('students', 8)}
          className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl p-5 border-2 border-amber-300/80 shadow-2xs hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">សម្រាប់ថ្នាក់ទី ៨</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950 tracking-tight font-mono tabular-nums">{toKhmerNum(grade8Students.length)}</span>
            <span className="text-xs text-amber-800 font-semibold">នាក់ (ថ្នាក់គោលដៅ)</span>
          </div>
          <div className="mt-3 text-xs text-amber-900 flex items-center justify-between border-t border-amber-200/60 pt-2">
            <span className="font-mono tabular-nums">ស្រី {toKhmerNum(grade8Students.filter(s => s.gender === 'ស្រី').length)} នាក់</span>
            <span className="text-blue-900 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              មើលបញ្ជី <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Scholarships & IDPoor */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">សមធម៌ / អាហារូបករណ៍</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700 tracking-tight font-mono tabular-nums">{toKhmerNum(scholarshipCount)}</span>
            <span className="text-xs text-slate-500 font-medium">នាក់</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
            សិស្សក្រីក្រ ឬ ទទួលបានជំនួយ
          </div>
        </div>
      </div>

      {/* Smart Document Scanner Spotlight */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 border border-blue-800 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center shrink-0 shadow-lg">
            <Scan className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black tracking-wide uppercase shadow-2xs">
                AI OCR Smart Scanner
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white font-kantumruy">
                ស្គែនឯកសារសិស្ស និងចាត់ថ្នាក់ចូល File តាមកម្រិតថ្នាក់ស្វ័យប្រវត្តិ
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              គ្រាន់តែថតរូប ឬបញ្ចូលឯកសារ (សំបុត្រកំណើត វិញ្ញាបនបត្របឋម សៀវភៅតាមដាន) — ប្រព័ន្ធ AI នឹងអានទិន្នន័យ និងតម្រៀបចូលក្នុងថត File ថ្នាក់ទី ៧ ដល់ទី ១២ ដោយស្វ័យប្រវត្តិ!
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl text-xs font-bold shadow-md transition-all relative z-10 active:scale-95"
        >
          <FolderOpen className="w-4 h-4" />
          <span>បើកកន្លែងស្គែន & មើល File ថ្នាក់</span>
        </button>

        <div className="absolute right-0 top-0 w-64 h-full bg-white/5 skew-x-12 pointer-events-none" />
      </div>

      {/* Grade Breakdown Cards (Grade 7 to 12) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-800" />
              <span>ស្ថិតិសិស្សតាមកម្រិតថ្នាក់ (ថ្នាក់ទី ៧ ដល់ ថ្នាក់ទី ១២)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ចុចលើកាតថ្នាក់នីមួយៗដើម្បីចូលមើល ឬកែប្រែបញ្ជីរាយនាមសិស្សផ្ទាល់
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition border border-slate-200 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ទាញយក Excel / CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gradeCounts.map((item) => {
            const isHighlighted = item.grade === 8;
            return (
              <div
                key={item.grade}
                onClick={() => onNavigate('students', item.grade)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  isHighlighted 
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50/60 to-orange-50/30 ring-1 ring-amber-300' 
                    : 'border-slate-200/90 hover:border-blue-400 bg-slate-50/40 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-moul text-blue-950 text-sm">
                      ថ្នាក់ទី {toKhmerNum(item.grade)}
                    </span>
                    {isHighlighted && (
                      <span className="text-[10px] font-black bg-amber-400 text-blue-950 px-2 py-0.5 rounded-full shadow-2xs">
                        ថ្នាក់គោលដៅ
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-slate-900 font-mono tabular-nums">
                    {toKhmerNum(item.total)} <span className="text-xs font-normal text-slate-500 font-sans">នាក់</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden flex shadow-inner">
                  <div 
                    className="bg-blue-800 h-2.5 transition-all" 
                    style={{ width: `${item.total > 0 ? (item.males / item.total) * 100 : 0}%` }}
                    title={`ប្រុស: ${item.males}`}
                  />
                  <div 
                    className="bg-rose-500 h-2.5 transition-all" 
                    style={{ width: `${item.total > 0 ? (item.females / item.total) * 100 : 0}%` }}
                    title={`ស្រី: ${item.females}`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5 font-mono tabular-nums">
                  <span>ប្រុស៖ <strong className="text-blue-900 font-bold">{toKhmerNum(item.males)}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>ស្រី៖ <strong className="text-rose-600 font-bold">{toKhmerNum(item.females)}</strong></span>
                  <span className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5 font-sans ml-auto">
                    លម្អិត &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Registrations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registered Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                សិស្សទើបចុះឈ្មោះថ្មីៗ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ការចុះឈ្មោះចុងក្រោយបំផុតក្នុងប្រព័ន្ធ SIS
              </p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>មើលទាំងអស់ ({toKhmerNum(total)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">អត្តលេខ</th>
                  <th className="py-3 px-3">គោត្តនាម-នាម</th>
                  <th className="py-3 px-3 text-center">ភេទ</th>
                  <th className="py-3 px-3">ថ្នាក់</th>
                  <th className="py-3 px-3">ស្ថានភាព</th>
                  <th className="py-3 px-3 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-slate-700 font-bold tabular-nums">
                      {st.studentCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{st.khmerName}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{st.latinName}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        st.gender === 'ស្រី' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {st.gender}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 text-xs">ថ្នាក់ទី {toKhmerNum(st.grade)}</span>
                      <span className="text-xs text-slate-500 ml-1">({st.classroom})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs text-slate-600 font-medium">{st.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('students')}
                        className="text-xs text-blue-900 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
                      >
                        ព័ត៌មាន
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official School Summary Card */}
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ព័ត៌មានរដ្ឋបាលវិទ្យាល័យ
              </h3>
              <p className="text-[11px] text-slate-400">ទិន្នន័យគ្រឹះស្ថានសិក្សាផ្លូវការ</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
            <div className="pt-2 flex justify-between items-center">
              <span className="text-slate-500">ឈ្មោះសាលា៖</span>
              <strong className="text-slate-900">{schoolInfo.name}</strong>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-slate-500">ថ្នាក់គោលដៅ៖</span>
              <strong className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">ថ្នាក់ទី ៨ (និងទី ៧-១២)</strong>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <span className="text-slate-500">ឆ្នាំសិក្សា៖</span>
              <strong className="text-slate-900 font-mono tabular-nums">{schoolInfo.academicYear}</strong>
            </div>
            <div className="pt-2">
              <span className="text-slate-500 block mb-1">កាលបរិច្ឆេទចន្ទគតិ៖</span>
              <div className="text-slate-800 font-medium bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 text-[11px]">
                {schoolInfo.lunarDate}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-slate-500 block mb-1">កាលបរិច្ឆេទសូរ្យគតិ៖</span>
              <div className="text-slate-800 font-medium bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 text-[11px]">
                {schoolInfo.locationName}, {schoolInfo.solarDate}
              </div>
            </div>
            <div className="pt-2 flex justify-between items-start gap-2">
              <span className="text-slate-500 shrink-0">ទីតាំងវិទ្យាល័យ៖</span>
              <span className="text-slate-800 text-right leading-tight">{schoolInfo.address}</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => onNavigate('settings')}
              className="w-full py-2.5 px-3 text-xs font-bold text-blue-900 bg-blue-50/90 hover:bg-blue-100 rounded-xl transition border border-blue-200 text-center shadow-2xs active:scale-98"
            >
              កែប្រែទិន្នន័យរដ្ឋបាលសាលា
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
