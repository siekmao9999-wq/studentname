'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Printer, 
  Upload, 
  Image as ImageIcon,
  GraduationCap,
  Calendar,
  AlertCircle,
  HeartPulse,
  Eye,
  Ear,
  Activity,
  Scale,
  Ruler,
  Home,
  ShieldCheck,
  Check,
  Sparkles,
  UserCheck,
  IdCard,
  Phone,
  FileText
} from 'lucide-react';
import { 
  Student, 
  SchoolInfo, 
  GradeLevel, 
  Gender, 
  StudentStatus, 
  PoorLevel, 
  StudyTrack,
  VisionLevel,
  HearingLevel,
  FamilyStatusLevel
} from '@/types/student';
import { toKhmerNum, formatKhmerDate, calculateBMI } from '@/lib/khmer-utils';

interface RegistrationFormProps {
  schoolInfo: SchoolInfo;
  editingStudent?: Student | null;
  onSaveStudent: (student: Student) => void;
  onCancel?: () => void;
  onPrintApplicationForm: (student: Student) => void;
  onPrintStudentCard: (student: Student) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  schoolInfo,
  editingStudent,
  onSaveStudent,
  onCancel,
  onPrintApplicationForm,
  onPrintStudentCard,
}) => {
  const defaultCodeForGrade = (gr: number) => `${String(gr).padStart(2, '0')}08`;

  const [grade, setGrade] = useState<GradeLevel>(editingStudent ? editingStudent.grade : 8);
  const [classroom, setClassroom] = useState<string>(editingStudent ? editingStudent.classroom : '8A');
  const [studentCode, setStudentCode] = useState<string>(
    editingStudent ? editingStudent.studentCode : defaultCodeForGrade(8)
  );
  const [khmerName, setKhmerName] = useState<string>(editingStudent ? editingStudent.khmerName : '');
  const [latinName, setLatinName] = useState<string>(editingStudent ? editingStudent.latinName : '');
  const [gender, setGender] = useState<Gender>(editingStudent ? editingStudent.gender : 'ប្រុស');
  const [dob, setDob] = useState<string>(editingStudent ? editingStudent.dob : '2012-05-15');
  const [dobKhmer, setDobKhmer] = useState<string>(
    editingStudent ? editingStudent.dobKhmer || formatKhmerDate(editingStudent.dob) : formatKhmerDate('2012-05-15')
  );
  
  const [pobVillage, setPobVillage] = useState<string>(editingStudent ? editingStudent.pobVillage : 'ស្គន់');
  const [pobCommune, setPobCommune] = useState<string>(editingStudent ? editingStudent.pobCommune : 'សូទិព្វ');
  const [pobDistrict, setPobDistrict] = useState<string>(editingStudent ? editingStudent.pobDistrict : 'ជើងព្រៃ');
  const [pobProvince, setPobProvince] = useState<string>(editingStudent ? editingStudent.pobProvince : 'កំពង់ចាម');
  const [currentAddress, setCurrentAddress] = useState<string>(
    editingStudent ? editingStudent.currentAddress : 'ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម'
  );

  const [track, setTrack] = useState<StudyTrack>(editingStudent ? editingStudent.track : 'ទូទៅ');
  const [status, setStatus] = useState<StudentStatus>(editingStudent ? editingStudent.status : 'សិស្សថ្មី');
  const [scholarship, setScholarship] = useState<boolean>(editingStudent ? editingStudent.scholarship : false);
  const [poorLevel, setPoorLevel] = useState<PoorLevel>(editingStudent ? editingStudent.poorLevel : 'គ្មាន');
  const [hasDisability, setHasDisability] = useState<boolean>(editingStudent ? editingStudent.hasDisability : false);
  const [disabilityInfo, setDisabilityInfo] = useState<string>(editingStudent?.disabilityInfo || '');

  // ព័ត៌មានសុខភាព និងកាយសម្បទាសិស្ស
  const [weight, setWeight] = useState<number | string>(editingStudent?.weight ?? 42);
  const [height, setHeight] = useState<number | string>(editingStudent?.height ?? 150);
  const [visionLevel, setVisionLevel] = useState<VisionLevel>(editingStudent?.visionLevel || 'ធម្មតា');
  const [hearingLevel, setHearingLevel] = useState<HearingLevel>(editingStudent?.hearingLevel || 'ធម្មតា');
  const [limbDisability, setLimbDisability] = useState<string>(
    editingStudent?.limbDisability || (editingStudent?.hasDisability ? (editingStudent.disabilityInfo || 'ពិការអវយវៈ') : 'គ្មាន')
  );
  const [chronicDisease, setChronicDisease] = useState<string>(editingStudent?.chronicDisease || 'គ្មាន');

  // ស្ថានភាពគ្រួសារ ៣ កម្រិត
  const [familyStatusLevel, setFamilyStatusLevel] = useState<FamilyStatusLevel>(
    editingStudent?.familyStatusLevel ||
    (editingStudent?.poorLevel === 'កម្រិត១ (ក្រីក្រខ្លាំង)' ? 'ក្រីក្រកម្រិត១' : editingStudent?.poorLevel === 'កម្រិត២ (ក្រីក្រ)' ? 'ក្រីក្រកម្រិត២' : 'ជីវភាពមធ្យម')
  );

  const [fatherName, setFatherName] = useState<string>(editingStudent ? editingStudent.fatherName : '');
  const [fatherJob, setFatherJob] = useState<string>(editingStudent ? editingStudent.fatherJob : 'កសិករ');
  const [fatherPhone, setFatherPhone] = useState<string>(editingStudent ? editingStudent.fatherPhone : '');

  const [motherName, setMotherName] = useState<string>(editingStudent ? editingStudent.motherName : '');
  const [motherJob, setMotherJob] = useState<string>(editingStudent ? editingStudent.motherJob : 'មេផ្ទះ');
  const [motherPhone, setMotherPhone] = useState<string>(editingStudent ? editingStudent.motherPhone : '');

  const [guardianName, setGuardianName] = useState<string>(editingStudent ? editingStudent.guardianName : '');
  const [guardianPhone, setGuardianPhone] = useState<string>(editingStudent ? editingStudent.guardianPhone : '');

  const [photoUrl, setPhotoUrl] = useState<string>(
    editingStudent?.photoUrl || SAMPLE_AVATARS[0]
  );
  const [notes, setNotes] = useState<string>(editingStudent?.notes || '');

  // Sync state if editingStudent prop changes
  useEffect(() => {
    if (editingStudent) {
      setGrade(editingStudent.grade);
      setClassroom(editingStudent.classroom);
      setStudentCode(editingStudent.studentCode);
      setKhmerName(editingStudent.khmerName);
      setLatinName(editingStudent.latinName);
      setGender(editingStudent.gender);
      setDob(editingStudent.dob);
      setDobKhmer(editingStudent.dobKhmer || formatKhmerDate(editingStudent.dob));
      setPobVillage(editingStudent.pobVillage);
      setPobCommune(editingStudent.pobCommune);
      setPobDistrict(editingStudent.pobDistrict);
      setPobProvince(editingStudent.pobProvince);
      setCurrentAddress(editingStudent.currentAddress);
      setTrack(editingStudent.track);
      setStatus(editingStudent.status);
      setScholarship(editingStudent.scholarship);
      setPoorLevel(editingStudent.poorLevel);
      setHasDisability(editingStudent.hasDisability);
      setDisabilityInfo(editingStudent.disabilityInfo || '');
      setWeight(editingStudent.weight ?? 42);
      setHeight(editingStudent.height ?? 150);
      setVisionLevel(editingStudent.visionLevel || 'ធម្មតា');
      setHearingLevel(editingStudent.hearingLevel || 'ធម្មតា');
      setLimbDisability(editingStudent.limbDisability || (editingStudent.hasDisability ? (editingStudent.disabilityInfo || 'ពិការអវយវៈ') : 'គ្មាន'));
      setChronicDisease(editingStudent.chronicDisease || 'គ្មាន');
      setFamilyStatusLevel(
        editingStudent.familyStatusLevel ||
        (editingStudent.poorLevel === 'កម្រិត១ (ក្រីក្រខ្លាំង)' ? 'ក្រីក្រកម្រិត១' : editingStudent.poorLevel === 'កម្រិត២ (ក្រីក្រ)' ? 'ក្រីក្រកម្រិត២' : 'ជីវភាពមធ្យម')
      );
      setFatherName(editingStudent.fatherName);
      setFatherJob(editingStudent.fatherJob);
      setFatherPhone(editingStudent.fatherPhone);
      setMotherName(editingStudent.motherName);
      setMotherJob(editingStudent.motherJob);
      setMotherPhone(editingStudent.motherPhone);
      setGuardianName(editingStudent.guardianName);
      setGuardianPhone(editingStudent.guardianPhone);
      setPhotoUrl(editingStudent.photoUrl || SAMPLE_AVATARS[0]);
      setNotes(editingStudent.notes || '');
    }
  }, [editingStudent]);

  // Errors & success
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const handleDobChange = (newDob: string) => {
    setDob(newDob);
    setDobKhmer(formatKhmerDate(newDob));
  };

  // Synchronize family status level with IDPoor card level
  const handleFamilyStatusChange = (level: FamilyStatusLevel) => {
    setFamilyStatusLevel(level);
    if (level === 'ក្រីក្រកម្រិត១') {
      setPoorLevel('កម្រិត១ (ក្រីក្រខ្លាំង)');
      setScholarship(true);
    } else if (level === 'ក្រីក្រកម្រិត២') {
      setPoorLevel('កម្រិត២ (ក្រីក្រ)');
      setScholarship(true);
    } else {
      setPoorLevel('គ្មាន');
    }
  };

  const handlePoorLevelChange = (level: PoorLevel) => {
    setPoorLevel(level);
    if (level === 'កម្រិត១ (ក្រីក្រខ្លាំង)') {
      setFamilyStatusLevel('ក្រីក្រកម្រិត១');
      setScholarship(true);
    } else if (level === 'កម្រិត២ (ក្រីក្រ)') {
      setFamilyStatusLevel('ក្រីក្រកម្រិត២');
      setScholarship(true);
    } else {
      setFamilyStatusLevel('ជីវភាពមធ្យម');
    }
  };

  const handleGradeChange = (newGrade: GradeLevel) => {
    setGrade(newGrade);
    setClassroom(`${newGrade}A`);
    if (!editingStudent) {
      setStudentCode(defaultCodeForGrade(newGrade));
    }
  };

  const handleLimbDisabilityChange = (value: string) => {
    setLimbDisability(value);
    if (value !== 'គ្មាន') {
      setHasDisability(true);
      setDisabilityInfo(value);
    } else if (visionLevel === 'ធម្មតា' && hearingLevel === 'ធម្មតា') {
      setHasDisability(false);
      setDisabilityInfo('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!khmerName.trim()) {
      setErrorMessage('សូមបញ្ចូលគោត្តនាម និង នាម របស់សិស្សជាភាសាខ្មែរ');
      return;
    }

    if (!latinName.trim()) {
      setErrorMessage('សូមបញ្ចូលឈ្មោះជាអក្សរឡាតាំង (Latin Name)');
      return;
    }

    if (!dob) {
      setErrorMessage('សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើតរបស់សិស្ស');
      return;
    }

    // Determine disability status
    const actualHasDisability = hasDisability || 
      visionLevel !== 'ធម្មតា' || 
      hearingLevel !== 'ធម្មតា' || 
      (limbDisability !== 'គ្មាន' && limbDisability !== '');

    const newStudent: Student = {
      id: editingStudent ? editingStudent.id : `ST-${Date.now()}`,
      studentCode: studentCode.trim() || `830-${Date.now().toString().slice(-4)}`,
      khmerName: khmerName.trim(),
      latinName: latinName.trim().toUpperCase(),
      gender,
      dob,
      dobKhmer: dobKhmer || formatKhmerDate(dob),
      pobVillage: pobVillage.trim(),
      pobCommune: pobCommune.trim(),
      pobDistrict: pobDistrict.trim(),
      pobProvince: pobProvince.trim(),
      currentAddress: currentAddress.trim(),
      grade,
      classroom: classroom.trim() || `${grade}A`,
      track: grade >= 11 ? track : 'ទូទៅ',
      fatherName: fatherName.trim(),
      fatherJob: fatherJob.trim(),
      fatherPhone: fatherPhone.trim(),
      motherName: motherName.trim(),
      motherJob: motherJob.trim(),
      motherPhone: motherPhone.trim(),
      guardianName: guardianName.trim() || fatherName.trim() || motherName.trim() || 'ឪពុកម្តាយ',
      guardianPhone: guardianPhone.trim() || fatherPhone.trim() || motherPhone.trim() || '012 345 678',
      photoUrl,
      status,
      scholarship,
      poorLevel,
      hasDisability: actualHasDisability,
      disabilityInfo: disabilityInfo || (limbDisability !== 'គ្មាន' ? limbDisability : ''),
      registeredDate: editingStudent ? editingStudent.registeredDate : new Date().toISOString().split('T')[0],
      academicYear: schoolInfo.academicYear,
      notes: notes.trim(),

      // Health & socio-economic fields
      weight: weight ? Number(weight) : undefined,
      height: height ? Number(height) : undefined,
      visionLevel,
      hearingLevel,
      limbDisability,
      chronicDisease,
      familyStatusLevel,
    };

    onSaveStudent(newStudent);

    if (!editingStudent) {
      setRegisteredStudent(newStudent);
    }
  };

  const handleReset = () => {
    setKhmerName('');
    setLatinName('');
    setGender('ប្រុស');
    setDob('2012-05-15');
    setDobKhmer(formatKhmerDate('2012-05-15'));
    setPobVillage('ស្គន់');
    setPobCommune('សូទិព្វ');
    setPobDistrict('ជើងព្រៃ');
    setPobProvince('កំពង់ចាម');
    setCurrentAddress('ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម');
    setGrade(8);
    setClassroom('8A');
    setStudentCode(defaultCodeForGrade(8));
    setTrack('ទូទៅ');
    setStatus('សិស្សថ្មី');
    setFatherName('');
    setFatherJob('កសិករ');
    setFatherPhone('');
    setMotherName('');
    setMotherJob('មេផ្ទះ');
    setMotherPhone('');
    setGuardianName('');
    setGuardianPhone('');
    setWeight(42);
    setHeight(150);
    setVisionLevel('ធម្មតា');
    setHearingLevel('ធម្មតា');
    setLimbDisability('គ្មាន');
    setChronicDisease('គ្មាន');
    setFamilyStatusLevel('ជីវភាពមធ្យម');
    setPoorLevel('គ្មាន');
    setScholarship(false);
    setNotes('');
    setRegisteredStudent(null);
  };

  const calculatedBMI = calculateBMI(Number(weight), Number(height));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-blue-900 text-amber-300 shadow-2xs">
                <UserPlus className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {editingStudent ? 'កែប្រែព័ត៌មានសិស្ស' : 'ទម្រង់ចុះឈ្មោះសិស្សចូលរៀនថ្មី'}
                </h2>
                <p className="text-xs text-slate-500">
                  {schoolInfo.name} · ឆ្នាំសិក្សា {schoolInfo.academicYear} · MoEYS Standard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs bg-amber-50 text-amber-900 font-bold px-3.5 py-2 rounded-2xl border border-amber-200/80 shadow-2xs">
              ថ្នាក់គោលដៅ៖ <strong>ថ្នាក់ទី {toKhmerNum(grade)} ({classroom})</strong>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Progress Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-5 pb-2">
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
              ១
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-blue-950 truncate">កម្រិតថ្នាក់ & បន្ទប់</div>
              <div className="text-[10px] text-blue-600/90">Academics</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              ២
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 truncate">ជីវប្រវត្តិផ្ទាល់ខ្លួន</div>
              <div className="text-[10px] text-slate-500">Personal Info</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              ៣
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 truncate">សុខភាព & BMI</div>
              <div className="text-[10px] text-slate-500">Health & Fitness</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
              ៤
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 truncate">គ្រួសារ & អាណាព្យាបាល</div>
              <div className="text-[10px] text-slate-500">Family & IDPoor</div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* Section 1: Target Grade & Classroom */}
          <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <GraduationCap className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-bold text-slate-900">
                ១. កម្រិតថ្នាក់ និង បន្ទប់សិក្សា (Academic Placement)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ជ្រើសរើសកម្រិតថ្នាក់ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(Number(e.target.value) as GradeLevel)}
                  className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl font-bold text-blue-950 focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                >
                  <option value="7">ថ្នាក់ទី ៧</option>
                  <option value="8">ថ្នាក់ទី ៨ (ថ្នាក់គោលដៅ)</option>
                  <option value="9">ថ្នាក់ទី ៩</option>
                  <option value="10">ថ្នាក់ទី ១០</option>
                  <option value="11">ថ្នាក់ទី ១១</option>
                  <option value="12">ថ្នាក់ទី ១២</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  បន្ទប់រៀន <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="ឧ. 8A, 8B"
                  className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  អត្តលេខសិស្ស
                </label>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ស្ថានភាពសិស្ស
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StudentStatus)}
                  className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-medium"
                >
                  <option value="សិស្សថ្មី">សិស្សថ្មី</option>
                  <option value="ឡើងថ្នាក់">ឡើងថ្នាក់</option>
                  <option value="ត្រួតថ្នាក់">ត្រួតថ្នាក់</option>
                  <option value="ផ្ទេរចូល">ផ្ទេរចូល</option>
                </select>
              </div>
            </div>

            {grade >= 11 && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ផ្នែកសិក្សា (សម្រាប់ថ្នាក់ទី ១១ និង ១២)
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="studyTrack"
                      value="វិទ្យាសាស្ត្រ"
                      checked={track === 'វិទ្យាសាស្ត្រ'}
                      onChange={() => setTrack('វិទ្យាសាស្ត្រ')}
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span>ផ្នែកវិទ្យាសាស្ត្រ (គណិត រូប គីមី ជីវ)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="studyTrack"
                      value="វិទ្យាសាស្ត្រសង្គម"
                      checked={track === 'វិទ្យាសាស្ត្រសង្គម'}
                      onChange={() => setTrack('វិទ្យាសាស្ត្រសង្គម')}
                      className="text-blue-900 focus:ring-blue-900"
                    />
                    <span>ផ្នែកវិទ្យាសាស្ត្រសង្គម (ប្រវត្តិ ភូមិ ពលរដ្ឋ)</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Personal Biodata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <UserCheck className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-bold text-slate-900">
                ២. ព័ត៌មានផ្ទាល់ខ្លួនរបស់សិស្ស (Personal Biodata)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  គោត្តនាម និង នាម (អក្សរខ្មែរ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={khmerName}
                  onChange={(e) => setKhmerName(e.target.value)}
                  placeholder="ឧ. សុខ វិសាល"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold text-slate-900 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ឈ្មោះជាអក្សរឡាតាំង <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={latinName}
                  onChange={(e) => setLatinName(e.target.value.toUpperCase())}
                  placeholder="ឧ. SOK VISAL"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-sans tracking-wide uppercase font-semibold text-slate-900 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ភេទ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium text-slate-900 shadow-2xs"
                >
                  <option value="ប្រុស">ភេទ ប្រុស</option>
                  <option value="ស្រី">ភេទ ស្រី</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ថ្ងៃខែឆ្នាំកំណើត (គ.ស.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => handleDobChange(e.target.value)}
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ថ្ងៃខែឆ្នាំកំណើតជាភាសាខ្មែរ
                </label>
                <input
                  type="text"
                  value={dobKhmer}
                  onChange={(e) => setDobKhmer(e.target.value)}
                  placeholder="ថ្ងៃទី១៥ ខែមេសា ឆ្នាំ២០១២"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs text-slate-700"
                />
              </div>
            </div>

            {/* Place of Birth */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">ទីកន្លែងកំណើត (Place of Birth)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ភូមិ</label>
                  <input
                    type="text"
                    value={pobVillage}
                    onChange={(e) => setPobVillage(e.target.value)}
                    placeholder="ស្គន់"
                    className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ឃុំ / សង្កាត់</label>
                  <input
                    type="text"
                    value={pobCommune}
                    onChange={(e) => setPobCommune(e.target.value)}
                    placeholder="សូទិព្វ"
                    className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ស្រុក / ខណ្ឌ</label>
                  <input
                    type="text"
                    value={pobDistrict}
                    onChange={(e) => setPobDistrict(e.target.value)}
                    placeholder="ជើងព្រៃ"
                    className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">ខេត្ត / រាជធានី</label>
                  <input
                    type="text"
                    value={pobProvince}
                    onChange={(e) => setPobProvince(e.target.value)}
                    placeholder="កំពង់ចាម"
                    className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)
              </label>
              <input
                type="text"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម"
                className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Photo Avatar Picker */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                រូបថតសិស្ស (Student Photo / 4x6 cm)
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-slate-300 overflow-hidden bg-white shadow-2xs shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-[200px]">
                  <span className="text-xs text-slate-500 block">ជ្រើសរូបថតគំរូ ឬ បញ្ចូលតំណភ្ជាប់ URL៖</span>
                  <div className="flex gap-2">
                    {SAMPLE_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setPhotoUrl(url)}
                        className={`w-8 h-8 rounded-full overflow-hidden border-2 transition ${
                          photoUrl === url ? 'border-blue-900 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="បញ្ចូលតំណភ្ជាប់រូបភាព URL..."
                    className="w-full max-w-sm py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Health & Physical Assessment */}
          <div className="space-y-5 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-6 rounded-3xl border border-blue-100/90 shadow-2xs">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>៣. ព័ត៌មានសុខភាព និងកាយសម្បទាសិស្ស (MoEYS Health Standard)</span>
              </h3>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                ទិន្នន័យពិនិត្យសុខភាពសិស្ស
              </span>
            </div>

            {/* Sub-section: Weight, Height, BMI */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-700" />
                <span>កាយសម្បទា និងសន្ទស្សន៍ម៉ាសរាងកាយ (BMI Score)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    ទម្ងន់សិស្ស (គីឡូក្រាម - kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="20"
                      max="150"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="ឧ. 42"
                      className="w-full py-2.5 pl-3 pr-10 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    កម្ពស់សិស្ស (សង់ទីម៉ែត្រ - cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="80"
                      max="210"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="ឧ. 150"
                      className="w-full py-2.5 pl-3 pr-10 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">cm</span>
                  </div>
                </div>

                {/* Live BMI Result */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    សន្ទស្សន៍ BMI ស្វ័យប្រវត្តិ
                  </label>
                  {calculatedBMI ? (
                    <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold ${calculatedBMI.color} shadow-2xs`}>
                      <span className="font-mono tabular-nums">BMI: {toKhmerNum(calculatedBMI.bmi)}</span>
                      <span className="text-[11px] font-semibold">{calculatedBMI.label}</span>
                    </div>
                  ) : (
                    <div className="px-3 py-2.5 rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 text-center">
                      បញ្ចូលទម្ងន់ និងកម្ពស់
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-section: 3 Levels Vision & 3 Levels Hearing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Vision (3 Levels) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>កម្រិតគំហើញ (៣ កម្រិត - Vision)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    {visionLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['ធម្មតា', 'ខ្សោយមធ្យម', 'ពិការ/ខ្សោយខ្លាំង'] as VisionLevel[]).map((lvl) => {
                    const isSelected = visionLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setVisionLevel(lvl);
                          if (lvl !== 'ធម្មតា') setHasDisability(true);
                        }}
                        className={`py-2 px-1.5 text-center rounded-xl text-xs font-semibold border transition active:scale-98 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] leading-tight font-bold">{lvl}</div>
                        <div className="text-[9px] opacity-80 mt-0.5">
                          {lvl === 'ធម្មតា' ? 'ច្បាស់ល្អ' : lvl === 'ខ្សោយមធ្យម' ? 'ពាក់វ៉ែនតា' : 'ពិការភ្នែក'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hearing (3 Levels) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Ear className="w-3.5 h-3.5 text-teal-600" />
                    <span>កម្រិតស្ដាប់ (៣ កម្រិត - Hearing)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                    {hearingLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['ធម្មតា', 'ខ្សោយមធ្យម', 'ពិការ/ខ្សោយខ្លាំង'] as HearingLevel[]).map((lvl) => {
                    const isSelected = hearingLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setHearingLevel(lvl);
                          if (lvl !== 'ធម្មតា') setHasDisability(true);
                        }}
                        className={`py-2 px-1.5 text-center rounded-xl text-xs font-semibold border transition active:scale-98 ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] leading-tight font-bold">{lvl}</div>
                        <div className="text-[9px] opacity-80 mt-0.5">
                          {lvl === 'ធម្មតា' ? 'ស្ដាប់ឮច្បាស់' : lvl === 'ខ្សោយមធ្យម' ? 'ជំនួយសោត' : 'ថ្លង់/ពិការ'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-section: Limb Disability & Chronic Disease */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Limb Disability */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>ពិការភាពអវយវៈ (Limb Disability)</span>
                  {limbDisability !== 'គ្មាន' && (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      សិស្សមានពិការភាព
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  <select
                    value={limbDisability}
                    onChange={(e) => handleLimbDisabilityChange(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                  >
                    <option value="គ្មាន">គ្មាន (រាងកាយប្រក្រតី/គ្មានពិការភាព)</option>
                    <option value="ពិការដៃឆ្វេង">ពិការដៃឆ្វេង</option>
                    <option value="ពិការដៃស្តាំ">ពិការដៃស្តាំ</option>
                    <option value="ពិការជើងឆ្វេង">ពិការជើងឆ្វេង</option>
                    <option value="ពិការជើងស្តាំ">ពិការជើងស្តាំ</option>
                    <option value="ពិការជើងទាំងសងខាង">ពិការជើងទាំងសងខាង (ពិបាកដើរ)</option>
                    <option value="ពិការចលករ ឬពិការច្រើនប្រភេទ">ពិការចលករ ឬពិការច្រើនប្រភេទ</option>
                    <option value="ផ្សេងៗ">ផ្សេងៗ (បញ្ជាក់ខាងក្រោម)</option>
                  </select>

                  {limbDisability === 'ផ្សេងៗ' && (
                    <input
                      type="text"
                      value={disabilityInfo}
                      onChange={(e) => setDisabilityInfo(e.target.value)}
                      placeholder="បញ្ជាក់ប្រភេទពិការភាពអវយវៈជាក់លាក់..."
                      className="w-full py-2 px-3 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  )}
                </div>
              </div>

              {/* Chronic Disease */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>ជំងឺប្រចាំកាយ (Chronic Illness)</span>
                  {chronicDisease !== 'គ្មាន' && (
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      ត្រូវតាមដានសុខភាព
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  <select
                    value={
                      ['គ្មាន', 'ហឺត (Asthma)', 'ជំងឺបេះដូង', 'អាឡែកស៊ីចំណីអាហារ/ថ្នាំ', 'ជំងឺក្រពះពោះវៀន', 'ជំងឺទឹកនោមផ្អែម'].includes(chronicDisease)
                        ? chronicDisease
                        : 'ផ្សេងៗ'
                    }
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'ផ្សេងៗ') setChronicDisease('');
                      else setChronicDisease(v);
                    }}
                    className="w-full py-2.5 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                  >
                    <option value="គ្មាន">គ្មានជំងឺប្រចាំកាយ (សុខភាពល្អ)</option>
                    <option value="ហឺត (Asthma)">ជំងឺហឺត (Asthma)</option>
                    <option value="ជំងឺបេះដូង">ជំងឺបេះដូង</option>
                    <option value="អាឡែកស៊ីចំណីអាហារ/ថ្នាំ">អាឡែកស៊ីធ្ងន់ធ្ងរ (ចំណីអាហារ/ថ្នាំពេទ្យ)</option>
                    <option value="ជំងឺក្រពះពោះវៀន">ជំងឺក្រពះ ឬពោះវៀនរ៉ាំរ៉ៃ</option>
                    <option value="ជំងឺទឹកនោមផ្អែម">ជំងឺទឹកនោមផ្អែម</option>
                    <option value="ផ្សេងៗ">ផ្សេងៗ (បញ្ចូលផ្ទាល់)</option>
                  </select>

                  {!['គ្មាន', 'ហឺត (Asthma)', 'ជំងឺបេះដូង', 'អាឡែកស៊ីចំណីអាហារ/ថ្នាំ', 'ជំងឺក្រពះពោះវៀន', 'ជំងឺទឹកនោមផ្អែម'].includes(chronicDisease) && (
                    <input
                      type="text"
                      value={chronicDisease}
                      onChange={(e) => setChronicDisease(e.target.value)}
                      placeholder="បញ្ចូលឈ្មោះជំងឺប្រចាំកាយរបស់សិស្ស..."
                      className="w-full py-2 px-3 text-xs bg-white border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Parents & Guardian */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Phone className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-bold text-slate-900">
                ៤. ព័ត៌មានឪពុកម្តាយ ឬ អាណាព្យាបាល (Parents & Guardians)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ឈ្មោះឪពុក
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="ឧ. សុខ គឹមហុង"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  មុខរបរឪពុក
                </label>
                <input
                  type="text"
                  value={fatherJob}
                  onChange={(e) => setFatherJob(e.target.value)}
                  placeholder="កសិករ / មន្ត្រីរាជការ"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  លេខទូរស័ព្ទឪពុក
                </label>
                <input
                  type="text"
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ឈ្មោះម្តាយ
                </label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="ឧ. យឹម សុគន្ធា"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  មុខរបរម្តាយ
                </label>
                <input
                  type="text"
                  value={motherJob}
                  onChange={(e) => setMotherJob(e.target.value)}
                  placeholder="អាជីវករ / កសិករ"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  លេខទូរស័ព្ទម្តាយ
                </label>
                <input
                  type="text"
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value)}
                  placeholder="097 888 1234"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ឈ្មោះអាណាព្យាបាល (ប្រសិនបើរស់នៅជាមួយអ្នកដទៃ)
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="ទុកទទេ ប្រសិនបើជាឪពុកឬម្តាយ"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  លេខទូរស័ព្ទអាណាព្យាបាល
                </label>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="010 111 222"
                  className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Family Socio-Economic Status & Equity */}
          <div className="space-y-5 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 p-6 rounded-3xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-700" />
                <span>៥. ស្ថានភាពគ្រួសារ ៣ កម្រិត និងសមធម៌សង្គម (Family Status & Equity)</span>
              </h3>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                គោលនយោបាយគាំពារសង្គម
              </span>
            </div>

            {/* 3-Level Family Status Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                កម្រិតស្ថានភាពគ្រួសារសិស្ស (៣ កម្រិត) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Poor Level 1 */}
                <button
                  type="button"
                  onClick={() => handleFamilyStatusChange('ក្រីក្រកម្រិត១')}
                  className={`p-4 rounded-2xl border text-left transition transform active:scale-98 ${
                    familyStatusLevel === 'ក្រីក្រកម្រិត១'
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 text-rose-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-rose-800">ក្រីក្រកម្រិត ១</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                      ក្រីក្រខ្លាំង
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    មានប័ណ្ណសមធម៌កម្រិត ១ ទទួលបានអាហារូបករណ៍រដ្ឋ ១០០% និងកញ្ចប់ឧបត្ថម្ភ។
                  </p>
                </button>

                {/* Poor Level 2 */}
                <button
                  type="button"
                  onClick={() => handleFamilyStatusChange('ក្រីក្រកម្រិត២')}
                  className={`p-4 rounded-2xl border text-left transition transform active:scale-98 ${
                    familyStatusLevel === 'ក្រីក្រកម្រិត២'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-800">ក្រីក្រកម្រិត ២</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      ក្រីក្រ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    មានប័ណ្ណសមធម៌កម្រិត ២ ទទួលបានអាហារូបករណ៍សមធម៌ និងការលើកលែងថ្លៃសិក្សា។
                  </p>
                </button>

                {/* Medium / Normal */}
                <button
                  type="button"
                  onClick={() => handleFamilyStatusChange('ជីវភាពមធ្យម')}
                  className={`p-4 rounded-2xl border text-left transition transform active:scale-98 ${
                    familyStatusLevel === 'ជីវភាពមធ្យម'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-800">ជីវភាពមធ្យម</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      ធម្មតា / សមរម្យ
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    ជីវភាពរស់នៅធម្មតា សមរម្យ មិនមានប័ណ្ណសមធម៌ក្រីក្ររដ្ឋាភិបាលឡើយ។
                  </p>
                </button>
              </div>
            </div>

            {/* IDPoor Select & Scholarship Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ប័ណ្ណសមធម៌ក្រីក្រ (IDPoor Card)
                </label>
                <select
                  value={poorLevel}
                  onChange={(e) => handlePoorLevelChange(e.target.value as PoorLevel)}
                  className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs font-medium"
                >
                  <option value="គ្មាន">គ្មានប័ណ្ណក្រីក្រ</option>
                  <option value="កម្រិត១ (ក្រីក្រខ្លាំង)">ប័ណ្ណសមធម៌ កម្រិត ១ (ក្រីក្រខ្លាំង)</option>
                  <option value="កម្រិត២ (ក្រីក្រ)">ប័ណ្ណសមធម៌ កម្រិត ២ (ក្រីក្រ)</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-3 sm:pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800 select-none">
                  <input
                    type="checkbox"
                    checked={scholarship}
                    onChange={(e) => setScholarship(e.target.checked)}
                    className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                  />
                  <span>សិស្សទទួលបានអាហារូបករណ៍រដ្ឋ / សប្បុរសជន</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                កំណត់ចំណាំផ្សេងៗ ឬ ស្ថានភាពពិសេស
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="ចំណាំបន្ថែមអំពីស្ថានភាពសុខភាព គ្រួសារ ឯកសារផ្ទេរការសិក្សា ឬ ពាក្យសុំពិសេស..."
                className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>កំណត់ឡើងវិញ</span>
            </button>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  បោះបង់
                </button>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-2xs transition active:scale-98"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>{editingStudent ? 'រក្សាទុកការកែប្រែ' : 'ចុះឈ្មោះ និង រក្សាទុក'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {registeredStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              ចុះឈ្មោះសិស្សបានជោគជ័យ!
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              សិស្ស <strong className="text-slate-900 font-bold">{registeredStudent.khmerName}</strong> ({registeredStudent.latinName}) ត្រូវបានបញ្ចូលទៅក្នុងបញ្ជី <strong>ថ្នាក់ទី {toKhmerNum(registeredStudent.grade)} ({registeredStudent.classroom})</strong> នៃវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ដោយជោគជ័យ។
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 space-y-1.5 text-left border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">អត្តលេខ៖</span>
                <strong className="font-mono tabular-nums text-slate-900">{registeredStudent.studentCode}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">កាលបរិច្ឆេទចុះឈ្មោះ៖</span>
                <strong>{registeredStudent.registeredDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">អាណាព្យាបាល៖</span>
                <strong>{registeredStudent.guardianName} ({registeredStudent.guardianPhone})</strong>
              </div>
              {registeredStudent.weight && registeredStudent.height && (
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">ស្ថានភាព BMI៖</span>
                  {(() => {
                    const b = calculateBMI(registeredStudent.weight, registeredStudent.height);
                    return b ? (
                      <span className={`px-2 py-0.2 rounded-full font-bold text-[10px] border ${b.color}`}>
                        {toKhmerNum(b.bmi)} ({b.label})
                      </span>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onPrintApplicationForm(registeredStudent);
                  setRegisteredStudent(null);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold rounded-xl text-xs border border-blue-200 transition shadow-2xs active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ពពាក្យសុំ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onPrintStudentCard(registeredStudent);
                  setRegisteredStudent(null);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold rounded-xl text-xs transition shadow-2xs active:scale-98"
              >
                <IdCard className="w-4 h-4" />
                <span>បោះពុម្ពកាតសិស្ស</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              + ចុះឈ្មោះសិស្សថ្មីម្នាក់ទៀត
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
