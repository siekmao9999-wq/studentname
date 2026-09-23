'use client';

import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  Award, 
  MapPin, 
  Calendar, 
  FileSpreadsheet,
  GraduationCap,
  HeartPulse,
  Eye,
  Ear,
  Scale,
  Home,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Student, SchoolInfo, GradeLevel } from '@/types/student';
import { toKhmerNum, calculateBMI } from '@/lib/khmer-utils';

interface StatisticsViewProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onExportCSV: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  students,
  schoolInfo,
  onExportCSV,
}) => {
  const total = students.length;
  const females = students.filter((s) => s.gender === 'ស្រី').length;
  const males = total - females;

  const grades: GradeLevel[] = [7, 8, 9, 10, 11, 12];
  const gradeStats = grades.map((g) => {
    const list = students.filter((s) => s.grade === g);
    const fCount = list.filter((s) => s.gender === 'ស្រី').length;
    const poorCount = list.filter((s) => s.poorLevel !== 'គ្មាន').length;
    const scholCount = list.filter((s) => s.scholarship).length;
    return {
      grade: g,
      total: list.length,
      females: fCount,
      males: list.length - fCount,
      poor: poorCount,
      scholarship: scholCount,
      pctOfTotal: total > 0 ? Math.round((list.length / total) * 100) : 0,
    };
  });

  // Commune / Village breakdown
  const communeCounts = students.reduce((acc, st) => {
    const com = st.pobCommune || 'មិនបញ្ជាក់';
    acc[com] = (acc[com] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Track breakdown (Upper Secondary)
  const scienceCount = students.filter((s) => s.track === 'វិទ្យាសាស្ត្រ').length;
  const socialCount = students.filter((s) => s.track === 'វិទ្យាសាស្ត្រសង្គម').length;

  // Family Socio-Economic Status (3 Levels)
  const level1Count = students.filter(
    (s) => s.familyStatusLevel === 'ក្រីក្រកម្រិត១' || s.poorLevel === 'កម្រិត១ (ក្រីក្រខ្លាំង)'
  ).length;
  const level2Count = students.filter(
    (s) => s.familyStatusLevel === 'ក្រីក្រកម្រិត២' || s.poorLevel === 'កម្រិត២ (ក្រីក្រ)'
  ).length;
  const mediumCount = Math.max(0, total - level1Count - level2Count);

  // Vision 3 Levels
  const visionNormal = students.filter((s) => !s.visionLevel || s.visionLevel === 'ធម្មតា').length;
  const visionModerate = students.filter((s) => s.visionLevel === 'ខ្សោយមធ្យម').length;
  const visionSevere = students.filter((s) => s.visionLevel === 'ពិការ/ខ្សោយខ្លាំង').length;

  // Hearing 3 Levels
  const hearingNormal = students.filter((s) => !s.hearingLevel || s.hearingLevel === 'ធម្មតា').length;
  const hearingModerate = students.filter((s) => s.hearingLevel === 'ខ្សោយមធ្យម').length;
  const hearingSevere = students.filter((s) => s.hearingLevel === 'ពិការ/ខ្សោយខ្លាំង').length;

  // Physical Disability & Chronic Illness
  const limbDisabilityCount = students.filter((s) => s.limbDisability && s.limbDisability !== 'គ្មាន').length;
  const chronicDiseaseCount = students.filter((s) => s.chronicDisease && s.chronicDisease !== 'គ្មាន').length;

  // BMI calculations
  const studentsWithBmi = students.filter((s) => s.weight && s.height);
  const underweightCount = studentsWithBmi.filter((s) => {
    const bmi = calculateBMI(s.weight!, s.height!);
    return bmi && bmi.bmi < 18.5;
  }).length;
  const normalBmiCount = studentsWithBmi.filter((s) => {
    const bmi = calculateBMI(s.weight!, s.height!);
    return bmi && bmi.bmi >= 18.5 && bmi.bmi < 24.9;
  }).length;
  const overweightCount = studentsWithBmi.filter((s) => {
    const bmi = calculateBMI(s.weight!, s.height!);
    return bmi && bmi.bmi >= 24.9;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <span>ស្ថិតិ និង របាយការណ៍សិស្សានុសិស្សលម្អិត</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ទិន្នន័យវិភាគការចុះឈ្មោះសិស្ស ថ្នាក់ទី ៧ ដល់ ថ្នាក់ទី ១២ · ឆ្នាំសិក្សា {schoolInfo.academicYear}
          </p>
        </div>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>ទាញយករបាយការណ៍ជា Excel</span>
        </button>
      </div>

      {/* Grade Table Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-800" />
          <span>តារាងស្ថិតិតាមកម្រិតថ្នាក់ (ថ្នាក់ទី ៧ - ១២)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">កម្រិតថ្នាក់</th>
                <th className="py-3 px-3 text-center">សរុប</th>
                <th className="py-3 px-3 text-center">ស្រី</th>
                <th className="py-3 px-3 text-center">ប្រុស</th>
                <th className="py-3 px-3">សមាមាត្រក្នុងសាលា</th>
                <th className="py-3 px-3 text-center">អាហារូបករណ៍</th>
                <th className="py-3 px-3 text-center">ប័ណ្ណសមធម៌</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradeStats.map((item) => (
                <tr
                  key={item.grade}
                  className={`hover:bg-slate-50 transition ${
                    item.grade === 8 ? 'bg-amber-50/50 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ថ្នាក់ទី {toKhmerNum(item.grade)} {item.grade === 8 && '(ថ្នាក់គោលដៅ)'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {toKhmerNum(item.total)}
                  </td>
                  <td className="py-3 px-3 text-center text-pink-600 font-semibold">
                    {toKhmerNum(item.females)}
                  </td>
                  <td className="py-3 px-3 text-center text-blue-700 font-semibold">
                    {toKhmerNum(item.males)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-800 h-2 rounded-full"
                          style={{ width: `${item.pctOfTotal}%` }}
                        />
                      </div>
                      <span className="text-slate-500 font-medium">{toKhmerNum(item.pctOfTotal)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center text-emerald-700 font-semibold">
                    {toKhmerNum(item.scholarship)}
                  </td>
                  <td className="py-3 px-3 text-center text-amber-800 font-semibold">
                    {toKhmerNum(item.poor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stream Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-700" />
            <span>ការបែងចែកផ្នែកសិក្សា (ថ្នាក់ទី ១១ និង ១២)</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-950 text-xs">ផ្នែកវិទ្យាសាស្ត្រ (Science Stream)</span>
                <span className="font-bold text-blue-900">{toKhmerNum(scienceCount)} នាក់</span>
              </div>
              <p className="text-[11px] text-slate-500">គណិតវិទ្យា រូបវិទ្យា គីមីវិទ្យា ជីវវិទ្យា</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-950 text-xs">ផ្នែកវិទ្យាសាស្ត្រសង្គម (Social Stream)</span>
                <span className="font-bold text-amber-900">{toKhmerNum(socialCount)} នាក់</span>
              </div>
              <p className="text-[11px] text-slate-500">ប្រវត្តិវិទ្យា ភូមិវិទ្យា សីលធម៌-ពលរដ្ឋវិទ្យា អក្សរសាស្ត្រខ្មែរ</p>
            </div>
          </div>
        </div>

        {/* Origin Communes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>ប្រភពឃុំ/សង្កាត់របស់សិស្ស</span>
          </h3>

          <div className="space-y-2">
            {Object.entries(communeCounts).map(([commune, count]) => (
              <div key={commune} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="text-slate-700 font-medium">ឃុំ{commune}</span>
                <span className="font-bold text-slate-900">{toKhmerNum(count)} នាក់</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HEALTH & FAMILY SOCIO-ECONOMIC STATUS PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Socio-Economic Status (3 Levels) */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-600" />
              <span>ស្ថានភាពគ្រួសារសិស្ស (៣ កម្រិត - MoEYS)</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              សរុប {toKhmerNum(total)} នាក់
            </span>
          </div>

          <div className="space-y-3">
            {/* Level 1 */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-rose-950">ក្រីក្រកម្រិត ១ (ក្រីក្រខ្លាំង)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    អាហារូបករណ៍រដ្ឋ ១០០%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  សិស្សមកពីគ្រួសារងាយរងគ្រោះបំផុត ទទួលបានកញ្ចប់ឧបត្ថម្ភសម្ភារសិក្សា
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-rose-700">{toKhmerNum(level1Count)}</div>
                <div className="text-[10px] text-slate-500">
                  {total > 0 ? toKhmerNum(Math.round((level1Count / total) * 100)) : 0}%
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-amber-950">ក្រីក្រកម្រិត ២ (ក្រីក្រ)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    លើកលែងវិភាគទាន
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  សិស្សមកពីគ្រួសារមានប័ណ្ណសមធម៌កម្រិត២ ទទួលបានការគាំទ្រសិក្សា
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-700">{toKhmerNum(level2Count)}</div>
                <div className="text-[10px] text-slate-500">
                  {total > 0 ? toKhmerNum(Math.round((level2Count / total) * 100)) : 0}%
                </div>
              </div>
            </div>

            {/* Medium / Normal */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-emerald-950">ជីវភាពមធ្យម (ធម្មតា/សមរម្យ)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    ទូទៅ
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  សិស្សមកពីគ្រួសារមានជីវភាពធម្មតា សមរម្យ
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-700">{toKhmerNum(mediumCount)}</div>
                <div className="text-[10px] text-slate-500">
                  {total > 0 ? toKhmerNum(Math.round((mediumCount / total) * 100)) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Health & Physical Assessment */}
        <div className="bg-white rounded-2xl p-6 border border-blue-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <span>កាយសម្បទា និងសុខភាពសិស្ស (Health Status)</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900">
              សុខភាពសិក្សា
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Vision 3-Levels */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>គំហើញ (៣ កម្រិត)</span>
              </span>
              <div className="text-[11px] space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">ធម្មតា៖</span>
                  <span className="font-bold text-slate-800">{toKhmerNum(visionNormal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ខ្សោយមធ្យម (វ៉ែនតា)៖</span>
                  <span className="font-bold text-indigo-700">{toKhmerNum(visionModerate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ពិការ/ខ្សោយខ្លាំង៖</span>
                  <span className="font-bold text-rose-700">{toKhmerNum(visionSevere)}</span>
                </div>
              </div>
            </div>

            {/* Hearing 3-Levels */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Ear className="w-3.5 h-3.5 text-teal-600" />
                <span>សោតវិញ្ញាណ (៣ កម្រិត)</span>
              </span>
              <div className="text-[11px] space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">ធម្មតា (ឮច្បាស់)៖</span>
                  <span className="font-bold text-slate-800">{toKhmerNum(hearingNormal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ខ្សោយមធ្យម៖</span>
                  <span className="font-bold text-teal-700">{toKhmerNum(hearingModerate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ពិការ/ខ្សោយខ្លាំង៖</span>
                  <span className="font-bold text-rose-700">{toKhmerNum(hearingSevere)}</span>
                </div>
              </div>
            </div>

            {/* Limb Disability */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>ពិការភាពអវយវៈ</span>
              </span>
              <div className="pt-1">
                <div className="text-xl font-black text-amber-700">
                  {toKhmerNum(limbDisabilityCount)} <span className="text-xs font-normal text-slate-500">នាក់</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  ត្រូវការជម្រាល និងការសម្រួលបន្ទប់រៀនជាន់ផ្ទាល់ដី
                </p>
              </div>
            </div>

            {/* Chronic Disease */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                <span>ជំងឺប្រចាំកាយ</span>
              </span>
              <div className="pt-1">
                <div className="text-xl font-black text-rose-700">
                  {toKhmerNum(chronicDiseaseCount)} <span className="text-xs font-normal text-slate-500">នាក់</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  ហឺត, បេះដូង, អាឡែកស៊ី (បន្ទប់សុខភាពតាមដាន)
                </p>
              </div>
            </div>
          </div>

          {/* BMI Distribution */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-800" />
                <span>សន្ទស្សន៍ម៉ាសរាងកាយ (BMI Distribution)</span>
              </span>
              <span className="text-[10px] text-slate-500">
                បានវាស់ {toKhmerNum(studentsWithBmi.length)} នាក់
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">ស្គម (&lt;18.5)</div>
                <div className="text-sm font-bold text-amber-600">{toKhmerNum(underweightCount)} នាក់</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">សមរម្យ/ធម្មតា</div>
                <div className="text-sm font-bold text-emerald-700">{toKhmerNum(normalBmiCount)} នាក់</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500">លើសទម្ងន់ (&gt;24.9)</div>
                <div className="text-sm font-bold text-rose-600">{toKhmerNum(overweightCount)} នាក់</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
