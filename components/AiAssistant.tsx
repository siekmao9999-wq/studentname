'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  CheckCheck, 
  Bell, 
  HelpCircle,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { Student, SchoolInfo } from '@/types/student';
import { toKhmerNum } from '@/lib/khmer-utils';

interface AiAssistantProps {
  students: Student[];
  schoolInfo: SchoolInfo;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ students, schoolInfo }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = students.length;
  const females = students.filter((s) => s.gender === 'ស្រី').length;
  const grade8Count = students.filter((s) => s.grade === 8).length;

  const handleAsk = async (customPrompt?: string, task?: string) => {
    const textToQuery = customPrompt || prompt;
    if (!textToQuery.trim()) return;

    setLoading(true);
    setResponse('');

    // Context summary to feed into Gemini
    const contextPrompt = `ទិន្នន័យវិទ្យាល័យ៖
- ឈ្មោះសាលា៖ ${schoolInfo.name}
- ទីតាំង៖ ${schoolInfo.locationName} (${schoolInfo.department})
- ឆ្នាំសិក្សា៖ ${schoolInfo.academicYear}
- កាលបរិច្ឆេទចន្ទគតិ៖ ${schoolInfo.lunarDate}
- កាលបរិច្ឆេទសូរ្យគតិ៖ ${schoolInfo.solarDate}
- ចំនួនសិស្សសរុប៖ ${total} នាក់ (ស្រី ${females} នាក់)
- ចំនួនសិស្សថ្នាក់ទី ៨៖ ${grade8Count} នាក់

សំណូមពរ៖
${textToQuery}`;

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: contextPrompt, task }),
      });
      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
      } else if (data.error) {
        setResponse(`កំហុស៖ ${data.error}`);
      }
    } catch (err: any) {
      setResponse(`មានបញ្ហាបច្ចេកទេស៖ ${err?.message || 'សូមព្យាយាមម្តងទៀត'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preset tasks
  const presets = [
    {
      label: 'ព្រាងរបាយការណ៍សង្ខេបជូនមន្ទីរអប់រំ',
      icon: FileText,
      task: 'របាយការណ៍សង្ខេប',
      text: 'សូមជួយរៀបចំរបាយការណ៍សង្ខេបជាផ្លូវការអំពីលទ្ធផលនៃការចុះឈ្មោះសិស្សចូលរៀនឆ្នាំសិក្សា២០២៦-២០២៧ នៅវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ដើម្បីផ្ញើជូនមន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ចាម ដោយបញ្ជាក់ពីចំនួនសិស្សសរុប សិស្សស្រី និងសិស្សថ្នាក់ទី៨។',
    },
    {
      label: 'ព្រាងសេចក្តីជូនដំណឹងដល់អាណាព្យាបាល',
      icon: Bell,
      task: 'សេចក្តីជូនដំណឹង',
      text: 'សូមជួយព្រាងសេចក្តីជូនដំណឹងមួយច្បាប់របស់វិទ្យាល័យ ហ៊ុន សែន ស្គន់ ជូនចំពោះមាតាបិតា និងអាណាព្យាបាលសិស្ស ថ្នាក់ទី ៧ ដល់ ទី ១២ អំពីកាលបរិច្ឆេទចុះឈ្មោះចូលរៀន ឯកសារចាំបាច់ត្រូវភ្ជាប់មកជាមួយ និងកាលបរិច្ឆេទបើកបវេសនកាលថ្មី។',
    },
    {
      label: 'ពិនិត្យបញ្ជីឈ្មោះសិស្ស និងអក្ខរាវិរុទ្ធ',
      icon: CheckCheck,
      task: 'ផ្ទៀងផ្ទាត់ទិន្នន័យ',
      text: 'សូមផ្តល់យោបល់ និងគោលការណ៍ណែនាំស្តង់ដារក្រសួងអប់រំក្នុងការផ្ទៀងផ្ទាត់ និងកត់ត្រាឈ្មោះសិស្សជាអក្សរឡាតាំង (Latin transliteration) ឱ្យបានត្រឹមត្រូវតាមសំបុត្រកំណើត និងអត្តសញ្ញាណប័ណ្ណ។',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-amber-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ជំនួយការរដ្ឋបាលឆ្លាតវៃ AI (វិទ្យាល័យ ហ៊ុន សែន ស្គន់)
            </h2>
            <p className="text-xs text-slate-500">
              ជួយសម្រួលការងារលោកគ្រូ-អ្នកគ្រូក្នុងការព្រាងរបាយការណ៍ សេចក្តីជូនដំណឹង និងការផ្ទៀងផ្ទាត់ទិន្នន័យ
            </p>
          </div>
        </div>

        {/* Preset Task Buttons */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            កិច្ចការគំរូរហ័ស៖
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.text);
                    handleAsk(p.text, p.task);
                  }}
                  className="flex items-start gap-2 p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition text-xs group"
                >
                  <Icon className="w-4 h-4 text-blue-700 mt-0.5 shrink-0 group-hover:scale-110 transition" />
                  <span className="font-semibold text-slate-700 group-hover:text-blue-900">
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            បញ្ចូលសំណួរ ឬ សេចក្តីណែនាំដែលលោកគ្រូ-អ្នកគ្រូចង់ឱ្យ AI ជួយ៖
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ឧទាហរណ៍៖ សូមជួយសរសេរលិខិតអញ្ជើញអាណាព្យាបាលសិស្សថ្នាក់ទី៨ មកចូលរួមប្រជុំដើមឆ្នាំសិក្សា២០២៦-២០២៧..."
              rows={3}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              ដំណើរការដោយ Gemini 2.5 Flash នៃ Google AI Studio
            </span>
            <button
              onClick={() => handleAsk()}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'កំពុងដំណើរការ...' : 'ផ្ញើសំណើ'}</span>
            </button>
          </div>
        </div>

        {/* Response Box */}
        {response && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>លទ្ធផលពីជំនួយការ AI៖</span>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'បានចម្លង!' : 'ចម្លងអត្ថបទ'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-kantumruy">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
