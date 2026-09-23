'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  School, 
  Calendar, 
  MapPin,
  FileJson
} from 'lucide-react';
import { SchoolInfo, Student, GradeLevel, ScannedDocument } from '@/types/student';
import { SystemUser } from '@/types/user';
import { DEFAULT_SCHOOL_INFO } from '@/lib/seed-data';
import { ShieldAlert, Lock } from 'lucide-react';

interface SchoolSettingsProps {
  schoolInfo: SchoolInfo;
  students: Student[];
  documents?: ScannedDocument[];
  currentUser?: SystemUser;
  onSaveSchoolInfo: (info: SchoolInfo) => void;
  onRestoreData: (newStudents: Student[], newSchoolInfo: SchoolInfo, newDocuments?: ScannedDocument[]) => void;
  onResetToDefault: () => void;
}

export const SchoolSettings: React.FC<SchoolSettingsProps> = ({
  schoolInfo,
  students,
  documents = [],
  currentUser,
  onSaveSchoolInfo,
  onRestoreData,
  onResetToDefault,
}) => {
  const [form, setForm] = useState<SchoolInfo>(schoolInfo);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAdmin = !currentUser || currentUser.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('សិទ្ធិត្រូវបានកម្រិត៖ មានតែគណនី ADMIN (នាយកសាលា/អ្នកគ្រប់គ្រង) ប៉ុណ្ណោះដែលអាចកែប្រែទិន្នន័យសាលាបាន។');
      return;
    }
    onSaveSchoolInfo(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export full JSON Backup
  const handleExportBackup = () => {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      schoolInfo: form,
      students,
      documents,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `វិទ្យាល័យ_ហ៊ុន_សែន_ស្គន់_ទិន្នន័យ_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && Array.isArray(parsed.students)) {
          onRestoreData(parsed.students, parsed.schoolInfo || form, parsed.documents || []);
          alert(`បានស្តារទិន្នន័យដោយជោគជ័យ! សិស្ស ${parsed.students.length} នាក់ និងឯកសារស្គែន ${parsed.documents?.length || 0} ច្បាប់`);
        } else {
          alert('ទម្រង់ឯកសារ JSON មិនត្រឹមត្រូវឡើយ!');
        }
      } catch (err) {
        alert('មានកំហុសក្នុងការអានឯកសារ JSON!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Role Notice Banner */}
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-amber-950">
              របៀបមើលព័ត៌មានរដ្ឋបាល (Read-Only Mode)
            </div>
            <p className="text-amber-800">
              លោកអ្នកកំពុងប្រើប្រាស់គណនី <strong>User (បុគ្គលិក/គ្រូ)</strong>។ ការកែប្រែទិន្នន័យរដ្ឋបាលសាលា ការស្តារទិន្នន័យឡើងវិញ និងការកំណត់ឡើងវិញ តម្រូវឱ្យមានសិទ្ធិជា <strong>Admin</strong>។ លោកអ្នកនៅតែអាចទាញយកឯកសារ Backup (JSON) បានធម្មតា។
            </p>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                <Settings className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                ការកំណត់ទិន្នន័យរដ្ឋបាលរបស់សាលា
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              បំពេញ និងកែប្រែទិន្នន័យផ្លូវការរបស់វិទ្យាល័យ និងកាលបរិច្ឆេទសម្រាប់បោះពុម្ពឯកសារ
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>បានរក្សាទុកដោយជោគជ័យ!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* School Name & Academic Year */}
          <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 space-y-4">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <School className="w-4 h-4 text-blue-800" />
              <span>ទិន្នន័យមូលដ្ឋានរបស់វិទ្យាល័យ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះសាលា / វិទ្យាល័យ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="វិទ្យាល័យ ហ៊ុនសែន ស្គន់"
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg font-bold text-blue-950 focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឆ្នាំសិក្សា <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  placeholder="២០២៦-២០២៧"
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  សម្រាប់ថ្នាក់ទី (លំនាំដើម)
                </label>
                <select
                  value={form.defaultGrade}
                  onChange={(e) =>
                    setForm({ ...form, defaultGrade: Number(e.target.value) as GradeLevel })
                  }
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg font-bold text-amber-900"
                >
                  <option value="7">ថ្នាក់ទី ៧</option>
                  <option value="8">ថ្នាក់ទី ៨ (តាមការកំណត់)</option>
                  <option value="9">ថ្នាក់ទី ៩</option>
                  <option value="10">ថ្នាក់ទី ១០</option>
                  <option value="11">ថ្នាក់ទី ១១</option>
                  <option value="12">ថ្នាក់ទី ១២</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ក្រសួងសាមី
                </label>
                <input
                  type="text"
                  value={form.ministry}
                  onChange={(e) => setForm({ ...form, ministry: e.target.value })}
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  មន្ទីរអប់រំ យុវជន និងកីឡា
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Signature Dates */}
          <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/80 space-y-4">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>កាលបរិច្ឆេទចុះហត្ថលេខាផ្លូវការ (សម្រាប់ទម្រង់បោះពុម្ព)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                កាលបរិច្ឆេទចន្ទគតិ (Lunar Date)
              </label>
              <input
                type="text"
                value={form.lunarDate}
                onChange={(e) => setForm({ ...form, lunarDate: e.target.value })}
                placeholder="ថ្ងៃអង្គារ ២រោច ខែជេស្ឋ ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០"
                className="w-full py-2 px-3 text-sm bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                ឧទាហរណ៍៖ ថ្ងៃអង្គារ ២រោច ខែជេស្ឋ ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  កាលបរិច្ឆេទសូរ្យគតិ (Solar Date)
                </label>
                <input
                  type="text"
                  value={form.solarDate}
                  onChange={(e) => setForm({ ...form, solarDate: e.target.value })}
                  placeholder="ថ្ងៃទី២ ខែមិថុនា ឆ្នាំ២០២៦"
                  className="w-full py-2 px-3 text-sm bg-white border border-amber-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ទីតាំងចុះហត្ថលេខា
                </label>
                <input
                  type="text"
                  value={form.locationName}
                  onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                  placeholder="ស្គន់"
                  className="w-full py-2 px-3 text-sm bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Leaders & Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              គណៈគ្រប់គ្រង និង អាសយដ្ឋាន
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  នាយកវិទ្យាល័យ
                </label>
                <input
                  type="text"
                  value={form.principalName}
                  onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                  placeholder="លោកគ្រូ នាយកវិទ្យាល័យ"
                  className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  លេខទូរស័ព្ទទំនាក់ទំនង
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="042 941 234"
                  className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                អាសយដ្ឋានទីតាំងវិទ្យាល័យ
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម"
                className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={!isAdmin}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${
                isAdmin
                  ? 'bg-blue-900 hover:bg-blue-800 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title={isAdmin ? 'រក្សាទុកទិន្នន័យសាលា' : 'ទាមទារសិទ្ធិជា Admin'}
            >
              {isAdmin ? <Save className="w-4 h-4 text-amber-300" /> : <Lock className="w-4 h-4" />}
              <span>{isAdmin ? 'រក្សាទុកទិន្នន័យសាលា' : 'ទាមទារសិទ្ធិជា Admin'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup, Restore, and Reset */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-blue-900" />
          <span>ការបម្រុងទុក និង ស្តារទិន្នន័យប្រព័ន្ធ (Backup & Restore)</span>
        </h3>
        <p className="text-xs text-slate-500">
          អ្នកអាចទាញយកទិន្នន័យសិស្សទាំងអស់ជាឯកសារ JSON ដើម្បីរក្សាទុក ឬផ្ទេរទៅកាន់កុំព្យូទ័រផ្សេង។
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Download JSON Backup */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>ទាញយកទិន្នន័យបម្រុងទុក (JSON)</span>
          </button>

          {/* Restore JSON Backup */}
          <label className={`flex items-center justify-center gap-2 p-4 border rounded-xl text-xs font-bold transition ${
            isAdmin
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 cursor-pointer'
              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
          }`}>
            <Upload className={`w-4 h-4 ${isAdmin ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>{isAdmin ? 'ស្តារទិន្នន័យពី JSON' : 'ស្តារទិន្នន័យ (Admin)'}</span>
            {isAdmin && (
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            )}
          </label>

          {/* Reset to Default */}
          <button
            type="button"
            disabled={!isAdmin}
            onClick={() => {
              if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យត្រឡប់ទៅសភាពដើមរបស់វិទ្យាល័យ ហ៊ុន សែន ស្គន់ មែនទេ?')) {
                onResetToDefault();
                setForm(DEFAULT_SCHOOL_INFO);
              }
            }}
            className={`flex items-center justify-center gap-2 p-4 border rounded-xl text-xs font-bold transition ${
              isAdmin
                ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={isAdmin ? 'កំណត់ឡើងវិញ' : 'ទាមទារសិទ្ធិជា Admin'}
          >
            {isAdmin ? <RotateCcw className="w-4 h-4 text-red-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
            <span>{isAdmin ? 'កំណត់ឡើងវិញជាទិន្នន័យគំរូ' : 'កំណត់ឡើងវិញ (Admin)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
