'use client';

import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  Upload, 
  Folder, 
  FolderOpen, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Trash2, 
  Printer, 
  UserPlus, 
  ExternalLink, 
  Filter, 
  Search, 
  Clock, 
  Check, 
  RefreshCw,
  X,
  FileCheck,
  ChevronRight,
  School,
  ArrowRight,
  SwitchCamera,
  AlertTriangle
} from 'lucide-react';
import { 
  ScannedDocument, 
  DocumentCategory, 
  GradeLevel, 
  Student, 
  SchoolInfo 
} from '@/types/student';
import { SAMPLE_SCAN_TEMPLATES } from '@/lib/seed-documents';
import { toKhmerNum, formatKhmerDate } from '@/lib/khmer-utils';

interface DocumentScannerProps {
  documents: ScannedDocument[];
  students: Student[];
  schoolInfo: SchoolInfo;
  onAddDocument: (doc: ScannedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onEnrollFromDoc?: (extractedData: Partial<Student>) => void;
  onLinkToStudent?: (docId: string, studentId: string) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  documents,
  students,
  schoolInfo,
  onAddDocument,
  onDeleteDocument,
  onEnrollFromDoc,
}) => {
  // Active selected folder grade tab ('all' or 7..12)
  const [activeFolderGrade, setActiveFolderGrade] = useState<GradeLevel | 'all'>(8);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Scanning state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<'idle' | 'analyzing' | 'completed'>('idle');
  const [scannedResult, setScannedResult] = useState<ScannedDocument | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const directCaptureInputRef = useRef<HTMLInputElement | null>(null);

  // Modal preview
  const [modalDoc, setModalDoc] = useState<ScannedDocument | null>(null);

  // Start Camera with resilient fallback
  const startCamera = async (targetFacing?: 'environment' | 'user') => {
    setCameraError(null);
    setIsCameraActive(true);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('កម្មវិធីរុករក (Browser) ឬទំព័រ iFrame មិនអនុញ្ញាតឱ្យបើក stream វីដេអូកាមេរ៉ាផ្ទាល់ (getUserMedia) ឡើយ។ លោកគ្រូ-អ្នកគ្រូអាចប្រើប៊ូតុង "ថតរូបផ្ទាល់ពីទូរស័ព្ទ (Direct Snap)" ខាងក្រោមជំនួសវិញបានយ៉ាងងាយស្រួល!');
      return;
    }

    // Stop existing stream tracks if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const desiredFacing = targetFacing || cameraFacing;
    let stream: MediaStream | null = null;

    try {
      // Attempt 1: preferred facing mode with ideal resolution
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: desiredFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (err1) {
      console.warn('Attempt 1 with facingMode failed, trying generic video constraints:', err1);
      try {
        // Attempt 2: generic video constraints (works universally on laptops, MacBooks, PCs, external webcams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err2: any) {
        console.error('All camera initialization attempts failed:', err2);
        let errorMsg = 'មិនអាចដំណើរការកាមេរ៉ាផ្ទាល់បានទេ។ ';
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          errorMsg += 'មូលហេតុ៖ Browser បានបដិសេធសិទ្ធិប្រើកាមេរ៉ា (Camera Permission Blocked)។ សូមចុចអនុញ្ញាត (Allow Camera) នៅលើ URL bar ឬប្រើប៊ូតុង «ថតរូបផ្ទាល់ពីទូរស័ព្ទ (Direct Snap)» ខាងក្រោម។';
        } else if (err2.name === 'NotFoundError' || err2.name === 'DevicesNotFoundError') {
          errorMsg += 'មូលហេតុ៖ មិនមានឧបករណ៍កាមេរ៉ាភ្ជាប់នៅលើកុំព្យូទ័រនេះទេ។';
        } else if (err2.name === 'NotReadableError' || err2.name === 'TrackStartError') {
          errorMsg += 'មូលហេតុ៖ កាមេរ៉ាកំពុងត្រូវបានប្រើប្រាស់ដោយកម្មវិធីផ្សេង (ឧ. Zoom, Google Meet)។';
        } else {
          errorMsg += (err2.message || 'សូមប្រើប៊ូតុង «ថតរូបផ្ទាល់ពីទូរស័ព្ទ (Direct Snap)» ជំនួសវិញ។');
        }
        setCameraError(errorMsg);
        return;
      }
    }

    if (stream) {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
          } catch (e) {
            console.warn('Video play interrupted:', e);
          }
        };
      }
    }
  };

  // Toggle Camera Facing (Front <-> Back)
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  // Capture from live camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCamera();
      processDocumentScan(dataUrl, 'រូបថតស្គែនពីកាមេរ៉ា វិទ្យាល័យ ហ៊ុន សែន ស្គន់');
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      processDocumentScan(dataUrl, `ឯកសារឈ្មោះ៖ ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Run AI OCR & Auto-classification
  const processDocumentScan = async (imageDataUrl: string, promptText: string, presetData?: any) => {
    setPreviewImage(imageDataUrl);
    setIsScanning(true);
    setScanStep('analyzing');
    setScannedResult(null);

    try {
      let finalDoc: ScannedDocument;

      if (presetData) {
        // Fast instant preset simulation
        await new Promise((r) => setTimeout(r, 900));
        finalDoc = {
          id: `DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
          title: `${presetData.category} - ${presetData.khmerName}`,
          category: presetData.category,
          grade: presetData.grade,
          studentNameKhmer: presetData.khmerName,
          studentNameLatin: presetData.latinName,
          gender: presetData.gender,
          dob: presetData.dob,
          dobKhmer: presetData.dobKhmer,
          pob: `ភូមិ${presetData.pobVillage} ឃុំ${presetData.pobCommune} ស្រុក${presetData.pobDistrict} ខេត្ត${presetData.pobProvince}`,
          fatherName: presetData.fatherName,
          motherName: presetData.motherName,
          fileDataUrl: imageDataUrl,
          scannedAt: new Date().toISOString().slice(0, 10),
          classificationReason: presetData.reason,
          confidenceScore: 98,
          notes: 'បានស្គែន និងតម្រៀបចូលក្នុង File កម្រិតថ្នាក់ដោយជោគជ័យតាមប្រព័ន្ធស្វ័យប្រវត្តិ',
        };
      } else {
        // Real API call to /api/gemini
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: 'scan_document',
            prompt: promptText,
            imageBase64: imageDataUrl,
            mimeType: 'image/jpeg',
          }),
        });

        const data = await res.json();
        const parsed = data.result;

        // Auto grade determination logic fallback
        const detectedGrade: GradeLevel = 
          parsed?.detectedGrade >= 7 && parsed?.detectedGrade <= 12 
            ? parsed.detectedGrade 
            : 8;

        const cat: DocumentCategory = parsed?.documentType || 'សំបុត្រកំណើត';
        const kName = parsed?.khmerName || 'សិស្សទើបស្គែន';
        const lName = parsed?.latinName || 'NEW STUDENT';

        finalDoc = {
          id: `DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
          title: `${cat} - ${kName}`,
          category: cat,
          grade: detectedGrade,
          studentNameKhmer: kName,
          studentNameLatin: lName,
          gender: parsed?.gender || 'ប្រុស',
          dob: parsed?.dob || '2012-05-15',
          dobKhmer: parsed?.dobKhmer || 'ឆ្នាំ២០១២',
          pob: parsed?.pobVillage ? `ភូមិ${parsed.pobVillage} ឃុំ${parsed.pobCommune || 'សូទិព្វ'} ស្រុកជើងព្រៃ` : 'ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
          fatherName: parsed?.fatherName || '',
          motherName: parsed?.motherName || '',
          fileDataUrl: imageDataUrl,
          scannedAt: new Date().toISOString().slice(0, 10),
          classificationReason: parsed?.classificationReason || `បានកំណត់ចូលក្នុងថត ថ្នាក់ទី ${toKhmerNum(detectedGrade)} ដោយស្វ័យប្រវត្តិតាមការវិភាគ OCR`,
          confidenceScore: parsed?.confidence || 95,
          notes: parsed?.extractedText || '',
        };
      }

      setScannedResult(finalDoc);
      setScanStep('completed');
    } catch (err: any) {
      console.error(err);
      setCameraError('មានបញ្ហាក្នុងការស្គែន ឬវិភាគឯកសារ។ សូមសាកល្បងរូបភាពច្បាស់ជាងនេះ ឬសាកល្បងម្តងទៀត។');
      setScanStep('idle');
      setIsScanning(false);
    }
  };

  // Confirm auto-file into grade folder
  const handleSaveToGradeFolder = (docToSave: ScannedDocument) => {
    onAddDocument(docToSave);
    setActiveFolderGrade(docToSave.grade);
    setIsScanning(false);
    setScanStep('idle');
    setScannedResult(null);
    setPreviewImage(null);
  };

  // Filter documents in cabinet
  const filteredDocs = documents.filter((doc) => {
    if (activeFolderGrade !== 'all' && doc.grade !== activeFolderGrade) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.studentNameKhmer.toLowerCase().includes(q);
      const matchLatin = doc.studentNameLatin.toLowerCase().includes(q);
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchId = doc.id.toLowerCase().includes(q);
      if (!matchName && !matchLatin && !matchTitle && !matchId) return false;
    }
    return true;
  });

  const gradeCounts = [7, 8, 9, 10, 11, 12].reduce((acc, g) => {
    acc[g] = documents.filter((d) => d.grade === g).length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner & Scanner Hub */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>បច្ចេកវិទ្យា AI OCR & Smart Auto-Filing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-kantumruy tracking-tight">
                ស្គែនឯកសារ និងចាត់ថ្នាក់ចូល File តាមកម្រិតថ្នាក់អូតូ
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
                ស្គែនសំបុត្រកំណើត វិញ្ញាបនបត្របឋម សៀវភៅតាមដាន លិខិតផ្ទេរ ឬប័ណ្ណសមធម៌ — ប្រព័ន្ធ AI នឹងអានទិន្នន័យ ស្វែងរកអត្តសញ្ញាណ និងតម្រៀបចូលក្នុង File ថតថ្នាក់ទី ៧ ដល់ ១២ ដោយស្វ័យប្រវត្តិ!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0">
              <div className="text-center px-3 border-r border-white/20">
                <div className="text-2xl font-bold text-amber-300 font-kantumruy">
                  {toKhmerNum(documents.length)}
                </div>
                <div className="text-[10px] text-blue-200">ឯកសារសរុប</div>
              </div>
              <div className="text-center px-3">
                <div className="text-2xl font-bold text-emerald-300 font-kantumruy">
                  {toKhmerNum(gradeCounts[8] || 0)}
                </div>
                <div className="text-[10px] text-blue-200">ថ្នាក់ទី ៨ (គោលដៅ)</div>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Live Camera Button */}
            <button
              onClick={() => {
                if (isCameraActive) stopCamera();
                else startCamera();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Camera className="w-4 h-4 text-blue-950" />
              <span>{isCameraActive ? 'បិទកាមេរ៉ា' : 'បើកកាមេរ៉ាស្គែនផ្ទាល់ (Live Scan)'}</span>
            </button>

            {/* Direct Mobile/OS Camera Shutter (Guaranteed to work on all phones, tablets, and iframes) */}
            <button
              type="button"
              onClick={() => directCaptureInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>ថតរូបឯកសារភ្លាមៗ (Direct Snap)</span>
            </button>
            <input
              ref={directCaptureInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* File Upload Button */}
            <label className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer transform active:scale-95">
              <Upload className="w-4 h-4 text-blue-800" />
              <span>បញ្ចូលរូបថត/ឯកសារ (Upload File)</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Hint */}
            <span className="text-xs text-blue-200/80 flex items-center gap-1.5 ml-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>គាំទ្រ៖ រូបថតច្បាស់, JPEG, PNG, PDF</span>
            </span>
          </div>
        </div>
      </div>

      {/* Live Camera Viewport (When active) */}
      {isCameraActive && (
        <div className="bg-slate-900 rounded-3xl p-6 border-2 border-amber-400 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between text-white border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-sm">កាមេរ៉ាស្គែនឯកសារផ្ទាល់ (វិទ្យាល័យ ហ៊ុន សែន ស្គន់)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!cameraError && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  title="ប្តូរកាមេរ៉ាមុខ / ក្រោយ"
                >
                  <SwitchCamera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cameraFacing === 'environment' ? 'កាមេរ៉ាក្រោយ' : 'កាមេរ៉ាមុខ'}</span>
                </button>
              )}
              <button
                onClick={stopCamera}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* If there was a camera permission or device error */}
          {cameraError ? (
            <div className="bg-slate-800/90 border border-amber-500/40 rounded-2xl p-6 text-center space-y-4 max-w-xl mx-auto my-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-white text-base">
                  ពុំអាចបើក Live Camera Stream បានឡើយ
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cameraError}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    directCaptureInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-bold rounded-xl text-xs shadow-md transition transform active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>ថតរូបឯកសារភ្លាមៗ (Direct Photo Snap)</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="flex items-center gap-1.5 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-xs transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>សាកល្បងបើកម្តងទៀត</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[4/3] max-w-xl mx-auto flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Guide overlay box */}
                <div className="absolute inset-8 border-2 border-dashed border-amber-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3 text-center">
                  <span className="text-[11px] text-amber-300 bg-black/60 px-2 py-0.5 rounded self-center">
                    ដាក់ឯកសារ (សំបុត្រកំណើត / សៀវភៅតាមដាន) ឱ្យពេញប្រអប់នេះ
                  </span>
                  <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded self-center">
                    ប្រព័ន្ធនឹងអានអក្សរ និងចាត់ថ្នាក់ចូល File ដោយស្វ័យប្រវត្តិ
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-bold rounded-2xl shadow-lg transition transform active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>ថតស្គែនឯកសារ (Capture & Auto-Classify)</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-2xl transition"
                >
                  បោះបង់
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Test Demo Templates (One-click auto test) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>សាកល្បងស្គែនរហ័សជាមួយគំរូឯកសារផ្លូវការ (Quick One-Click Test Templates)៖</span>
          </span>
          <span className="text-[11px] text-slate-400">
            ចុចដើម្បីសាកល្បងមើលការចាត់ថ្នាក់អូតូ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_SCAN_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => processDocumentScan(tmpl.fileUrl, tmpl.textSnippet, tmpl)}
              className="flex flex-col text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 transition group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-900 text-amber-300 text-[10px] font-bold">
                  {tmpl.badge}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-blue-700 font-semibold flex items-center gap-0.5">
                  <span>ស្គែនភ្លាម</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-900 leading-tight">
                {tmpl.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                សិស្ស៖ {tmpl.khmerName} ({tmpl.latinName})
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Processing / Scanning Status Overlay */}
      {isScanning && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-600 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <Scan className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {scanStep === 'analyzing'
                    ? 'កំពុងវិភាគអត្ថបទ OCR និងចាត់ថ្នាក់កម្រិតថ្នាក់...'
                    : 'ការស្គែន និងចាត់ថ្នាក់ចូល File បានជោគជ័យ!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {scanStep === 'analyzing'
                    ? 'Gemini Multimodal កំពុងអានឈ្មោះ អាយុ ថ្ងៃកំណើត និងស្វែងរកកម្រិតថ្នាក់ដែលត្រូវចាត់ថ្នាក់'
                    : 'សូមពិនិត្យលទ្ធផលដែលបានស្រង់ចេញ និងជ្រើសរើសសកម្មភាពខាងក្រោម'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsScanning(false);
                setScanStep('idle');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading Animation */}
          {scanStep === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-900 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <div className="font-bold text-sm text-slate-800">
                  កំពុងសម្គាល់ឯកសាររដ្ឋបាលកម្ពុជា...
                </div>
                <div className="text-xs text-slate-500">
                  កំណត់កម្រិតថ្នាក់ (៧ ដល់ ១២) · ផ្ទៀងផ្ទាត់បញ្ជីឈ្មោះ · គណនាអាយុ
                </div>
              </div>
            </div>
          )}

          {/* Scanned Result Card */}
          {scanStep === 'completed' && scannedResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Image Preview */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm relative group">
                  <img
                    src={scannedResult.fileDataUrl}
                    alt="Scanned Document"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                    {scannedResult.category}
                  </div>
                </div>

                {/* Extracted Details */}
                <div className="md:col-span-2 space-y-4">
                  {/* Target Folder Recommendation Badge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        ចាត់ថ្នាក់ចូល File ថតស្វ័យប្រវត្តិ (Auto-Filing)
                      </span>
                      <div className="text-lg font-bold flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-amber-400" />
                        <span>ថតឯកសារ៖ ថ្នាក់ទី {toKhmerNum(scannedResult.grade)}</span>
                        {scannedResult.grade === 8 && (
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-blue-950 text-xs font-bold">
                            ថ្នាក់គោលដៅ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-100 pt-0.5">
                        {scannedResult.classificationReason}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-amber-300">
                        {toKhmerNum(scannedResult.confidenceScore)}%
                      </div>
                      <div className="text-[10px] text-blue-200">កម្រិតភាពជាក់លាក់</div>
                    </div>
                  </div>

                  {/* Student Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">គោត្តនាម-នាម៖</span>
                      <strong className="text-sm font-bold text-blue-950 font-kantumruy">
                        {scannedResult.studentNameKhmer}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">ឈ្មោះជាឡាតាំង៖</span>
                      <strong className="text-xs font-bold text-slate-800 uppercase font-sans">
                        {scannedResult.studentNameLatin || 'N/A'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">ភេទ៖</span>
                      <strong className="text-xs font-bold text-slate-800">
                        {scannedResult.gender || 'មិនបញ្ជាក់'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                      <strong className="text-xs font-bold text-slate-800">
                        {scannedResult.dobKhmer || scannedResult.dob || 'មិនបញ្ជាក់'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">ឈ្មោះឪពុក៖</span>
                      <strong className="text-xs font-bold text-slate-800">
                        {scannedResult.fatherName || 'មិនបញ្ជាក់'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">ឈ្មោះម្តាយ៖</span>
                      <strong className="text-xs font-bold text-slate-800">
                        {scannedResult.motherName || 'មិនបញ្ជាក់'}
                      </strong>
                    </div>

                    <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200/80">
                      <span className="text-slate-500 block text-[11px]">ទីកន្លែងកំណើត៖</span>
                      <strong className="text-xs font-medium text-slate-800">
                        {scannedResult.pob || 'ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Scanned Document */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsScanning(false);
                    setScanStep('idle');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  បោះបង់
                </button>

                {onEnrollFromDoc && (
                  <button
                    type="button"
                    onClick={() => {
                      onEnrollFromDoc({
                        khmerName: scannedResult.studentNameKhmer,
                        latinName: scannedResult.studentNameLatin,
                        gender: scannedResult.gender,
                        dob: scannedResult.dob,
                        dobKhmer: scannedResult.dobKhmer,
                        grade: scannedResult.grade,
                        fatherName: scannedResult.fatherName,
                        motherName: scannedResult.motherName,
                      });
                      handleSaveToGradeFolder(scannedResult);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>បង្កើតសិស្សថ្មីពីឯកសារនេះ (Auto-Enroll)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveToGradeFolder(scannedResult)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  <FolderOpen className="w-4 h-4 text-amber-300" />
                  <span>រក្សាទុកចូលក្នុង File ថ្នាក់ទី {toKhmerNum(scannedResult.grade)} ភ្លាមៗ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DIGITAL FILE CABINET: Grade-Level Folders (ថតឯកសារតាមកម្រិតថ្នាក់ ៧-១២) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-900" />
              <span>បណ្ណសារឯកសារអេឡិចត្រូនិចតាមកម្រិតថ្នាក់ (Digital File Cabinet)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ឯកសារទាំងអស់ត្រូវបានស្គែន និងតម្រៀបទុកដោយស្វ័យប្រវត្តិតាមកម្រិតថ្នាក់ ថ្នាក់ទី ៧ ដល់ ទី ១២
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              សរុបឯកសារក្នុងប្រព័ន្ធ៖ <strong>{toKhmerNum(documents.length)}</strong> ច្បាប់
            </span>
          </div>
        </div>

        {/* Grade Folder Tabs (៧, ៨, ៩, ១០, ១១, ១២, និង ទាំងអស់) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* All Folder Tab */}
          <button
            onClick={() => setActiveFolderGrade('all')}
            className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeFolderGrade === 'all'
                ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Folder className={`w-5 h-5 ${activeFolderGrade === 'all' ? 'text-amber-300' : 'text-blue-900'}`} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeFolderGrade === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {toKhmerNum(documents.length)}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold font-kantumruy">គ្រប់កម្រិតថ្នាក់</div>
              <div className={`text-[10px] ${activeFolderGrade === 'all' ? 'text-blue-200' : 'text-slate-400'}`}>
                ឯកសារទាំងអស់
              </div>
            </div>
          </button>

          {/* Grade 7 to 12 Tabs */}
          {([7, 8, 9, 10, 11, 12] as GradeLevel[]).map((g) => {
            const count = gradeCounts[g] || 0;
            const isSelected = activeFolderGrade === g;
            const isFeatured = g === 8;

            return (
              <button
                key={g}
                onClick={() => setActiveFolderGrade(g)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? isFeatured
                      ? 'bg-gradient-to-br from-blue-950 to-blue-900 text-white border-amber-400 shadow-lg ring-2 ring-amber-400/40'
                      : 'bg-blue-900 text-white border-blue-900 shadow-md'
                    : isFeatured
                    ? 'bg-amber-50/70 border-amber-200 text-slate-800 hover:bg-amber-100/70'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isFeatured && (
                  <span className="absolute top-0 right-0 px-2 py-0.5 bg-amber-400 text-blue-950 text-[9px] font-bold rounded-bl-lg">
                    គោលដៅ
                  </span>
                )}

                <div className="flex items-center justify-between mb-2">
                  <FolderOpen
                    className={`w-5 h-5 ${
                      isSelected
                        ? 'text-amber-300'
                        : isFeatured
                        ? 'text-amber-600'
                        : 'text-blue-900'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isFeatured
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {toKhmerNum(count)}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold font-kantumruy">
                    ថត ថ្នាក់ទី {toKhmerNum(g)}
                  </div>
                  <div
                    className={`text-[10px] ${
                      isSelected ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {count === 0 ? 'ពុំទាន់មាន' : `${toKhmerNum(count)} ឯកសារ`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter & Search inside Folder */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះសិស្ស, អត្តលេខ, ឬប្រភេទឯកសារ..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-700"
            >
              <option value="all">គ្រប់ប្រភេទឯកសារ</option>
              <option value="សំបុត្រកំណើត">សំបុត្រកំណើត</option>
              <option value="វិញ្ញាបនបត្របឋមសិក្សា">វិញ្ញាបនបត្របឋមសិក្សា</option>
              <option value="សៀវភៅតាមដានការសិក្សា">សៀវភៅតាមដានការសិក្សា</option>
              <option value="លិខិតផ្ទេរការសិក្សា">លិខិតផ្ទេរការសិក្សា</option>
              <option value="ប័ណ្ណសមធម៌ក្រីក្រ">ប័ណ្ណសមធម៌ក្រីក្រ</option>
              <option value="ពាក្យសុំចុះឈ្មោះចូលរៀន">ពាក្យសុំចុះឈ្មោះ</option>
            </select>
          </div>
        </div>

        {/* Files Grid in this Grade Folder */}
        <div>
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
              <Folder className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-600 text-sm">
                ពុំទាន់មានឯកសារស្គែនក្នុងថតនេះនៅឡើយទេ
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                លោកគ្រូ-អ្នកគ្រូអាចចុចប៊ូតុង &quot;បើកកាមេរ៉ាស្គែន&quot; ឬ &quot;បញ្ចូលរូបថត&quot; ខាងលើ ដើម្បីស្គែនឯកសារថ្មីចូលដោយស្វ័យប្រវត្តិ
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Meta */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold">
                        {doc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        ថ្នាក់ទី {toKhmerNum(doc.grade)}
                      </span>
                    </div>

                    {/* Image Preview & Student Name */}
                    <div className="flex gap-3 items-center">
                      <img
                        src={doc.fileDataUrl}
                        alt={doc.title}
                        className="w-16 h-20 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0 cursor-pointer hover:opacity-90 transition"
                        onClick={() => setModalDoc(doc)}
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate font-kantumruy">
                          {doc.studentNameKhmer}
                        </h4>
                        <div className="text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wide truncate">
                          {doc.studentNameLatin || 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          ភេទ៖ <strong>{doc.gender || 'មិនបញ្ជាក់'}</strong> · កើត៖ <strong>{doc.dobKhmer || doc.dob || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Classification Reason Tag */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 line-clamp-2">
                      <span className="font-semibold text-blue-900">មូលហេតុ៖ </span>
                      {doc.classificationReason}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{doc.scannedAt}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModalDoc(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition"
                        title="មើលឯកសារពេញ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`តើអ្នកពិតជាចង់លុបឯកសារ "${doc.title}" នេះមែនទេ?`)) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="លុបឯកសារ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: Full Document Preview & Profile Details */}
      {/* ========================================================= */}
      {modalDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold">
                  {modalDoc.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-kantumruy">
                  {modalDoc.title}
                </h3>
              </div>

              <button
                onClick={() => setModalDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Image Full View */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center p-2 max-h-96">
              <img
                src={modalDoc.fileDataUrl}
                alt={modalDoc.title}
                className="max-h-88 object-contain rounded-xl"
              />
            </div>

            {/* Extracted Details Table */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>ព័ត៌មានដែលបានស្រង់ចេញដោយស្វ័យប្រវត្តិតាម OCR</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <span className="text-slate-500 block">គោត្តនាម-នាម៖</span>
                  <strong className="text-sm font-bold text-slate-900">{modalDoc.studentNameKhmer}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">ឈ្មោះឡាតាំង៖</span>
                  <strong className="text-xs font-bold text-slate-800 uppercase">{modalDoc.studentNameLatin || 'N/A'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">កម្រិតថ្នាក់ដែលបានតម្រៀប៖</span>
                  <strong className="text-xs font-bold text-blue-900">ថ្នាក់ទី {toKhmerNum(modalDoc.grade)}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">ភេទ៖</span>
                  <strong>{modalDoc.gender || 'មិនបញ្ជាក់'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">ថ្ងៃខែឆ្នាំកំណើត៖</span>
                  <strong>{modalDoc.dobKhmer || modalDoc.dob || 'មិនបញ្ជាក់'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block">ឪពុក/ម្តាយ៖</span>
                  <strong>{modalDoc.fatherName || modalDoc.motherName || 'មិនបញ្ជាក់'}</strong>
                </div>

                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-500 block">ទីកន្លែងកំណើត៖</span>
                  <strong>{modalDoc.pob || 'ភូមិស្គន់ ឃុំសូទិព្វ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម'}</strong>
                </div>

                <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block">ហេតុផលនៃការចាត់ថ្នាក់៖</span>
                  <span className="text-blue-900 font-semibold">{modalDoc.classificationReason}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>បោះពុម្ពឯកសារ</span>
              </button>

              <button
                type="button"
                onClick={() => setModalDoc(null)}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition"
              >
                បិទផ្ទាំង
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
