// Khmer number and date formatting helpers

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KHMER_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

export function toKhmerNum(num: number | string): string {
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)]);
}

export function fromKhmerNum(str: string): string {
  return str.replace(/[០-៩]/g, (char) => {
    const idx = KHMER_DIGITS.indexOf(char);
    return idx !== -1 ? String(idx) : char;
  });
}

export function formatKhmerDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = toKhmerNum(date.getDate());
  const month = KHMER_MONTHS[date.getMonth()];
  const year = toKhmerNum(date.getFullYear());

  return `ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${toKhmerNum(parts[2])}/${toKhmerNum(parts[1])}/${toKhmerNum(parts[0])}`;
  }
  return dateStr;
}

// Khmer alphabetical comparison for Khmer names
export function compareKhmer(a: string, b: string): number {
  return a.localeCompare(b, 'km', { sensitivity: 'accent' });
}

// គណនាសន្ទស្សន៍ម៉ាសរាងកាយ (BMI) សម្រាប់សុខភាពសិស្ស
export function calculateBMI(weightKg?: number, heightCm?: number): {
  bmi: number;
  label: string;
  color: string;
} | null {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  if (bmi < 18.5) {
    return { bmi, label: 'ស្គម', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else if (bmi <= 23.9) {
    return { bmi, label: 'សមរម្យ/ធម្មតា', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  } else if (bmi <= 27.9) {
    return { bmi, label: 'លើសទម្ងន់បន្តិច', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  } else {
    return { bmi, label: 'លើសទម្ងន់ខ្លាំង', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }
}
