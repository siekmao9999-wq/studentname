export type Gender = 'ប្រុស' | 'ស្រី';

export type GradeLevel = 7 | 8 | 9 | 10 | 11 | 12;

export type StudyTrack = 'ទូទៅ' | 'វិទ្យាសាស្ត្រ' | 'វិទ្យាសាស្ត្រសង្គម';

export type StudentStatus = 'សិស្សថ្មី' | 'ឡើងថ្នាក់' | 'ត្រួតថ្នាក់' | 'ផ្ទេរចូល' | 'ផ្ទេរចេញ' | 'បោះបង់ការសិក្សា';

export type PoorLevel = 'គ្មាន' | 'កម្រិត១ (ក្រីក្រខ្លាំង)' | 'កម្រិត២ (ក្រីក្រ)';

// កម្រិតគំហើញ ៣ កម្រិត (MoEYS Standard)
export type VisionLevel = 'ធម្មតា' | 'ខ្សោយមធ្យម' | 'ពិការ/ខ្សោយខ្លាំង';

// កម្រិតស្ដាប់ ៣ កម្រិត (MoEYS Standard)
export type HearingLevel = 'ធម្មតា' | 'ខ្សោយមធ្យម' | 'ពិការ/ខ្សោយខ្លាំង';

// ស្ថានភាពគ្រួសារ ៣ កម្រិត
export type FamilyStatusLevel = 'ក្រីក្រកម្រិត១' | 'ក្រីក្រកម្រិត២' | 'ជីវភាពមធ្យម';

export interface Student {
  id: string; // Unique ID (e.g., HSS-2026-0001)
  studentCode: string; // អត្តលេខសិស្ស
  khmerName: string; // គោត្តនាម និង នាម
  latinName: string; // ឈ្មោះជាអក្សរឡាតាំង
  gender: Gender;
  dob: string; // ថ្ងៃខែឆ្នាំកំណើត YYYY-MM-DD
  dobKhmer?: string; // e.g. ថ្ងៃទី១២ ខែតុលា ឆ្នាំ២០១២
  pobVillage: string; // ភូមិកំណើត
  pobCommune: string; // ឃុំ/សង្កាត់កំណើត
  pobDistrict: string; // ស្រុក/ខណ្ឌកំណើត
  pobProvince: string; // ខេត្ត/រាជធានីកំណើត
  currentAddress: string; // អាសយដ្ឋានបច្ចុប្បន្ន
  grade: GradeLevel; // ថ្នាក់ទី (៧-១២)
  classroom: string; // បន្ទប់រៀន (e.g. 8A, 8B, 11A1)
  track: StudyTrack; // ផ្នែកសិក្សា
  status: StudentStatus;
  scholarship: boolean; // សិស្សអាហារូបករណ៍
  poorLevel: PoorLevel; // ប័ណ្ណសមធម៌ក្រីក្រ
  hasDisability: boolean;
  disabilityInfo?: string;
  
  // ព័ត៌មានសុខភាព និងកាយសម្បទាសិស្ស (Health & Physical Data)
  weight?: number; // ទម្ងន់ (គីឡូក្រាម - kg)
  height?: number; // កម្ពស់ (សង់ទីម៉ែត្រ - cm)
  visionLevel?: VisionLevel; // កម្រិតគំហើញ (៣ កម្រិត៖ ធម្មតា, ខ្សោយមធ្យម, ពិការ/ខ្សោយខ្លាំង)
  hearingLevel?: HearingLevel; // កម្រិតស្ដាប់ (៣ កម្រិត៖ ធម្មតា, ខ្សោយមធ្យម, ពិការ/ខ្សោយខ្លាំង)
  limbDisability?: string; // ពិការភាពអវយវៈ (គ្មាន, ពិការដៃ, ពិការជើង, ពិការចលករ...)
  chronicDisease?: string; // ជំងឺប្រចាំកាយ (គ្មាន, ហឺត, បេះដូង, អាឡែកស៊ី...)
  
  // ព័ត៌មានស្ថានភាពគ្រួសារ ៣ កម្រិត (Family Socio-Economic Status)
  familyStatusLevel?: FamilyStatusLevel; // ស្ថានភាពគ្រួសារ (ក្រីក្រកម្រិត១, ក្រីក្រកម្រិត២, ជីវភាពមធ្យម)
  
  fatherName: string;
  fatherJob: string;
  fatherPhone: string;
  motherName: string;
  motherJob: string;
  motherPhone: string;
  guardianName: string;
  guardianPhone: string;
  photoUrl: string;
  registeredDate: string;
  academicYear?: string;
  notes?: string;
}

export interface SchoolInfo {
  name: string; // វិទ្យាល័យ ហ៊ុន សែន ស្គន់
  ministry: string; // ក្រសួងអប់រំ យុវជន និងកីឡា
  department: string; // មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកំពង់ចាម
  office: string; // ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកជើងព្រៃ
  academicYear: string; // ២០២៦-២០២៧
  defaultGrade: GradeLevel; // ថ្នាក់ទី ៨
  locationName: string; // ស្គន់
  lunarDate: string; // ថ្ងៃអង្គារ ២រោច ខែជេស្ឋ ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០
  solarDate: string; // ថ្ងៃទី២ ខែមិថុនា ឆ្នាំ២០២៦
  principalName: string; // នាយកវិទ្យាល័យ
  deputyPrincipalName: string; // នាយករង
  phone: string;
  email: string;
  address: string;
}

export type DocumentCategory = 
  | 'សំបុត្រកំណើត' 
  | 'វិញ្ញាបនបត្របឋមសិក្សា' 
  | 'សៀវភៅតាមដានការសិក្សា' 
  | 'លិខិតផ្ទេរការសិក្សា' 
  | 'ប័ណ្ណសមធម៌ក្រីក្រ' 
  | 'ពាក្យសុំចុះឈ្មោះចូលរៀន'
  | 'រូបថតសិស្ស'
  | 'ឯកសារផ្សេងៗ';

export interface ScannedDocument {
  id: string; // DOC-2026-001
  title: string;
  category: DocumentCategory;
  grade: GradeLevel; // Auto-classified grade (7-12)
  studentId?: string; // Linked student ID if matched
  studentNameKhmer: string;
  studentNameLatin: string;
  dob?: string;
  dobKhmer?: string;
  gender?: Gender;
  pob?: string;
  fatherName?: string;
  motherName?: string;
  fileDataUrl: string; // image or base64 preview
  scannedAt: string;
  classificationReason: string;
  confidenceScore: number;
  notes?: string;
}
