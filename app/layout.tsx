import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស - វិទ្យាល័យ ហ៊ុន សែន ស្គន់',
  description: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស និងស្ថិតិសិស្សចូលរៀនពីថ្នាក់ទី ៧ ដល់ទី ១២ នៅវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ឆ្នាំសិក្សា ២០២៦-២០២៧',
  openGraph: {
    title: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស - វិទ្យាល័យ ហ៊ុន សែន ស្គន់',
    description: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស និងស្ថិតិសិស្សចូលរៀនពីថ្នាក់ទី ៧ ដល់ទី ១២ នៅវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ឆ្នាំសិក្សា ២០២៦-២០២៧',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស - វិទ្យាល័យ ហ៊ុន សែន ស្គន់',
    description: 'ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះសិស្ស និងស្ថិតិសិស្សចូលរៀនពីថ្នាក់ទី ៧ ដល់ទី ១២ នៅវិទ្យាល័យ ហ៊ុន សែន ស្គន់ ឆ្នាំសិក្សា ២០២៦-២០២៧',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="km" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Moul&family=Battambang:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full font-['Kantumruy_Pro',sans-serif] bg-slate-50 text-slate-900 antialiased selection:bg-amber-200 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
