'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  IdCard, 
  Table, 
  Check, 
  ChevronDown,
  Download,
  School,
  Share2
} from 'lucide-react';
import { Student, SchoolInfo, GradeLevel } from '@/types/student';
import { toKhmerNum, formatKhmerDate, calculateBMI } from '@/lib/khmer-utils';

interface PrintFormsProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  defaultGrade?: GradeLevel;
  selectedStudentForCard?: Student | null;
}

export const PrintForms: React.FC<PrintFormsProps> = ({
  students,
  schoolInfo,
  defaultGrade = 8,
  selectedStudentForCard,
}) => {
  const [formType, setFormType] = useState<'roster' | 'idcard' | 'application' | 'summary'>('roster');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>(defaultGrade);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [singleStudent, setSingleStudent] = useState<Student | null>(
    selectedStudentForCard || (students.length > 0 ? students[0] : null)
  );

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Filter students for roster
  const filteredStudents = students.filter((s) => {
    if (selectedGrade !== 'all' && s.grade !== selectedGrade) return false;
    if (selectedClassroom !== 'all' && s.classroom !== selectedClassroom) return false;
    return true;
  });

  const availableClassrooms = Array.from(
    new Set(
      (selectedGrade === 'all' ? students : students.filter((s) => s.grade === selectedGrade)).map(
        (s) => s.classroom
      )
    )
  ).sort();

  const totalCount = filteredStudents.length;
  const femaleCount = filteredStudents.filter((s) => s.gender === 'ស្រី').length;

  return (
    <div className="space-y-6">
      {/* Control Toolbar (Hidden during print) */}
      <div className="no-print bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-900" />
              <span>បោះពុម្ពទម្រង់រដ្ឋបាលផ្លូវការ (MoEYS Standard)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ជ្រើសរើសទម្រង់ដែលលោកគ្រូ-អ្នកគ្រូចង់បោះពុម្ពជាក្រដាស A4 ផ្លូវការ
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>បោះពុម្ពឥឡូវនេះ (Ctrl + P)</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setFormType('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              formType === 'roster'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ១. តារាងបញ្ជីរាយនាមសិស្សផ្លូវការ
          </button>
          <button
            onClick={() => setFormType('idcard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              formType === 'idcard'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ២. ប័ណ្ណសម្គាល់ខ្លួនសិស្ស (កាតសិស្ស)
          </button>
          <button
            onClick={() => setFormType('application')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              formType === 'application'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ៣. ពាក្យសុំចុះឈ្មោះចូលរៀន
          </button>
          <button
            onClick={() => setFormType('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              formType === 'summary'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ៤. ស្ថិតិសិស្សទូទាំងសាលា
          </button>
        </div>

        {/* Filters according to Form Type */}
        {formType === 'roster' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="font-semibold text-slate-600">ជ្រើសរើសទិន្នន័យបញ្ជី៖</span>
            <select
              value={selectedGrade}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGrade(val === 'all' ? 'all' : (Number(val) as GradeLevel));
                setSelectedClassroom('all');
              }}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-900"
            >
              <option value="all">គ្រប់កម្រិតថ្នាក់ (៧-១២)</option>
              <option value="7">ថ្នាក់ទី ៧</option>
              <option value="8">ថ្នាក់ទី ៨ (ថ្នាក់គោលដៅ)</option>
              <option value="9">ថ្នាក់ទី ៩</option>
              <option value="10">ថ្នាក់ទី ១០</option>
              <option value="11">ថ្នាក់ទី ១១</option>
              <option value="12">ថ្នាក់ទី ១២</option>
            </select>

            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">បន្ទប់/ថ្នាក់ទាំងអស់</option>
              {availableClassrooms.map((c) => (
                <option key={c} value={c}>
                  បន្ទប់ {c}
                </option>
              ))}
            </select>

            <span className="text-slate-500">
              (សរុប {toKhmerNum(totalCount)} នាក់, ស្រី {toKhmerNum(femaleCount)} នាក់)
            </span>
          </div>
        )}

        {(formType === 'idcard' || formType === 'application') && (
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="font-semibold text-slate-600">ជ្រើសរើសសិស្ស៖</span>
            <select
              value={singleStudent?.id || ''}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) setSingleStudent(found);
              }}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-900 max-w-sm"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} - {s.khmerName} ({s.latinName}) - ថ្នាក់ទី {toKhmerNum(s.grade)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Printable Paper Preview Container */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-md print-container">
        {/* ============================================================== */}
        {/* FORM 1: OFFICIAL STUDENT ROSTER (តារាងបញ្ជីរាយនាមសិស្សផ្លូវការ) */}
        {/* ============================================================== */}
        {formType === 'roster' && (
          <div className="space-y-6 text-black font-kantumruy">
            {/* MoEYS Official Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
              <div className="text-left space-y-1">
                <div className="font-bold text-sm">{schoolInfo.ministry}</div>
                <div className="font-medium text-xs">{schoolInfo.department}</div>
                <div className="font-medium text-xs">{schoolInfo.office}</div>
                <div className="font-moul text-sm text-blue-950 mt-1">{schoolInfo.name}</div>
              </div>

              <div className="text-center sm:text-right space-y-1 self-center sm:self-auto">
                <div className="font-moul text-sm text-amber-900">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div className="font-moul text-xs text-amber-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div className="w-24 h-0.5 bg-amber-800 mx-auto sm:ml-auto sm:mr-0 mt-1"></div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1 my-4">
              <h1 className="font-moul text-lg sm:text-xl text-slate-900">
                បញ្ជីរាយនាមសិស្សានុសិស្ស
              </h1>
              <div className="font-bold text-sm text-slate-800">
                {selectedGrade === 'all'
                  ? 'គ្រប់កម្រិតថ្នាក់ (៧-១២)'
                  : `ថ្នាក់ទី ${toKhmerNum(selectedGrade)} ${
                      selectedClassroom !== 'all' ? `(បន្ទប់ ${selectedClassroom})` : ''
                    }`}
                {' · '}ឆ្នាំសិក្សា {schoolInfo.academicYear}
              </div>
            </div>

            {/* Official Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-black">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-black py-2 px-1 w-8">ល.រ</th>
                    <th className="border border-black py-2 px-1 w-14">អត្តលេខ</th>
                    <th className="border border-black py-2 px-2">គោត្តនាម និង នាម</th>
                    <th className="border border-black py-2 px-2">ឈ្មោះជាឡាតាំង</th>
                    <th className="border border-black py-2 px-1 w-10">ភេទ</th>
                    <th className="border border-black py-2 px-2">ថ្ងៃខែឆ្នាំកំណើត</th>
                    <th className="border border-black py-2 px-1 w-12">ថ្នាក់</th>
                    <th className="border border-black py-2 px-2">ទីកន្លែងកំណើត</th>
                    <th className="border border-black py-2 px-2">ឈ្មោះឪពុក ឬ ម្តាយ</th>
                    <th className="border border-black py-2 px-2">អាសយដ្ឋានបច្ចុប្បន្ន</th>
                    <th className="border border-black py-2 px-1">សម្គាល់</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="border border-black py-6 text-center text-slate-500">
                        ពុំមានទិន្នន័យសិស្សក្នុងថ្នាក់នេះឡើយ។
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st, i) => (
                      <tr key={st.id} className="text-slate-900">
                        <td className="border border-black py-1.5 px-1 text-center font-medium">
                          {toKhmerNum(i + 1)}
                        </td>
                        <td className="border border-black py-1.5 px-1 font-mono text-center font-bold">
                          {st.studentCode}
                        </td>
                        <td className="border border-black py-1.5 px-2 font-bold whitespace-nowrap">
                          {st.khmerName}
                        </td>
                        <td className="border border-black py-1.5 px-2 font-sans text-[11px] uppercase tracking-wide">
                          {st.latinName}
                        </td>
                        <td className="border border-black py-1.5 px-1 text-center">
                          {st.gender}
                        </td>
                        <td className="border border-black py-1.5 px-2 text-[11px]">
                          {st.dobKhmer || formatKhmerDate(st.dob)}
                        </td>
                        <td className="border border-black py-1.5 px-1 text-center font-bold">
                          {toKhmerNum(st.grade)} ({st.classroom})
                        </td>
                        <td className="border border-black py-1.5 px-2 text-[11px] max-w-[120px] truncate">
                          {st.pobVillage ? `ភូមិ${st.pobVillage} ខេត្ត${st.pobProvince}` : st.pobProvince}
                        </td>
                        <td className="border border-black py-1.5 px-2 text-[11px]">
                          {st.fatherName || st.motherName || st.guardianName}
                        </td>
                        <td className="border border-black py-1.5 px-2 text-[11px] max-w-[140px] truncate">
                          {st.currentAddress}
                        </td>
                        <td className="border border-black py-1.5 px-1 text-center text-[10px]">
                          {st.scholarship ? 'អាហារូបករណ៍' : st.status !== 'ឡើងថ្នាក់' ? st.status : ''}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Statistics summary below table */}
            <div className="flex flex-wrap items-center justify-between text-xs font-semibold pt-2 border-b pb-3">
              <div>
                សិស្សសរុប៖ <strong>{toKhmerNum(totalCount)}</strong> នាក់
                {' · '}ស្រី៖ <strong>{toKhmerNum(femaleCount)}</strong> នាក់
                {' · '}ប្រុស៖ <strong>{toKhmerNum(totalCount - femaleCount)}</strong> នាក់
              </div>
              <div>
                សិស្សសមធម៌/អាហារូបករណ៍៖{' '}
                <strong>
                  {toKhmerNum(filteredStudents.filter((s) => s.scholarship || s.poorLevel !== 'គ្មាន').length)}
                </strong>{' '}
                នាក់
              </div>
            </div>

            {/* Official Signature Zone with specified dates */}
            <div className="grid grid-cols-2 gap-8 pt-6 print-break-inside-avoid text-xs">
              <div className="text-center space-y-1">
                <div className="font-bold">បានឃើញ និង ឯកភាព</div>
                <div className="text-slate-700">ស្គន់, {schoolInfo.solarDate}</div>
                <div className="font-moul pt-2 text-blue-950">នាយកវិទ្យាល័យ ហ៊ុន សែន ស្គន់</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">{schoolInfo.principalName}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-slate-700">{schoolInfo.lunarDate}</div>
                <div className="text-slate-700">
                  {schoolInfo.locationName}, {schoolInfo.solarDate}
                </div>
                <div className="font-moul pt-2 text-blue-950">គ្រូបន្ទុកថ្នាក់</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">ហត្ថលេខា និង ឈ្មោះ</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FORM 2: STUDENT ID CARD (ប័ណ្ណសម្គាល់ខ្លួនសិស្ស) */}
        {/* ============================================================== */}
        {formType === 'idcard' && singleStudent && (
          <div className="space-y-8 max-w-md mx-auto text-black font-kantumruy">
            <div className="text-center text-xs text-slate-500 no-print mb-4">
              គំរូប័ណ្ណសម្គាល់ខ្លួនសិស្ស (សន្លឹកមុខ និង សន្លឹកក្រោយ)
            </div>

            {/* Front of Card */}
            <div className="border-2 border-blue-900 rounded-2xl p-4 bg-gradient-to-b from-blue-50 via-white to-amber-50/40 shadow-md relative overflow-hidden">
              {/* Header */}
              <div className="text-center border-b border-blue-900/30 pb-2">
                <div className="font-moul text-[10px] text-blue-950 leading-tight">
                  {schoolInfo.ministry}
                </div>
                <div className="font-moul text-xs text-blue-900 leading-tight">
                  {schoolInfo.name}
                </div>
                <div className="font-bold text-[10px] text-amber-800 uppercase tracking-wider mt-0.5">
                  ប័ណ្ណសម្គាល់ខ្លួនសិស្ស / STUDENT ID CARD
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-4 items-center mt-4">
                <div className="shrink-0 text-center">
                  <img
                    src={singleStudent.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                    alt={singleStudent.khmerName}
                    className="w-20 h-24 rounded-lg object-cover border-2 border-blue-900 shadow-xs"
                  />
                  <div className="font-mono text-[10px] font-bold text-slate-800 mt-1">
                    ID: {singleStudent.studentCode}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-800 flex-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">គោត្តនាម-នាម / Name:</span>
                    <strong className="text-sm font-bold text-blue-950 font-kantumruy">
                      {singleStudent.khmerName}
                    </strong>
                    <div className="text-[11px] font-bold text-slate-600 font-sans tracking-wide uppercase">
                      {singleStudent.latinName}
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] pt-1">
                    <span>ភេទ៖ <strong>{singleStudent.gender}</strong></span>
                    <span>ថ្នាក់ទី៖ <strong className="text-blue-900">{toKhmerNum(singleStudent.grade)} ({singleStudent.classroom})</strong></span>
                  </div>

                  <div className="text-[11px]">
                    <span>ថ្ងៃកំណើត៖ <strong>{singleStudent.dobKhmer || singleStudent.dob}</strong></span>
                  </div>

                  <div className="text-[10px] text-slate-600">
                    ឆ្នាំសិក្សា៖ <strong>{schoolInfo.academicYear}</strong>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                <span>សុពលភាព៖ ២០២៦ - ២០២៧</span>
                <span className="font-bold text-blue-900">វិទ្យាល័យ ហ៊ុន សែន ស្គន់</span>
              </div>
            </div>

            {/* Back of Card */}
            <div className="border-2 border-slate-400 rounded-2xl p-4 bg-slate-50 shadow-sm space-y-2 text-xs text-slate-700">
              <div className="text-center font-bold border-b pb-1 text-[11px] text-slate-800">
                បទបញ្ជាផ្ទៃក្នុង និង ការប្រើប្រាស់ប័ណ្ណ
              </div>
              <ul className="list-disc pl-4 text-[10px] space-y-1 text-slate-600">
                <li>សិស្សត្រូវពាក់ប័ណ្ណនេះជានិច្ចពេលចូលរៀនក្នុងវិទ្យាល័យ។</li>
                <li>ហាមកែបន្លំ ឬ ឱ្យអ្នកដទៃប្រើប្រាស់ជំនួសជាដាច់ខាត។</li>
                <li>ប្រសិនបើបាត់ សូមរាយការណ៍ជូនគណៈគ្រប់គ្រងវិទ្យាល័យជាបន្ទាន់។</li>
                <li>អាសយដ្ឋាន៖ {schoolInfo.address}</li>
                <li>លេខទូរស័ព្ទទំនាក់ទំនង៖ {schoolInfo.phone}</li>
              </ul>

              <div className="pt-2 text-center text-[10px]">
                <div className="text-slate-600">{schoolInfo.solarDate}</div>
                <div className="font-bold text-blue-950">នាយកវិទ្យាល័យ ហ៊ុន សែន ស្គន់</div>
                <div className="h-10"></div>
                <div className="font-semibold text-slate-700">ហត្ថលេខា និង ត្រា</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FORM 3: STUDENT ADMISSION APPLICATION (ពាក្យសុំចុះឈ្មោះចូលរៀន) */}
        {/* ============================================================== */}
        {formType === 'application' && singleStudent && (
          <div className="space-y-6 text-black font-kantumruy">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="space-y-1 text-xs">
                <div className="font-bold">{schoolInfo.ministry}</div>
                <div>{schoolInfo.department}</div>
                <div className="font-moul text-sm text-blue-950 mt-1">{schoolInfo.name}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-moul text-sm text-amber-900">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div className="font-moul text-xs text-amber-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div className="w-20 h-0.5 bg-amber-800 mx-auto mt-1"></div>
              </div>

              {/* Photo Box */}
              <div className="w-20 h-24 border border-dashed border-slate-400 flex flex-col items-center justify-center text-[9px] text-slate-400 rounded">
                {singleStudent.photoUrl ? (
                  <img
                    src={singleStudent.photoUrl}
                    alt={singleStudent.khmerName}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span>រូបថត ៤x៦</span>
                )}
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1 my-3">
              <h1 className="font-moul text-base sm:text-lg text-slate-900">
                ពាក្យសុំចុះឈ្មោះចូលរៀន
              </h1>
              <div className="text-xs font-bold text-slate-700">
                សម្រាប់ថ្នាក់ទី {toKhmerNum(singleStudent.grade)} ({singleStudent.classroom}) · ឆ្នាំសិក្សា {schoolInfo.academicYear}
              </div>
            </div>

            {/* Application Biodata Form */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ៖ <strong className="text-sm font-bold">{singleStudent.khmerName}</strong>
                </div>
                <div>
                  អក្សរឡាតាំង៖ <strong className="font-sans text-sm">{singleStudent.latinName}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>ភេទ៖ <strong>{singleStudent.gender}</strong></div>
                <div>សញ្ជាតិ៖ <strong>ខ្មែរ</strong></div>
                <div>អត្តលេខសិស្ស៖ <strong className="font-mono">{singleStudent.studentCode}</strong></div>
              </div>

              <div>
                កើតនៅថ្ងៃទី៖ <strong>{singleStudent.dobKhmer || formatKhmerDate(singleStudent.dob)}</strong> (គ.ស. {singleStudent.dob})
              </div>

              <div>
                ទីកន្លែងកំណើត៖ ភូមិ<strong>{singleStudent.pobVillage}</strong> ឃុំ/សង្កាត់<strong>{singleStudent.pobCommune}</strong> ស្រុក/ខណ្ឌ<strong>{singleStudent.pobDistrict}</strong> ខេត្ត/រាជធានី<strong>{singleStudent.pobProvince}</strong>
              </div>

              <div>
                អាសយដ្ឋានបច្ចុប្បន្ន៖ <strong>{singleStudent.currentAddress}</strong>
              </div>

              <div className="border-t pt-3">
                <span className="font-bold block mb-1">ព័ត៌មានឪពុកម្តាយ ឬ អាណាព្យាបាល៖</span>
                <div className="grid grid-cols-2 gap-3 pl-2">
                  <div>
                    - ឪពុកឈ្មោះ៖ <strong>{singleStudent.fatherName || 'ពុំមាន'}</strong> (មុខរបរ៖ {singleStudent.fatherJob || 'គ្មាន'}, ទូរស័ព្ទ៖ {singleStudent.fatherPhone || 'គ្មាន'})
                  </div>
                  <div>
                    - ម្តាយឈ្មោះ៖ <strong>{singleStudent.motherName || 'ពុំមាន'}</strong> (មុខរបរ៖ {singleStudent.motherJob || 'គ្មាន'}, ទូរស័ព្ទ៖ {singleStudent.motherPhone || 'គ្មាន'})
                  </div>
                </div>
                <div className="pl-2 pt-1">
                  - អាណាព្យាបាលសព្វថ្ងៃ៖ <strong>{singleStudent.guardianName}</strong> (ទូរស័ព្ទទំនាក់ទំនង៖ <strong>{singleStudent.guardianPhone}</strong>)
                </div>
              </div>

              {/* Health and Family Socio-Economic Status Box */}
              <div className="border-t pt-3 space-y-2">
                <span className="font-bold block text-slate-900">
                  ព័ត៌មានសុខភាព កាយសម្បទា និងស្ថានភាពគ្រួសារសិស្ស (MoEYS Form)៖
                </span>
                <div className="grid grid-cols-2 gap-3 pl-2 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <div>
                      • ទម្ងន់៖ <strong>{singleStudent.weight ? `${toKhmerNum(singleStudent.weight)} គ.ក` : 'មិនបញ្ជាក់'}</strong> | កម្ពស់៖ <strong>{singleStudent.height ? `${toKhmerNum(singleStudent.height)} ស.ម` : 'មិនបញ្ជាក់'}</strong>
                      {singleStudent.weight && singleStudent.height && (
                        (() => {
                          const bmi = calculateBMI(singleStudent.weight, singleStudent.height);
                          return bmi ? <span className="ml-1 text-slate-600">(BMI: {toKhmerNum(bmi.bmi)} - {bmi.label})</span> : null;
                        })()
                      )}
                    </div>
                    <div>
                      • កម្រិតគំហើញ (៣កម្រិត)៖ <strong>{singleStudent.visionLevel || 'ធម្មតា'}</strong>
                    </div>
                    <div>
                      • កម្រិតស្ដាប់ (៣កម្រិត)៖ <strong>{singleStudent.hearingLevel || 'ធម្មតា'}</strong>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      • ពិការភាពអវយវៈ៖ <strong>{singleStudent.limbDisability || (singleStudent.hasDisability ? (singleStudent.disabilityInfo || 'មានពិការភាព') : 'គ្មាន')}</strong>
                    </div>
                    <div>
                      • ជំងឺប្រចាំកាយ៖ <strong>{singleStudent.chronicDisease || 'គ្មាន'}</strong>
                    </div>
                    <div>
                      • ស្ថានភាពគ្រួសារ (៣កម្រិត)៖ <strong className="text-blue-900">{singleStudent.familyStatusLevel || 'ជីវភាពមធ្យម'}</strong> ({singleStudent.poorLevel})
                    </div>
                  </div>
                </div>
              </div>

              {/* Commitment */}
              <div className="border-t pt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="block text-slate-800 mb-1">ការសន្យារបស់សាមីខ្លួន និង អាណាព្យាបាល៖</strong>
                <p className="text-slate-600 text-[11px] leading-normal text-justify">
                  ខ្ញុំបាទ/នាងខ្ញុំ និង អាណាព្យាបាល សូមសន្យាចំពោះមុខគណៈគ្រប់គ្រងវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ថា នឹងខិតខំរៀនសូត្រ គោរពវិន័យ បទបញ្ជាផ្ទៃក្នុងរបស់សាលា និងច្បាប់រដ្ឋឱ្យបានខ្ជាប់ខ្ជួន មិនបង្កជម្លោះ ឬ ធ្វើឱ្យប៉ះពាល់ដល់កិត្តិយសវិទ្យាល័យឡើយ។ ប្រសិនបើមានការខុសឆ្គង ខ្ញុំបាទ/នាងខ្ញុំ សូមទទួលខុសត្រូវទាំងស្រុងចំពោះមុខគណៈកម្មការវិន័យ។
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-6 print-break-inside-avoid text-xs">
              <div className="text-center space-y-1">
                <div className="font-bold">ហត្ថលេខាអាណាព្យាបាល</div>
                <div className="text-slate-500">ស្គន់, {schoolInfo.solarDate}</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">{singleStudent.guardianName}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-slate-600">{schoolInfo.lunarDate}</div>
                <div className="text-slate-600">
                  {schoolInfo.locationName}, {schoolInfo.solarDate}
                </div>
                <div className="font-bold">ហត្ថលេខាសាមីខ្លួនសិស្ស</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">{singleStudent.khmerName}</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FORM 4: OVERALL SCHOOL ENROLLMENT SUMMARY (ស្ថិតិសិស្សទូទាំងសាលា) */}
        {/* ============================================================== */}
        {formType === 'summary' && (
          <div className="space-y-6 text-black font-kantumruy">
            {/* MoEYS Official Letterhead */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="text-left space-y-1 text-xs">
                <div className="font-bold">{schoolInfo.ministry}</div>
                <div>{schoolInfo.department}</div>
                <div className="font-moul text-sm text-blue-950 mt-1">{schoolInfo.name}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-moul text-sm text-amber-900">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div className="font-moul text-xs text-amber-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div className="w-20 h-0.5 bg-amber-800 mx-auto mt-1"></div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1 my-4">
              <h1 className="font-moul text-lg text-slate-900">
                តារាងស្ថិតិសិស្សចុះឈ្មោះចូលរៀនតាមកម្រិតថ្នាក់
              </h1>
              <div className="font-bold text-sm text-slate-800">
                ពីថ្នាក់ទី ៧ ដល់ទី ១២ · ឆ្នាំសិក្សា {schoolInfo.academicYear}
              </div>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse border border-black">
                <thead>
                  <tr className="bg-slate-100 font-bold">
                    <th className="border border-black py-2.5 px-2">កម្រិតថ្នាក់</th>
                    <th className="border border-black py-2.5 px-2">សរុប</th>
                    <th className="border border-black py-2.5 px-2">សិស្សស្រី</th>
                    <th className="border border-black py-2.5 px-2">សិស្សប្រុស</th>
                    <th className="border border-black py-2.5 px-2">ភាគរយស្រី</th>
                    <th className="border border-black py-2.5 px-2">សិស្សថ្មី</th>
                    <th className="border border-black py-2.5 px-2">អាហារូបករណ៍</th>
                    <th className="border border-black py-2.5 px-2">សមធម៌ក្រីក្រ</th>
                  </tr>
                </thead>
                <tbody>
                  {[7, 8, 9, 10, 11, 12].map((g) => {
                    const list = students.filter((s) => s.grade === g);
                    const fCount = list.filter((s) => s.gender === 'ស្រី').length;
                    const mCount = list.length - fCount;
                    const pct = list.length > 0 ? Math.round((fCount / list.length) * 100) : 0;
                    const newCount = list.filter((s) => s.status === 'សិស្សថ្មី').length;
                    const schol = list.filter((s) => s.scholarship).length;
                    const poor = list.filter((s) => s.poorLevel !== 'គ្មាន').length;

                    return (
                      <tr key={g} className={g === 8 ? 'bg-amber-50 font-bold' : ''}>
                        <td className="border border-black py-2 px-3 text-left font-bold">
                          ថ្នាក់ទី {toKhmerNum(g)} {g === 8 ? '(ថ្នាក់គោលដៅ)' : ''}
                        </td>
                        <td className="border border-black py-2 px-2 font-bold">{toKhmerNum(list.length)}</td>
                        <td className="border border-black py-2 px-2 text-pink-700">{toKhmerNum(fCount)}</td>
                        <td className="border border-black py-2 px-2 text-blue-700">{toKhmerNum(mCount)}</td>
                        <td className="border border-black py-2 px-2">{toKhmerNum(pct)}%</td>
                        <td className="border border-black py-2 px-2">{toKhmerNum(newCount)}</td>
                        <td className="border border-black py-2 px-2">{toKhmerNum(schol)}</td>
                        <td className="border border-black py-2 px-2">{toKhmerNum(poor)}</td>
                      </tr>
                    );
                  })}
                  {/* Total Row */}
                  <tr className="bg-slate-200 font-bold text-sm">
                    <td className="border border-black py-2.5 px-3 text-left font-moul">សរុបរួម</td>
                    <td className="border border-black py-2.5 px-2">{toKhmerNum(students.length)}</td>
                    <td className="border border-black py-2.5 px-2 text-pink-700">
                      {toKhmerNum(students.filter((s) => s.gender === 'ស្រី').length)}
                    </td>
                    <td className="border border-black py-2.5 px-2 text-blue-700">
                      {toKhmerNum(students.filter((s) => s.gender === 'ប្រុស').length)}
                    </td>
                    <td className="border border-black py-2.5 px-2">
                      {toKhmerNum(
                        students.length > 0
                          ? Math.round(
                              (students.filter((s) => s.gender === 'ស្រី').length / students.length) * 100
                            )
                          : 0
                      )}%
                    </td>
                    <td className="border border-black py-2.5 px-2">
                      {toKhmerNum(students.filter((s) => s.status === 'សិស្សថ្មី').length)}
                    </td>
                    <td className="border border-black py-2.5 px-2">
                      {toKhmerNum(students.filter((s) => s.scholarship).length)}
                    </td>
                    <td className="border border-black py-2.5 px-2">
                      {toKhmerNum(students.filter((s) => s.poorLevel !== 'គ្មាន').length)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 print-break-inside-avoid text-xs">
              <div className="text-center space-y-1">
                <div className="font-bold">បានឃើញ និង ឯកភាព</div>
                <div className="text-slate-700">ស្គន់, {schoolInfo.solarDate}</div>
                <div className="font-moul pt-2 text-blue-950">នាយកវិទ្យាល័យ ហ៊ុន សែន ស្គន់</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">{schoolInfo.principalName}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-slate-700">{schoolInfo.lunarDate}</div>
                <div className="text-slate-700">
                  {schoolInfo.locationName}, {schoolInfo.solarDate}
                </div>
                <div className="font-moul pt-2 text-blue-950">អ្នករៀបចំស្ថិតិ</div>
                <div className="h-20"></div>
                <div className="font-bold text-slate-800">ហត្ថលេខា និង ឈ្មោះ</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
